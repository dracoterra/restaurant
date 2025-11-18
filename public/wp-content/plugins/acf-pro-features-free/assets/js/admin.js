/**
 * JavaScript para la interfaz de administración
 * Maneja campos Repeater, Flexible Content y Clone
 */

(function($) {
    'use strict';
    
    /**
     * Inicializar cuando el documento esté listo
     */
    $(document).ready(function() {
        initRepeaterFields();
        initFlexibleContentFields();
        initCloneFields();
    });
    
    /**
     * Inicializar campos Repeater
     */
    function initRepeaterFields() {
        // Buscar todos los campos repeater
        $('.acf-field-repeater').each(function() {
            var $field = $(this);
            var $repeater = $field.find('.acf-repeater');
            
            if ($repeater.length === 0) {
                return;
            }
            
            // Hacer las filas ordenables
            if ($repeater.data('layout') !== 'table') {
                $repeater.find('.acf-rows').sortable({
                    handle: '.acf-row-handle',
                    axis: 'y',
                    opacity: 0.6,
                    update: function() {
                        updateRepeaterIndices($repeater);
                    }
                });
            }
            
            // Agregar evento al botón de agregar
            $repeater.on('click', '.acf-button-add', function(e) {
                e.preventDefault();
                addRepeaterRow($repeater);
            });
            
            // Agregar evento al botón de eliminar
            $repeater.on('click', '.acf-button-remove', function(e) {
                e.preventDefault();
                removeRepeaterRow($(this).closest('.acf-row'));
            });
        });
    }
    
    /**
     * Agregar fila al repeater
     */
    function addRepeaterRow($repeater) {
        var $rows = $repeater.find('.acf-rows');
        var $template = $repeater.find('.acf-row-template');
        
        if ($template.length === 0) {
            // Crear fila desde cero
            var rowHtml = createRepeaterRowHtml($repeater);
            $rows.append(rowHtml);
        } else {
            // Clonar template
            var $newRow = $template.clone();
            $newRow.removeClass('acf-row-template acf-clone');
            $newRow.addClass('acf-row');
            $rows.append($newRow);
        }
        
        // Actualizar índices
        updateRepeaterIndices($repeater);
        
        // Inicializar campos en la nueva fila
        var $newRow = $rows.find('.acf-row').last();
        initRowFields($newRow);
        
        // Trigger evento personalizado
        $repeater.trigger('acf/add_row', [$newRow]);
    }
    
    /**
     * Eliminar fila del repeater
     */
    function removeRepeaterRow($row) {
        if (!confirm(acfProFeatures.strings.confirmDelete)) {
            return;
        }
        
        var $repeater = $row.closest('.acf-repeater');
        $row.fadeOut(300, function() {
            $(this).remove();
            updateRepeaterIndices($repeater);
            $repeater.trigger('acf/remove_row');
        });
    }
    
    /**
     * Actualizar índices de las filas
     */
    function updateRepeaterIndices($repeater) {
        $repeater.find('.acf-row').each(function(index) {
            var $row = $(this);
            $row.attr('data-index', index);
            
            // Actualizar nombres de campos
            $row.find('[name*="[row-"]').each(function() {
                var $field = $(this);
                var name = $field.attr('name');
                name = name.replace(/\[row-\d+\]/, '[row-' + index + ']');
                $field.attr('name', name);
            });
        });
    }
    
    /**
     * Crear HTML de fila repeater
     */
    function createRepeaterRowHtml($repeater) {
        var layout = $repeater.data('layout') || 'table';
        var fieldKey = $repeater.data('key');
        var rowIndex = $repeater.find('.acf-row').length;
        
        var html = '<div class="acf-row" data-index="' + rowIndex + '">';
        
        if (layout === 'table') {
            html += '<td class="acf-row-handle"><span class="acf-icon acf-icon-move"></span></td>';
        } else {
            html += '<div class="acf-row-handle"><span class="acf-icon acf-icon-move"></span></div>';
            html += '<div class="acf-row-header">';
            html += '<span class="acf-row-title">Fila ' + (rowIndex + 1) + '</span>';
            html += '<div class="acf-row-controls">';
            html += '<a href="#" class="acf-button-remove">' + acfProFeatures.strings.removeRow + '</a>';
            html += '</div>';
            html += '</div>';
        }
        
        html += '<div class="acf-row-content">';
        // Los campos se agregarán aquí dinámicamente
        html += '</div>';
        
        if (layout === 'table') {
            html += '<td class="acf-row-controls">';
            html += '<a href="#" class="acf-button-remove">' + acfProFeatures.strings.removeRow + '</a>';
            html += '</td>';
        }
        
        html += '</div>';
        
        return html;
    }
    
    /**
     * Inicializar campos de una fila
     */
    function initRowFields($row) {
        // Inicializar selector de medios para campos de imagen
        $row.find('.acf-field-image').each(function() {
            initImageField($(this));
        });
        
        // Inicializar otros tipos de campos según sea necesario
    }
    
    /**
     * Inicializar campo de imagen
     */
    function initImageField($field) {
        $field.find('.acf-button-select').on('click', function(e) {
            e.preventDefault();
            
            var $button = $(this);
            var $input = $field.find('input[type="hidden"]');
            var $preview = $field.find('.acf-image-preview');
            
            var frame = wp.media({
                title: 'Seleccionar Imagen',
                button: {
                    text: 'Usar esta imagen'
                },
                multiple: false
            });
            
            frame.on('select', function() {
                var attachment = frame.state().get('selection').first().toJSON();
                $input.val(attachment.id);
                
                if ($preview.length === 0) {
                    $preview = $('<div class="acf-image-preview"></div>');
                    $field.append($preview);
                }
                
                $preview.html('<img src="' + attachment.url + '" alt="' + attachment.alt + '" />');
            });
            
            frame.open();
        });
    }
    
    /**
     * Inicializar campos Flexible Content
     */
    function initFlexibleContentFields() {
        $('.acf-field-flexible_content').each(function() {
            var $field = $(this);
            var $flexible = $field.find('.acf-flexible-content');
            
            if ($flexible.length === 0) {
                return;
            }
            
            // Agregar evento a botones de layout
            $flexible.on('click', '.acf-button-add-layout', function(e) {
                e.preventDefault();
                var layoutName = $(this).data('layout');
                addFlexibleLayout($flexible, layoutName);
            });
            
            // Agregar evento a botón de eliminar
            $flexible.on('click', '.acf-layout-remove', function(e) {
                e.preventDefault();
                removeFlexibleLayout($(this).closest('.acf-layout'), $flexible);
            });
            
            // Hacer layouts ordenables
            var $container = $flexible.find('.acf-layouts-container');
            if ($container.length > 0 && typeof $.fn.sortable !== 'undefined') {
                $container.sortable({
                    handle: '.acf-layout-handle',
                    axis: 'y',
                    opacity: 0.6,
                    update: function() {
                        updateFlexibleLayoutIndices($flexible);
                    }
                });
            }
            
            // Inicializar campos de imagen en layouts existentes
            $flexible.find('.acf-field-image').each(function() {
                initImageField($(this));
            });
        });
    }
    
    /**
     * Agregar layout a flexible content
     */
    function addFlexibleLayout($flexible, layoutName) {
        var $container = $flexible.find('.acf-layouts-container');
        var $template = $flexible.find('.acf-layout-template[data-layout="' + layoutName + '"]');
        
        if ($template.length === 0) {
            console.error('Template no encontrado para layout:', layoutName);
            return;
        }
        
        // Obtener el siguiente índice
        var nextIndex = $container.find('.acf-layout').length;
        
        // Clonar template
        var $newLayout = $($template.html());
        $newLayout.removeClass('acf-layout-template acf-clone');
        $newLayout.addClass('acf-layout');
        $newLayout.attr('data-index', nextIndex);
        
        // Reemplazar placeholders en el HTML
        var layoutHtml = $newLayout[0].outerHTML;
        layoutHtml = layoutHtml.replace(/\{\{layout_index\}\}/g, nextIndex);
        $newLayout = $(layoutHtml);
        
        // Agregar al contenedor
        $container.append($newLayout);
        
        // Actualizar índices
        updateFlexibleLayoutIndices($flexible);
        
        // Inicializar campos en el nuevo layout
        var $newLayoutElement = $container.find('.acf-layout').last();
        initLayoutFields($newLayoutElement);
        
        // Verificar límites
        checkFlexibleContentLimits($flexible);
        
        // Trigger evento personalizado
        $flexible.trigger('acf/add_layout', [$newLayoutElement, layoutName]);
    }
    
    /**
     * Eliminar layout de flexible content
     */
    function removeFlexibleLayout($layout, $flexible) {
        if (!confirm(acfProFeatures.strings.confirmDelete || '¿Eliminar este layout?')) {
            return;
        }
        
        $layout.fadeOut(300, function() {
            $(this).remove();
            updateFlexibleLayoutIndices($flexible);
            checkFlexibleContentLimits($flexible);
            $flexible.trigger('acf/remove_layout');
        });
    }
    
    /**
     * Actualizar índices de layouts
     */
    function updateFlexibleLayoutIndices($flexible) {
        var $container = $flexible.find('.acf-layouts-container');
        var fieldKey = $flexible.data('key');
        
        $container.find('.acf-layout').each(function(index) {
            var $layout = $(this);
            $layout.attr('data-index', index);
            
            // Actualizar nombres de campos
            $layout.find('input, textarea, select').each(function() {
                var $field = $(this);
                var name = $field.attr('name');
                
                if (name) {
                    // Reemplazar índice en el nombre del campo
                    name = name.replace(/\[(\d+)\]/, '[' + index + ']');
                    $field.attr('name', name);
                }
            });
            
            // Actualizar IDs de editores WYSIWYG
            $layout.find('textarea.wp-editor-area').each(function() {
                var $textarea = $(this);
                var id = $textarea.attr('id');
                if (id) {
                    var newId = id.replace(/_(\d+)_/, '_' + index + '_');
                    $textarea.attr('id', newId);
                    
                    // Si existe el editor, actualizarlo
                    if (typeof tinyMCE !== 'undefined' && tinyMCE.get(id)) {
                        var editor = tinyMCE.get(id);
                        editor.id = newId;
                        editor.settings.id = newId;
                    }
                }
            });
        });
    }
    
    /**
     * Inicializar campos de un layout
     */
    function initLayoutFields($layout) {
        // Inicializar selector de medios para campos de imagen
        $layout.find('.acf-field-image').each(function() {
            initImageField($(this));
        });
        
        // Inicializar editores WYSIWYG si están disponibles
        if (typeof tinyMCE !== 'undefined') {
            $layout.find('textarea.wp-editor-area').each(function() {
                var $textarea = $(this);
                var id = $textarea.attr('id');
                if (id && !tinyMCE.get(id)) {
                    // Inicializar editor si no existe
                    if (typeof quicktags !== 'undefined') {
                        quicktags({id: id});
                    }
                    if (typeof wp !== 'undefined' && wp.editor) {
                        wp.editor.initialize(id, {
                            tinymce: true,
                            quicktags: true
                        });
                    }
                }
            });
        }
    }
    
    /**
     * Verificar límites de flexible content
     */
    function checkFlexibleContentLimits($flexible) {
        var min = parseInt($flexible.data('min')) || 0;
        var max = parseInt($flexible.data('max')) || 0;
        var $container = $flexible.find('.acf-layouts-container');
        var currentCount = $container.find('.acf-layout').length;
        
        // Ocultar/mostrar botones según límites
        if (max > 0 && currentCount >= max) {
            $flexible.find('.acf-button-add-layout').prop('disabled', true).addClass('disabled');
        } else {
            $flexible.find('.acf-button-add-layout').prop('disabled', false).removeClass('disabled');
        }
        
        // Mostrar mensaje si está por debajo del mínimo
        if (min > 0 && currentCount < min) {
            var $notice = $flexible.find('.acf-notice-min');
            if ($notice.length === 0) {
                $notice = $('<div class="acf-notice acf-notice-min">Se requieren al menos ' + min + ' layouts.</div>');
                $flexible.prepend($notice);
            }
        } else {
            $flexible.find('.acf-notice-min').remove();
        }
    }
    
    /**
     * Inicializar campos Clone
     */
    function initCloneFields() {
        $('.acf-clone-field').each(function() {
            var $field = $(this);
            
            // Inicializar campos de imagen dentro de clone
            $field.find('.acf-field-image').each(function() {
                initImageField($(this));
            });
            
            // Inicializar editores WYSIWYG si están disponibles
            if (typeof tinyMCE !== 'undefined') {
                $field.find('textarea.wp-editor-area').each(function() {
                    var $textarea = $(this);
                    var id = $textarea.attr('id');
                    if (id && !tinyMCE.get(id)) {
                        if (typeof wp !== 'undefined' && wp.editor) {
                            wp.editor.initialize(id, {
                                tinymce: true,
                                quicktags: true
                            });
                        }
                    }
                });
            }
        });
    }
    
    /**
     * Guardar datos del repeater
     */
    function saveRepeaterData($repeater) {
        var data = [];
        
        $repeater.find('.acf-row').each(function() {
            var $row = $(this);
            var rowData = {};
            
            $row.find('input, textarea, select').each(function() {
                var $field = $(this);
                var name = $field.attr('name');
                var value = $field.val();
                
                if (name) {
                    // Extraer nombre del campo del name
                    var match = name.match(/\[([^\]]+)\]/g);
                    if (match) {
                        var fieldName = match[match.length - 1].replace(/[\[\]]/g, '');
                        rowData[fieldName] = value;
                    }
                }
            });
            
            if (Object.keys(rowData).length > 0) {
                data.push(rowData);
            }
        });
        
        return data;
    }
    
    /**
     * Guardar antes de enviar el formulario
     */
    $(document).on('submit', '#post', function() {
        $('.acf-repeater').each(function() {
            var $repeater = $(this);
            var fieldName = $repeater.data('name');
            var data = saveRepeaterData($repeater);
            
            // Crear input hidden con los datos
            var $hidden = $('<input>', {
                type: 'hidden',
                name: 'acf_pro_features_repeater[' + fieldName + ']',
                value: JSON.stringify(data)
            });
            
            $(this).append($hidden);
        });
    });
    
})(jQuery);

