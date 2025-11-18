<?php
/**
 * Campo Flexible Content para ACF
 * 
 * Recrea la funcionalidad del campo Flexible Content de ACF PRO
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Clase del campo Flexible Content
 */
class ACF_Pro_Features_Flexible_Content_Field extends acf_field {
    
    /**
     * Inicializar
     */
    function initialize() {
        $this->name = 'flexible_content';
        $this->label = __('Flexible Content', 'acf-pro-features-free');
        $this->category = 'layout';
        $this->description = __('Crea layouts flexibles con diferentes secciones', 'acf-pro-features-free');
        $this->defaults = array(
            'layouts' => array(),
            'min' => 0,
            'max' => 0,
            'button_label' => __('Agregar Layout', 'acf-pro-features-free'),
        );
        $this->pro = false;
        $this->public = true;
    }
    
    /**
     * Renderizar campo
     */
    function render_field($field) {
        // Obtener valor
        $post_id = isset($field['ID']) ? $field['ID'] : 0;
        if (function_exists('acf_get_setting') && acf_get_setting('current_post_id')) {
            $post_id = acf_get_setting('current_post_id');
        }
        $value = $this->load_value(array(), $post_id, $field);
        if (empty($value) || !is_array($value)) {
            $value = array();
        }
        
        $field_key = $field['key'];
        $field_name = $field['name'];
        $layouts = isset($field['layouts']) && is_array($field['layouts']) ? $field['layouts'] : array();
        $button_label = isset($field['button_label']) ? $field['button_label'] : __('Agregar Layout', 'acf-pro-features-free');
        
        ?>
        <div class="acf-flexible-content" 
             data-key="<?php echo esc_attr($field_key); ?>" 
             data-name="<?php echo esc_attr($field_name); ?>"
             data-min="<?php echo esc_attr($field['min']); ?>"
             data-max="<?php echo esc_attr($field['max']); ?>">
            
            <!-- Botones de layouts disponibles -->
            <?php if (!empty($layouts)): ?>
                <div class="acf-layouts">
                    <?php foreach ($layouts as $layout_key => $layout): ?>
                        <?php
                        $layout_name = isset($layout['name']) ? $layout['name'] : $layout_key;
                        $layout_label = isset($layout['label']) ? $layout['label'] : $layout_name;
                        ?>
                        <a href="#" 
                           class="acf-button acf-button-add-layout" 
                           data-layout="<?php echo esc_attr($layout_name); ?>"
                           data-layout-key="<?php echo esc_attr($layout_key); ?>">
                            <?php echo esc_html($layout_label); ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            
            <!-- Contenedor de layouts -->
            <div class="acf-layouts-container">
                <?php if (!empty($value)): ?>
                    <?php foreach ($value as $layout_index => $layout_data): ?>
                        <?php
                        $layout_name = isset($layout_data['acf_fc_layout']) ? $layout_data['acf_fc_layout'] : '';
                        if (!$layout_name) continue;
                        
                        // Buscar configuración del layout
                        $layout_config = null;
                        foreach ($layouts as $layout_key => $layout) {
                            $config_name = isset($layout['name']) ? $layout['name'] : $layout_key;
                            if ($config_name === $layout_name) {
                                $layout_config = $layout;
                                break;
                            }
                        }
                        
                        if ($layout_config) {
                            $this->render_layout($field, $layout_config, $layout_data, $layout_index, $field_name, $field_key);
                        }
                        ?>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
            
            <!-- Templates para cada layout -->
            <?php foreach ($layouts as $layout_key => $layout): ?>
                <?php
                $layout_name = isset($layout['name']) ? $layout['name'] : $layout_key;
                ?>
                <script type="text/html" class="acf-layout-template" data-layout="<?php echo esc_attr($layout_name); ?>" data-layout-key="<?php echo esc_attr($layout_key); ?>">
                    <?php $this->render_layout($field, $layout, array(), '{{layout_index}}', $field_name, $field_key, true); ?>
                </script>
            <?php endforeach; ?>
        </div>
        <?php
    }
    
    /**
     * Renderizar un layout individual
     */
    private function render_layout($field, $layout_config, $layout_data, $layout_index, $parent_field_name, $parent_field_key, $is_template = false) {
        $layout_name = isset($layout_config['name']) ? $layout_config['name'] : '';
        $layout_label = isset($layout_config['label']) ? $layout_config['label'] : $layout_name;
        $sub_fields = isset($layout_config['sub_fields']) && is_array($layout_config['sub_fields']) ? $layout_config['sub_fields'] : array();
        
        ?>
        <div class="acf-layout<?php echo $is_template ? ' acf-layout-template acf-clone' : ''; ?>" 
             data-layout="<?php echo esc_attr($layout_name); ?>"
             data-index="<?php echo esc_attr($layout_index); ?>">
            
            <!-- Handle del layout -->
            <div class="acf-layout-handle">
                <span class="acf-icon acf-icon-move" title="<?php esc_attr_e('Arrastrar para reordenar', 'acf-pro-features-free'); ?>"></span>
                <span class="acf-layout-title"><?php echo esc_html($layout_label); ?></span>
                <div class="acf-layout-controls">
                    <a href="#" class="acf-icon acf-icon-minus acf-layout-remove" title="<?php esc_attr_e('Eliminar layout', 'acf-pro-features-free'); ?>"></a>
                </div>
            </div>
            
            <!-- Contenido del layout -->
            <div class="acf-layout-content">
                <!-- Campo oculto para el nombre del layout -->
                <input type="hidden" 
                       name="acf[<?php echo esc_attr($parent_field_key); ?>][<?php echo esc_attr($layout_index); ?>][acf_fc_layout]" 
                       value="<?php echo esc_attr($layout_name); ?>" />
                
                <!-- Sub-campos del layout -->
                <?php if (!empty($sub_fields)): ?>
                    <div class="acf-layout-fields">
                        <?php foreach ($sub_fields as $sub_field): ?>
                            <div class="acf-field acf-field-<?php echo esc_attr($sub_field['type']); ?>">
                                <?php $this->render_sub_field($sub_field, $layout_data, $layout_index, $parent_field_name, $parent_field_key, $layout_name); ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
        <?php
    }
    
