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
        // Renderizar HTML básico por ahora
        ?>
        <div class="acf-clone-field" data-key="<?php echo esc_attr($field['key']); ?>">
            <p><?php esc_html_e('Clone - Funcionalidad en desarrollo', 'acf-pro-features-free'); ?></p>
        </div>
        <?php
    }
    
    /**
     * Cargar valor
     */
    function load_value($value, $post_id, $field) {
        return $value;
    }
    
    /**
     * Actualizar valor
     */
    function update_value($value, $post_id, $field) {
        return $value;
    }
    
    /**
     * Renderizar configuración del campo
     */
    function render_field_settings($field) {
        // Configuración básica
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
    }
}
