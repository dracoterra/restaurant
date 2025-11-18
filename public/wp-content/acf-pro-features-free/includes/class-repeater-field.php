<?php
/**
 * Campo Repeater para ACF
 * 
 * Recrea la funcionalidad del campo Repeater de ACF PRO
 */

if (!defined('ABSPATH')) {
    exit;
}

// Registrar el campo repeater cuando ACF esté listo
// Esta función se llama desde acf-pro-features-free.php después de cargar esta clase

/**
 * Clase del campo Repeater
 */
class ACF_Pro_Features_Repeater_Field extends acf_field {
    
    /**
     * Inicializar
     */
    function initialize() {
        $this->name = 'repeater';
        $this->label = __('Repeater', 'acf-pro-features-free');
        $this->category = 'layout';
        $this->description = __('Crea campos repetibles con sub-campos', 'acf-pro-features-free');
        $this->defaults = array(
            'sub_fields' => array(),
            'min' => 0,
            'max' => 0,
            'layout' => 'table',
            'button_label' => __('Agregar Fila', 'acf-pro-features-free'),
            'collapsed' => '',
        );
        $this->pro = false;
        $this->public = true;
    }
    
    /**
     * Renderizar campo
     */
    function render_field($field) {
        // Obtener valor
        $value = $this->load_value(array(), $field['ID'], $field);
        if (empty($value) || !is_array($value)) {
            $value = array();
        }
        
        // Renderizar HTML
        $this->render_field_html($field, $value);
    }
    
    /**
     * Renderizar HTML del campo
     */
    private function render_field_html($field, $value) {
        $field_key = $field['key'];
        $field_name = $field['name'];
        $layout = isset($field['layout']) ? $field['layout'] : 'table';
        $button_label = isset($field['button_label']) ? $field['button_label'] : __('Agregar Fila', 'acf-pro-features-free');
        $sub_fields = isset($field['sub_fields']) ? $field['sub_fields'] : array();
        
        ?>
        <div class="acf-repeater" data-layout="<?php echo esc_attr($layout); ?>" data-min="<?php echo esc_attr($field['min']); ?>" data-max="<?php echo esc_attr($field['max']); ?>" data-key="<?php echo esc_attr($field_key); ?>" data-name="<?php echo esc_attr($field_name); ?>">
            <div class="acf-rows">
                <?php if (!empty($value)): ?>
                    <?php foreach ($value as $row_index => $row): ?>
                        <?php $this->render_row($field, $row, $row_index, $sub_fields); ?>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
            <div class="acf-actions">
                <a href="#" class="acf-button acf-button-add"><?php echo esc_html($button_label); ?></a>
            </div>
        </div>
        
        <!-- Template para nuevas filas -->
        <script type="text/html" class="acf-repeater-template" data-field-key="<?php echo esc_attr($field_key); ?>">
            <?php $this->render_row($field, array(), '{{row_index}}', $sub_fields, true); ?>
        </script>
        <?php
    }
    
    /**
     * Renderizar fila del repeater
     */
    private function render_row($field, $row_data, $row_index, $sub_fields, $is_template = false) {
        $layout = isset($field['layout']) ? $field['layout'] : 'table';
        
        if ($layout === 'table') {
            $this->render_row_table($field, $row_data, $row_index, $sub_fields, $is_template);
        } else {
            $this->render_row_block($field, $row_data, $row_index, $sub_fields, $is_template);
        }
    }
    
    /**
     * Renderizar fila en layout table
     */
    private function render_row_table($field, $row_data, $row_index, $sub_fields, $is_template) {
        ?>
        <div class="acf-row<?php echo $is_template ? ' acf-row-template acf-clone' : ''; ?>" data-index="<?php echo esc_attr($row_index); ?>">
            <table class="acf-table">
                <?php if (!$is_template): ?>
                    <thead>
                        <tr>
                            <td class="acf-row-handle"></td>
                            <?php foreach ($sub_fields as $sub_field): ?>
                                <th class="acf-th">
                                    <label><?php echo esc_html($sub_field['label']); ?></label>
                                </th>
                            <?php endforeach; ?>
                            <td class="acf-row-controls"></td>
                        </tr>
                    </thead>
                <?php endif; ?>
                <tbody>
                    <tr>
                        <td class="acf-row-handle">
                            <span class="acf-icon acf-icon-move" title="<?php esc_attr_e('Arrastrar para reordenar', 'acf-pro-features-free'); ?>"></span>
                        </td>
                        <?php foreach ($sub_fields as $sub_field): ?>
                            <td class="acf-input">
                                <?php $this->render_sub_field($sub_field, $row_data, $row_index, $field['name'], $field['key']); ?>
                            </td>
                        <?php endforeach; ?>
                        <td class="acf-row-controls">
                            <a href="#" class="acf-icon acf-icon-minus acf-button-remove" title="<?php esc_attr_e('Eliminar fila', 'acf-pro-features-free'); ?>"></a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <?php
    }
    
