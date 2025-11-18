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
        initGalleryFields();
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
     * Inicializar campos Gallery
     */
    function initGalleryFields() {
        $('.acf-field-gallery').each(function() {
            var $field = $(this);
            var $gallery = $field.find('.acf-gallery');
            
            if ($gallery.length === 0) {
                return;
            }
            
            // Agregar imágenes
            $gallery.on('click', '.acf-gallery-add', function(e) {
                e.preventDefault();
                openGalleryMediaFrame($gallery, false);
            });
            
            // Editar galería
            $gallery.on('click', '.acf-gallery-edit', function(e) {
                e.preventDefault();
                openGalleryMediaFrame($gallery, true);
            });
            
            // Limpiar galería
            $gallery.on('click', '.acf-gallery-clear', function(e) {
                e.preventDefault();
                if (confirm(acfProFeatures.strings.confirmDelete || '¿Eliminar todas las imágenes?')) {
                    clearGallery($gallery);
                }
            });
            
            // Eliminar imagen individual
            $gallery.on('click', '.acf-gallery-remove', function(e) {
                e.preventDefault();
                var $attachment = $(this).closest('.acf-gallery-attachment');
                removeGalleryAttachment($gallery, $attachment);
            });
            
            // Hacer imágenes ordenables
            var $attachments = $gallery.find('.acf-gallery-attachments');
            if ($attachments.length > 0 && typeof $.fn.sortable !== 'undefined') {
                $attachments.sortable({
                    items: '.acf-gallery-attachment',
                    forceHelperSize: true,
                    forcePlaceholderSize: true,
                    scroll: true,
                    opacity: 0.6,
                    update: function() {
                        updateGalleryValue($gallery);
                    }
                });
            }
            
            // Seleccionar imagen para editar en sidebar
            $gallery.on('click', '.acf-gallery-attachment', function(e) {
                if ($(e.target).closest('.actions').length) {
                    return; // No hacer nada si se hace clic en acciones
                }
                e.preventDefault();
                var $attachment = $(this);
                var imageId = $attachment.data('id');
                if (imageId) {
                    openGallerySidebar($gallery, imageId);
                }
            });
            
            // Cerrar sidebar
            $gallery.on('click', '.acf-gallery-close', function(e) {
                e.preventDefault();
                closeGallerySidebar($gallery);
            });
            
            // Actualizar metadatos
            $gallery.on('click', '.acf-gallery-update', function(e) {
                e.preventDefault();
                updateGalleryAttachment($gallery);
            });
            
            // Ordenamiento
            $gallery.on('change', '.acf-gallery-sort', function(e) {
                var sortValue = $(this).val();
                if (sortValue) {
                    sortGallery($gallery, sortValue);
                }
            });
        });
    }
    
    /**
     * Abrir sidebar para editar imagen
     */
    function openGallerySidebar($gallery, imageId) {
        var $side = $gallery.find('.acf-gallery-side');
        var $sideData = $gallery.find('.acf-gallery-side-data');
        var fieldKey = $gallery.data('key');
        
        // Marcar attachment como activo
        $gallery.find('.acf-gallery-attachment').removeClass('active');
        $gallery.find('.acf-gallery-attachment[data-id="' + imageId + '"]').addClass('active');
        
        // Cargar datos via AJAX
        var nonce = '';
        if (typeof acf !== 'undefined' && acf.get) {
            nonce = acf.get('nonce') || '';
        } else if (typeof acfProFeatures !== 'undefined') {
            nonce = acfProFeatures.nonce || '';
        }
        
        var ajaxUrl = typeof ajaxurl !== 'undefined' ? ajaxurl : (typeof acfProFeatures !== 'undefined' ? acfProFeatures.ajaxUrl : '');
        if (!ajaxUrl && typeof acf !== 'undefined' && acf.get) {
            ajaxUrl = acf.get('ajaxurl') || '';
        }
        
        $.ajax({
            url: ajaxUrl || '/wp-admin/admin-ajax.php',
            type: 'POST',
            data: {
                action: 'acf/fields/gallery/get_attachment',
                id: imageId,
                field_key: fieldKey,
                nonce: nonce
            },
            success: function(response) {
                $sideData.html(response);
                $gallery.addClass('sidebar-open');
                $side.css('width', '349px');
            }
        });
    }
    
    /**
     * Cerrar sidebar
     */
    function closeGallerySidebar($gallery) {
        $gallery.removeClass('sidebar-open');
        $gallery.find('.acf-gallery-side').css('width', '0');
        $gallery.find('.acf-gallery-attachment').removeClass('active');
    }
    
    /**
     * Actualizar metadatos de attachment
     */
    function updateGalleryAttachment($gallery) {
        var $sideData = $gallery.find('.acf-gallery-side-data');
        var $active = $gallery.find('.acf-gallery-attachment.active');
        var imageId = $active.data('id');
        
        if (!imageId) {
            return;
        }
        
        // Recopilar datos del formulario
        var attachments = {};
        attachments[imageId] = {};
        
        $sideData.find('input, textarea').each(function() {
            var $field = $(this);
            var name = $field.attr('name');
            if (name && name.indexOf('attachments[' + imageId + ']') !== -1) {
                var fieldName = name.match(/\[([^\]]+)\]$/);
                if (fieldName && fieldName[1]) {
                    attachments[imageId][fieldName[1]] = $field.val();
                }
            }
        });
        
        // Enviar via AJAX
        var nonce = '';
        if (typeof acf !== 'undefined' && acf.get) {
            nonce = acf.get('nonce') || '';
        } else if (typeof acfProFeatures !== 'undefined') {
            nonce = acfProFeatures.nonce || '';
        }
        
        var ajaxUrl = typeof ajaxurl !== 'undefined' ? ajaxurl : (typeof acfProFeatures !== 'undefined' ? acfProFeatures.ajaxUrl : '');
        if (!ajaxUrl && typeof acf !== 'undefined' && acf.get) {
            ajaxUrl = acf.get('ajaxurl') || '';
        }
        
        $.ajax({
            url: ajaxUrl || '/wp-admin/admin-ajax.php',
            type: 'POST',
            data: {
                action: 'acf/fields/gallery/update_attachment',
                attachments: attachments,
                nonce: nonce
            },
            success: function(response) {
                if (response.success) {
                    // Recargar sidebar con datos actualizados
                    openGallerySidebar($gallery, imageId);
                }
            }
        });
    }
    
    /**
     * Ordenar galería
     */
    function sortGallery($gallery, sortValue) {
        var currentIds = getGalleryImageIds($gallery);
        var fieldKey = $gallery.data('key');
        
        var nonce = '';
        if (typeof acf !== 'undefined' && acf.get) {
            nonce = acf.get('nonce') || '';
        } else if (typeof acfProFeatures !== 'undefined') {
            nonce = acfProFeatures.nonce || '';
        }
        
        var ajaxUrl = typeof ajaxurl !== 'undefined' ? ajaxurl : (typeof acfProFeatures !== 'undefined' ? acfProFeatures.ajaxUrl : '');
        if (!ajaxUrl && typeof acf !== 'undefined' && acf.get) {
            ajaxUrl = acf.get('ajaxurl') || '';
        }
        
        $.ajax({
            url: ajaxUrl || '/wp-admin/admin-ajax.php',
            type: 'POST',
            data: {
                action: 'acf/fields/gallery/get_sort_order',
                ids: currentIds,
                sort: sortValue,
                field_key: fieldKey,
                nonce: nonce
            },
            success: function(response) {
                if (response.success && response.data) {
                    // Reordenar attachments
                    var $attachments = $gallery.find('.acf-gallery-attachments');
                    var $empty = $attachments.find('.acf-gallery-empty');
                    $empty.remove();
                    
                    // Remover todos los attachments
                    $attachments.find('.acf-gallery-attachment').detach();
                    
                    // Agregar en el nuevo orden
                    response.data.forEach(function(id) {
                        var $attachment = $gallery.find('.acf-gallery-attachment[data-id="' + id + '"]');
                        if ($attachment.length) {
                            $attachments.append($attachment);
                        }
                    });
                    
                    // Si no hay attachments, mostrar mensaje vacío
                    if ($attachments.find('.acf-gallery-attachment').length === 0) {
                        $attachments.html('<div class="acf-gallery-empty"><p>No hay imágenes seleccionadas</p></div>');
                    }
                    
                    updateGalleryValue($gallery);
                }
            }
        });
    }
    
    /**
     * Abrir frame de medios para galería
     */
    function openGalleryMediaFrame($gallery, editMode) {
        var library = $gallery.data('library') || 'all';
        var mimeTypes = $gallery.data('mime-types') || '';
        var currentIds = getGalleryImageIds($gallery);
        
        var frameOptions = {
            title: editMode ? 'Editar Galería' : 'Agregar a Galería',
            button: {
                text: editMode ? 'Actualizar Galería' : 'Agregar a Galería'
            },
            library: {
                type: 'image'
            },
            multiple: true
        };
        
        // Limitar a imágenes subidas al post
        if (library === 'uploadedTo') {
            var postId = $('#post_ID').val();
            if (postId) {
                frameOptions.library.uploadedTo = postId;
            }
        }
        
        // Filtrar por tipo MIME
        if (mimeTypes) {
            frameOptions.library.type = mimeTypes.split(',').map(function(type) {
                return type.trim();
            });
        }
        
        var frame = wp.media(frameOptions);
        
        // Seleccionar imágenes actuales si estamos editando
        if (editMode && currentIds.length > 0) {
            frame.on('open', function() {
                var selection = frame.state().get('selection');
                currentIds.forEach(function(id) {
                    var attachment = wp.media.attachment(id);
                    attachment.fetch();
                    selection.add(attachment);
                });
            });
        }
        
        frame.on('select', function() {
            var attachments = frame.state().get('selection').toJSON();
            var insert = $gallery.data('insert') || 'append';
            
            if (editMode) {
                // Reemplazar todas las imágenes
                clearGallery($gallery);
                attachments.forEach(function(attachment) {
                    addGalleryAttachment($gallery, attachment, 'append');
                });
            } else {
                // Agregar nuevas imágenes
                attachments.forEach(function(attachment) {
                    addGalleryAttachment($gallery, attachment, insert);
                });
            }
            
            updateGalleryValue($gallery);
            checkGalleryLimits($gallery);
        });
        
        frame.open();
    }
    
    /**
     * Agregar attachment a la galería
     */
    function addGalleryAttachment($gallery, attachment, insert) {
        var $attachments = $gallery.find('.acf-gallery-attachments');
        var $empty = $attachments.find('.acf-gallery-empty');
        var previewSize = $gallery.data('preview-size') || 'medium';
        var fieldKey = $gallery.data('key');
        
        // Remover mensaje vacío
        $empty.remove();
        
        // Obtener URL de imagen según tamaño
        var imageUrl = attachment.url;
        if (attachment.sizes && attachment.sizes[previewSize]) {
            imageUrl = attachment.sizes[previewSize].url;
        } else if (attachment.sizes && attachment.sizes.thumbnail) {
            imageUrl = attachment.sizes.thumbnail.url;
        }
        
        var $attachment = $('<div class="acf-gallery-attachment" data-id="' + attachment.id + '">' +
            '<input type="hidden" name="acf[' + fieldKey + '][]" value="' + attachment.id + '" />' +
            '<div class="acf-gallery-attachment-inner">' +
            '<div class="acf-gallery-attachment-image">' +
            '<img src="' + imageUrl + '" alt="' + (attachment.alt || '') + '" title="' + (attachment.title || '') + '" />' +
            '</div>' +
            '<div class="acf-gallery-attachment-actions">' +
            '<a href="#" class="acf-icon acf-icon-move" title="Mover"></a>' +
            '<a href="#" class="acf-icon acf-icon-edit" title="Editar"></a>' +
            '<a href="#" class="acf-icon acf-icon-cancel acf-gallery-remove" title="Eliminar"></a>' +
            '</div>' +
            '</div>' +
            '</div>');
        
        if (insert === 'prepend') {
            $attachments.prepend($attachment);
        } else {
            $attachments.append($attachment);
        }
    }
    
    /**
     * Eliminar attachment de la galería
     */
    function removeGalleryAttachment($gallery, $attachment) {
        $attachment.fadeOut(300, function() {
            $(this).remove();
            updateGalleryValue($gallery);
            checkGalleryLimits($gallery);
            
            // Mostrar mensaje vacío si no hay imágenes
            var $attachments = $gallery.find('.acf-gallery-attachments');
            if ($attachments.find('.acf-gallery-attachment').length === 0) {
                $attachments.html('<div class="acf-gallery-empty"><p>No hay imágenes seleccionadas</p></div>');
            }
        });
    }
    
    /**
     * Limpiar galería
     */
    function clearGallery($gallery) {
        var $attachments = $gallery.find('.acf-gallery-attachments');
        $attachments.find('.acf-gallery-attachment').remove();
        $attachments.html('<div class="acf-gallery-empty"><p>No hay imágenes seleccionadas</p></div>');
        updateGalleryValue($gallery);
    }
    
    /**
     * Obtener IDs de imágenes de la galería
     */
    function getGalleryImageIds($gallery) {
        var ids = [];
        $gallery.find('.acf-gallery-attachment').each(function() {
            var id = $(this).data('id');
            if (id) {
                ids.push(id);
            }
        });
        return ids;
    }
    
    /**
     * Actualizar valor de la galería
     */
    function updateGalleryValue($gallery) {
        var ids = getGalleryImageIds($gallery);
        var $input = $gallery.find('.acf-gallery-value');
        $input.val(ids.join(','));
    }
    
    /**
     * Editar imagen individual
     */
    function editGalleryImage($gallery, imageId) {
        var frame = wp.media({
            title: 'Editar Imagen',
            button: {
                text: 'Actualizar'
            },
            library: {
                type: 'image'
            },
            multiple: false
        });
        
        frame.on('open', function() {
            var selection = frame.state().get('selection');
            var attachment = wp.media.attachment(imageId);
            attachment.fetch();
            selection.add(attachment);
        });
        
        frame.on('select', function() {
            var attachment = frame.state().get('selection').first().toJSON();
            var $attachment = $gallery.find('.acf-gallery-attachment[data-id="' + imageId + '"]');
            
            if ($attachment.length > 0) {
                // Actualizar imagen
                var previewSize = $gallery.data('preview-size') || 'medium';
                var imageUrl = attachment.url;
                if (attachment.sizes && attachment.sizes[previewSize]) {
                    imageUrl = attachment.sizes[previewSize].url;
                }
                
                $attachment.find('img').attr('src', imageUrl);
                $attachment.find('img').attr('alt', attachment.alt || '');
                $attachment.find('img').attr('title', attachment.title || '');
            }
        });
        
        frame.open();
    }
    
    /**
     * Verificar límites de la galería
     */
    function checkGalleryLimits($gallery) {
        var min = parseInt($gallery.data('min')) || 0;
        var max = parseInt($gallery.data('max')) || 0;
        var currentCount = $gallery.find('.acf-gallery-attachment').length;
        
        // Ocultar/mostrar botones según límites
        if (max > 0 && currentCount >= max) {
            $gallery.find('.acf-gallery-add').prop('disabled', true).addClass('disabled');
        } else {
            $gallery.find('.acf-gallery-add').prop('disabled', false).removeClass('disabled');
        }
        
        // Mostrar mensaje si está por debajo del mínimo
        if (min > 0 && currentCount < min) {
            var $notice = $gallery.find('.acf-notice-min');
            if ($notice.length === 0) {
                $notice = $('<div class="acf-notice acf-notice-min">Se requieren al menos ' + min + ' imágenes.</div>');
                $gallery.prepend($notice);
            }
        } else {
            $gallery.find('.acf-notice-min').remove();
        }
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

