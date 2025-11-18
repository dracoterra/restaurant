<?php
/**
 * Campo Clone para ACF
 * 
 * Recrea la funcionalidad del campo Clone de ACF PRO
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Clase del campo Clone
 */
class ACF_Pro_Features_Clone_Field extends acf_field {
    
    /**
     * Inicializar
     */
    function initialize() {
        $this->name = 'clone';
        $this->label = __('Clone', 'acf-pro-features-free');
        $this->category = 'layout';
        $this->description = __('Clona campos o grupos de campos existentes', 'acf-pro-features-free');
        $this->defaults = array(
            'clone' => array(),
            'display' => 'seamless',
            'prefix_label' => 0,
            'prefix_name' => 0,
        );
        $this->pro = false;
        $this->public = true;
    }
    
    /**
     * Renderizar campo
     */
    function render_field($field) {
        $cloned_fields = $this->get_cloned_fields($field);
        
        if (empty($cloned_fields)) {
            ?>
            <div class="acf-clone-field acf-clone-empty" data-key="<?php echo esc_attr($field['key']); ?>">
                <p class="acf-notice"><?php esc_html_e('No hay campos seleccionados para clonar.', 'acf-pro-features-free'); ?></p>
            </div>
            <?php
            return;
        }
        
        $display = isset($field['display']) ? $field['display'] : 'seamless';
        $prefix_label = isset($field['prefix_label']) ? $field['prefix_label'] : 0;
        $prefix_name = isset($field['prefix_name']) ? $field['prefix_name'] : 0;
        
        $field_key = $field['key'];
        $field_name = $field['name'];
        
        // Obtener valores actuales
        $post_id = isset($field['ID']) ? $field['ID'] : 0;
        if (function_exists('acf_get_setting') && acf_get_setting('current_post_id')) {
            $post_id = acf_get_setting('current_post_id');
        }
        $values = $this->load_value(array(), $post_id, $field);
        if (!is_array($values)) {
            $values = array();
        }
        
        ?>
        <div class="acf-clone-field acf-clone-<?php echo esc_attr($display); ?>" 
             data-key="<?php echo esc_attr($field_key); ?>"
             data-name="<?php echo esc_attr($field_name); ?>">
            
            <?php if ($display === 'group'): ?>
                <div class="acf-clone-header">
                    <h3 class="acf-clone-title"><?php echo esc_html($field['label']); ?></h3>
                </div>
            <?php endif; ?>
            
            <div class="acf-clone-fields">
                <?php foreach ($cloned_fields as $cloned_field): ?>
                    <?php $this->render_cloned_field($cloned_field, $field, $values, $prefix_label, $prefix_name); ?>
                <?php endforeach; ?>
            </div>
        </div>
        <?php
    }
    
    /**
     * Obtener campos clonados
     */
    private function get_cloned_fields($field) {
        $clone = isset($field['clone']) ? $field['clone'] : array();
        
        if (empty($clone) || !is_array($clone)) {
            return array();
        }
        
        $cloned_fields = array();
        
        foreach ($clone as $clone_selector) {
            // Puede ser un field key, field name, o group key
            $fields = $this->get_fields_by_selector($clone_selector);
            if (!empty($fields)) {
                $cloned_fields = array_merge($cloned_fields, $fields);
            }
        }
        
        return $cloned_fields;
    }
    
    /**
     * Obtener campos por selector
     */
    private function get_fields_by_selector($selector) {
        $fields = array();
        
        // Limpiar selector (puede venir con prefijo "group_" o "field_")
        $clean_selector = str_replace(array('group_', 'field_'), '', $selector);
        
        // Intentar obtener por field key primero
        if (function_exists('acf_get_field')) {
            $field = acf_get_field($selector);
            if ($field) {
                return array($field);
            }
            
            // Intentar con el selector limpio
            $field = acf_get_field($clean_selector);
            if ($field) {
                return array($field);
            }
            
            // Intentar con prefijo field_
            $field = acf_get_field('field_' . $clean_selector);
            if ($field) {
                return array($field);
            }
        }
        
        // Intentar obtener por group key
        if (function_exists('acf_get_field_group')) {
            $group = acf_get_field_group($selector);
            if (!$group) {
                $group = acf_get_field_group($clean_selector);
            }
            if (!$group) {
                $group = acf_get_field_group('group_' . $clean_selector);
            }
            
            if ($group && function_exists('acf_get_fields')) {
                $group_fields = acf_get_fields($group);
                if (!empty($group_fields)) {
                    $fields = array_merge($fields, $group_fields);
                }
            }
        }
        
        // Si aún no tenemos campos, buscar por name en todos los grupos
        if (empty($fields) && function_exists('acf_get_field_groups')) {
            $groups = acf_get_field_groups();
            foreach ($groups as $group) {
                $group_fields = acf_get_fields($group);
                if (!empty($group_fields)) {
                    foreach ($group_fields as $field) {
                        if ($field['name'] === $selector || $field['name'] === $clean_selector) {
                            $fields[] = $field;
                        }
                    }
                }
            }
        }
        
        return $fields;
    }
    