    /**
     * Renderizar fila en layout block
     */
    private function render_row_block($field, $row_data, $row_index, $sub_fields, $is_template) {
        ?>
        <div class="acf-row<?php echo $is_template ? ' acf-row-template acf-clone' : ''; ?>" data-index="<?php echo esc_attr($row_index); ?>">
            <div class="acf-row-handle">
                <span class="acf-icon acf-icon-move" title="<?php esc_attr_e('Arrastrar para reordenar', 'acf-pro-features-free'); ?>"></span>
            </div>
            <div class="acf-row-header">
                <span class="acf-row-title"><?php echo esc_html(sprintf(__('Fila %s', 'acf-pro-features-free'), is_numeric($row_index) ? $row_index + 1 : $row_index)); ?></span>
                <div class="acf-row-controls">
                    <a href="#" class="acf-icon acf-icon-minus acf-button-remove" title="<?php esc_attr_e('Eliminar fila', 'acf-pro-features-free'); ?>"></a>
                </div>
            </div>
            <div class="acf-row-content">
                <?php foreach ($sub_fields as $sub_field): ?>
                    <div class="acf-field">
                        <?php $this->render_sub_field($sub_field, $row_data, $row_index, $field['name'], $field['key']); ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php
    }
    
    /**
     * Renderizar sub-campo
     */
    private function render_sub_field($sub_field, $row_data, $row_index, $parent_field_name, $parent_field_key) {
        $field_key = $sub_field['key'];
        $field_name = $sub_field['name'];
        $field_type = $sub_field['type'];
        
        // Construir nombre del campo en formato ACF
        $input_name = 'acf[' . $parent_field_key . '][' . $row_index . '][' . $field_key . ']';
        
        // Obtener valor
        $value = '';
        if (isset($row_data[$field_name])) {
            $value = $row_data[$field_name];
        } elseif (isset($row_data[$field_key])) {
            $value = $row_data[$field_key];
        } elseif (isset($sub_field['default_value'])) {
            $value = $sub_field['default_value'];
        }
        
        // Renderizar según el tipo de campo
        switch ($field_type) {
            case 'text':
            case 'email':
            case 'url':
            case 'number':
                ?>
                <div class="acf-label">
                    <label><?php echo esc_html($sub_field['label']); ?></label>
                </div>
                <div class="acf-input">
                    <input type="<?php echo esc_attr($field_type); ?>" 
                           name="<?php echo esc_attr($input_name); ?>" 
                           value="<?php echo esc_attr($value); ?>" 
                           class="acf-input-<?php echo esc_attr($field_type); ?>" />
                </div>
                <?php
                break;
                
            case 'textarea':
                ?>
                <div class="acf-label">
                    <label><?php echo esc_html($sub_field['label']); ?></label>
                </div>
                <div class="acf-input">
                    <textarea name="<?php echo esc_attr($input_name); ?>" 
                              class="acf-input-textarea" 
                              rows="<?php echo isset($sub_field['rows']) ? esc_attr($sub_field['rows']) : 4; ?>"><?php echo esc_textarea($value); ?></textarea>
                </div>
                <?php
                break;
                
            case 'image':
                $image_id = is_numeric($value) ? $value : 0;
                $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'thumbnail') : '';
                ?>
                <div class="acf-label">
                    <label><?php echo esc_html($sub_field['label']); ?></label>
                </div>
                <div class="acf-input">
                    <div class="acf-image-uploader" data-preview-size="thumbnail">
                        <input type="hidden" name="<?php echo esc_attr($input_name); ?>" value="<?php echo esc_attr($image_id); ?>" class="acf-image-value" />
                        <div class="acf-image-preview<?php echo $image_url ? '' : ' acf-hidden'; ?>">
                            <?php if ($image_url): ?>
                                <img src="<?php echo esc_url($image_url); ?>" alt="" />
                                <a href="#" class="acf-icon acf-icon-cancel acf-image-remove" title="<?php esc_attr_e('Eliminar imagen', 'acf-pro-features-free'); ?>"></a>
                            <?php endif; ?>
                        </div>
                        <div class="acf-actions">
                            <a href="#" class="acf-button acf-button-select"><?php esc_html_e('Seleccionar Imagen', 'acf-pro-features-free'); ?></a>
                        </div>
                    </div>
                </div>
                <?php
                break;
                
            default:
                // Para otros tipos de campo, usar el renderizado estándar de ACF si está disponible
                if (function_exists('acf_render_field')) {
                    $sub_field['name'] = $input_name;
                    $sub_field['value'] = $value;
                    $sub_field['ID'] = isset($sub_field['ID']) ? $sub_field['ID'] : 0;
                    acf_render_field($sub_field);
                } else {
                    // Fallback básico
                    ?>
                    <div class="acf-label">
                        <label><?php echo esc_html($sub_field['label']); ?></label>
                    </div>
                    <div class="acf-input">
                        <input type="text" name="<?php echo esc_attr($input_name); ?>" value="<?php echo esc_attr($value); ?>" />
                    </div>
                    <?php
                }
                break;
        }
    }
    
    /**
     * Cargar valor
     */
    function load_value($value, $post_id, $field) {
        // Si ya hay un valor, usarlo
        if (!empty($value)) {
            return $value;
        }
        
        // Obtener valor desde meta
        $field_name = $field['name'];
        $meta_value = get_post_meta($post_id, $field_name, true);
        
        if (empty($meta_value)) {
            return array();
        }
        
        // Si es un string JSON, decodificarlo
        if (is_string($meta_value)) {
            $decoded = json_decode($meta_value, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return $decoded;
            }
        }
        
        // Si es un array, retornarlo
        if (is_array($meta_value)) {
            return $meta_value;
        }
        
        return array();
    }
    
    /**
     * Actualizar valor
     */
    function update_value($value, $post_id, $field) {
        // Procesar y guardar datos
        if (is_array($value)) {
            $processed_value = $this->process_repeater_data($value, $field);
            return $processed_value;
        }
        
        return array();
    }
    
    /**
     * Procesar datos del repeater
     */
    private function process_repeater_data($data, $field) {
        if (!is_array($data)) {
            return array();
        }
        
        $processed = array();
        $sub_fields = isset($field['sub_fields']) ? $field['sub_fields'] : array();
        
        foreach ($data as $row_index => $row_data) {
            if (!is_array($row_data)) {
                continue;
            }
            
            $row = array();
            
            // Procesar sub-campos
            foreach ($sub_fields as $sub_field) {
                $sub_field_name = $sub_field['name'];
                $sub_field_key = $sub_field['key'];
                
                // Buscar valor por key o name
                if (isset($row_data[$sub_field_key])) {
                    $row[$sub_field_name] = $this->process_field_value($row_data[$sub_field_key], $sub_field);
                } elseif (isset($row_data[$sub_field_name])) {
                    $row[$sub_field_name] = $this->process_field_value($row_data[$sub_field_name], $sub_field);
                }
            }
            
            if (!empty($row)) {
                $processed[] = $row;
            }
        }
        
        return $processed;
    }
    
    /**
     * Procesar valor de campo
     */
    private function process_field_value($value, $field) {
        switch ($field['type']) {
            case 'image':
                if (is_numeric($value)) {
                    return intval($value);
                }
                return 0;
                
            case 'number':
                return floatval($value);
                
            case 'true_false':
                return (bool) $value;
                
            default:
                return $value;
        }
    }
    
    /**
     * Renderizar configuración del campo
     */
    function render_field_settings($field) {
        // Layout
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Layout', 'acf-pro-features-free'),
                'instructions' => __('Elige el layout para mostrar las filas', 'acf-pro-features-free'),
                'name' => 'layout',
                'type' => 'select',
                'choices' => array(
                    'table' => __('Table', 'acf-pro-features-free'),
                    'block' => __('Block', 'acf-pro-features-free'),
                    'row' => __('Row', 'acf-pro-features-free'),
                ),
                'default_value' => 'table',
            )
        );
        
        // Botón label
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Botón Label', 'acf-pro-features-free'),
                'instructions' => __('Texto del botón para agregar filas', 'acf-pro-features-free'),
                'name' => 'button_label',
                'type' => 'text',
                'default_value' => __('Agregar Fila', 'acf-pro-features-free'),
            )
        );
        
        // Min
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Mínimo', 'acf-pro-features-free'),
                'instructions' => __('Número mínimo de filas', 'acf-pro-features-free'),
                'name' => 'min',
                'type' => 'number',
                'default_value' => 0,
            )
        );
        
        // Max
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Máximo', 'acf-pro-features-free'),
                'instructions' => __('Número máximo de filas', 'acf-pro-features-free'),
                'name' => 'max',
                'type' => 'number',
                'default_value' => 0,
            )
        );
    }
}