    /**
     * Renderizar sub-campo
     */
    private function render_sub_field($sub_field, $layout_data, $layout_index, $parent_field_name, $parent_field_key, $layout_name) {
        $field_key = $sub_field['key'];
        $field_name = $sub_field['name'];
        $field_type = $sub_field['type'];
        
        // Construir nombre del campo en formato ACF
        $input_name = 'acf[' . $parent_field_key . '][' . $layout_index . '][' . $field_key . ']';
        
        // Obtener valor
        $value = '';
        if (isset($layout_data[$field_name])) {
            $value = $layout_data[$field_name];
        } elseif (isset($layout_data[$field_key])) {
            $value = $layout_data[$field_key];
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
                    <?php if (isset($sub_field['instructions']) && !empty($sub_field['instructions'])): ?>
                        <p class="description"><?php echo esc_html($sub_field['instructions']); ?></p>
                    <?php endif; ?>
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
                    <?php if (isset($sub_field['instructions']) && !empty($sub_field['instructions'])): ?>
                        <p class="description"><?php echo esc_html($sub_field['instructions']); ?></p>
                    <?php endif; ?>
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
                    <?php if (isset($sub_field['instructions']) && !empty($sub_field['instructions'])): ?>
                        <p class="description"><?php echo esc_html($sub_field['instructions']); ?></p>
                    <?php endif; ?>
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
                
            case 'wysiwyg':
            case 'editor':
                ?>
                <div class="acf-label">
                    <label><?php echo esc_html($sub_field['label']); ?></label>
                    <?php if (isset($sub_field['instructions']) && !empty($sub_field['instructions'])): ?>
                        <p class="description"><?php echo esc_html($sub_field['instructions']); ?></p>
                    <?php endif; ?>
                </div>
                <div class="acf-input">
                    <?php
                    $editor_id = 'acf_' . $parent_field_key . '_' . $layout_index . '_' . $field_key;
                    wp_editor($value, $editor_id, array(
                        'textarea_name' => $input_name,
                        'textarea_rows' => isset($sub_field['rows']) ? $sub_field['rows'] : 10,
                        'media_buttons' => isset($sub_field['media_upload']) ? $sub_field['media_upload'] : true,
                        'teeny' => isset($sub_field['teeny']) ? $sub_field['teeny'] : false
                    ));
                    ?>
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
        if (!empty($value)) {
            return $value;
        }
        
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
            $processed_value = $this->process_flexible_content_data($value, $field);
            return $processed_value;
        }
        
        return array();
    }
    
    /**
     * Procesar datos del flexible content
     */
    private function process_flexible_content_data($data, $field) {
        if (!is_array($data)) {
            return array();
        }
        
        $processed = array();
        $layouts = isset($field['layouts']) && is_array($field['layouts']) ? $field['layouts'] : array();
        
        foreach ($data as $layout_index => $layout_data) {
            if (!is_array($layout_data)) {
                continue;
            }
            
            // Obtener nombre del layout
            $layout_name = isset($layout_data['acf_fc_layout']) ? $layout_data['acf_fc_layout'] : '';
            if (empty($layout_name)) {
                continue;
            }
            
            // Buscar configuración del layout
            $layout_config = null;
            foreach ($layouts as $layout_key => $layout) {
                $config_name = isset($layout['name']) ? $layout['name'] : $layout_key;
                if ($config_name === $layout_name) {
                    $layout_config = $layout;
                    break;
                }
            }
            
            if (!$layout_config) {
                continue;
            }
            
            $processed_layout = array(
                'acf_fc_layout' => $layout_name
            );
            
            // Procesar sub-campos
            $sub_fields = isset($layout_config['sub_fields']) && is_array($layout_config['sub_fields']) ? $layout_config['sub_fields'] : array();
            foreach ($sub_fields as $sub_field) {
                $sub_field_name = $sub_field['name'];
                $sub_field_key = $sub_field['key'];
                
                // Buscar valor por key o name
                if (isset($layout_data[$sub_field_key])) {
                    $processed_layout[$sub_field_name] = $this->process_field_value($layout_data[$sub_field_key], $sub_field);
                } elseif (isset($layout_data[$sub_field_name])) {
                    $processed_layout[$sub_field_name] = $this->process_field_value($layout_data[$sub_field_name], $sub_field);
                }
            }
            
            $processed[] = $processed_layout;
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
        // Botón label
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Botón Label', 'acf-pro-features-free'),
                'instructions' => __('Texto del botón para agregar layouts', 'acf-pro-features-free'),
                'name' => 'button_label',
                'type' => 'text',
                'default_value' => __('Agregar Layout', 'acf-pro-features-free'),
            )
        );
        
        // Min
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Mínimo', 'acf-pro-features-free'),
                'instructions' => __('Número mínimo de layouts', 'acf-pro-features-free'),
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
                'instructions' => __('Número máximo de layouts', 'acf-pro-features-free'),
                'name' => 'max',
                'type' => 'number',
                'default_value' => 0,
            )
        );
    }
}