    /**
     * Renderizar campo clonado
     */
    private function render_cloned_field($cloned_field, $parent_field, $values, $prefix_label, $prefix_name) {
        $field_key = $cloned_field['key'];
        $field_name = $cloned_field['name'];
        $field_label = $cloned_field['label'];
        
        // Construir nombre del campo clonado
        $cloned_field_name = $field_name;
        if ($prefix_name) {
            $cloned_field_name = $parent_field['name'] . '_' . $field_name;
        }
        
        // Construir label
        $cloned_field_label = $field_label;
        if ($prefix_label) {
            $cloned_field_label = $parent_field['label'] . ' - ' . $field_label;
        }
        
        // Obtener valor
        $value = isset($values[$field_name]) ? $values[$field_name] : null;
        if ($value === null && isset($cloned_field['default_value'])) {
            $value = $cloned_field['default_value'];
        }
        
        // Construir nombre completo del input
        $input_name = 'acf[' . $parent_field['key'] . '][' . $field_key . ']';
        
        // Preparar campo para renderizado
        $render_field = $cloned_field;
        $render_field['name'] = $input_name;
        $render_field['value'] = $value;
        $render_field['label'] = $cloned_field_label;
        $render_field['ID'] = isset($cloned_field['ID']) ? $cloned_field['ID'] : 0;
        
        // Renderizar campo usando ACF si está disponible
        if (function_exists('acf_render_field')) {
            ?>
            <div class="acf-clone-field-item acf-field acf-field-<?php echo esc_attr($cloned_field['type']); ?>" 
                 data-field-key="<?php echo esc_attr($field_key); ?>"
                 data-field-name="<?php echo esc_attr($field_name); ?>">
                <?php acf_render_field($render_field); ?>
            </div>
            <?php
        } else {
            // Fallback básico
            ?>
            <div class="acf-clone-field-item acf-field acf-field-<?php echo esc_attr($cloned_field['type']); ?>">
                <div class="acf-label">
                    <label><?php echo esc_html($cloned_field_label); ?></label>
                </div>
                <div class="acf-input">
                    <input type="text" 
                           name="<?php echo esc_attr($input_name); ?>" 
                           value="<?php echo esc_attr($value); ?>" />
                </div>
            </div>
            <?php
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
        if (!is_array($value)) {
            return array();
        }
        
        // Procesar valores de campos clonados
        $cloned_fields = $this->get_cloned_fields($field);
        $processed_value = array();
        
        foreach ($cloned_fields as $cloned_field) {
            $field_key = $cloned_field['key'];
            $field_name = $cloned_field['name'];
            
            if (isset($value[$field_key])) {
                $processed_value[$field_name] = $this->process_cloned_field_value($value[$field_key], $cloned_field);
            }
        }
        
        return $processed_value;
    }
    
    /**
     * Procesar valor de campo clonado
     */
    private function process_cloned_field_value($value, $field) {
        switch ($field['type']) {
            case 'image':
            case 'file':
                if (is_numeric($value)) {
                    return intval($value);
                }
                return 0;
                
            case 'number':
                return floatval($value);
                
            case 'true_false':
                return (bool) $value;
                
            case 'repeater':
            case 'flexible_content':
                if (is_array($value)) {
                    return $value;
                }
                return array();
                
            default:
                return $value;
        }
    }
    
    /**
     * Preparar campo para exportación
     */
    function prepare_field_for_export($field) {
        // Asegurar que clone es un array
        if (isset($field['clone']) && is_string($field['clone'])) {
            $field['clone'] = array($field['clone']);
        }
        
        return $field;
    }
    
    /**
     * Preparar campo para importación
     */
    function prepare_field_for_import($field) {
        // Asegurar que clone es un array
        if (isset($field['clone']) && is_string($field['clone'])) {
            $field['clone'] = array($field['clone']);
        }
        
        return $field;
    }
    
    /**
     * Renderizar configuración del campo
     */
    function render_field_settings($field) {
        // Campos a clonar
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Campos a Clonar', 'acf-pro-features-free'),
                'instructions' => __('Selecciona los campos o grupos de campos a clonar', 'acf-pro-features-free'),
                'name' => 'clone',
                'type' => 'select',
                'multiple' => 1,
                'ui' => 1,
                'ajax' => 1,
                'choices' => $this->get_clone_choices(),
            )
        );
        
        // Display
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Display', 'acf-pro-features-free'),
                'instructions' => __('Especifica el estilo de visualización', 'acf-pro-features-free'),
                'name' => 'display',
                'type' => 'select',
                'choices' => array(
                    'seamless' => __('Seamless', 'acf-pro-features-free'),
                    'group' => __('Group', 'acf-pro-features-free'),
                ),
                'default_value' => 'seamless',
            )
        );
        
        // Prefix Label
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Prefix Label', 'acf-pro-features-free'),
                'instructions' => __('Agregar prefijo al label de los campos clonados', 'acf-pro-features-free'),
                'name' => 'prefix_label',
                'type' => 'true_false',
                'ui' => 1,
                'default_value' => 0,
            )
        );
        
        // Prefix Name
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Prefix Name', 'acf-pro-features-free'),
                'instructions' => __('Agregar prefijo al name de los campos clonados', 'acf-pro-features-free'),
                'name' => 'prefix_name',
                'type' => 'true_false',
                'ui' => 1,
                'default_value' => 0,
            )
        );
    }
    
    /**
     * Obtener opciones para selector de clonado
     */
    private function get_clone_choices() {
        $choices = array();
        
        // Obtener todos los campos
        if (function_exists('acf_get_fields')) {
            $all_fields = acf_get_fields();
            foreach ($all_fields as $field) {
                $choices[$field['key']] = $field['label'] . ' (' . $field['name'] . ')';
            }
        }
        
        // Obtener todos los grupos de campos
        if (function_exists('acf_get_field_groups')) {
            $groups = acf_get_field_groups();
            foreach ($groups as $group) {
                $choices['group_' . $group['key']] = $group['title'] . ' (Group)';
            }
        }
        
        return $choices;
    }
}
