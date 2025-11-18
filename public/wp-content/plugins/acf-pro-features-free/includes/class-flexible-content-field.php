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
        $value = $this->load_value(array(), $field['ID'], $field);
        if (empty($value) || !is_array($value)) {
            $value = array();
        }
        
        // Renderizar HTML básico por ahora
        ?>
        <div class="acf-flexible-content" data-key="<?php echo esc_attr($field['key']); ?>">
            <p><?php esc_html_e('Flexible Content - Funcionalidad en desarrollo', 'acf-pro-features-free'); ?></p>
        </div>
        <?php
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
        
        if (empty($meta_value) || !is_array($meta_value)) {
            return array();
        }
        
        return $meta_value;
    }
    
    /**
     * Actualizar valor
     */
    function update_value($value, $post_id, $field) {
        if (is_array($value)) {
            return $value;
        }
        
        return array();
    }
    
    /**
     * Renderizar configuración del campo
     */
    function render_field_settings($field) {
        // Configuración básica
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
    }
}
