<?php
/**
 * Options Pages para ACF
 * 
 * Recrea la funcionalidad de Options Pages de ACF PRO
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Clase para manejar Options Pages
 */
class ACF_Pro_Features_Options_Pages {
    
    /**
     * Páginas de opciones registradas
     */
    private static $pages = array();
    
    /**
     * Constructor
     */
    public function __construct() {
        // Registrar páginas cuando se llama acf_add_options_page
        add_action('acf/init', array($this, 'register_pages'), 20);
        
        // Interceptar acf_add_options_page si existe
        if (!function_exists('acf_add_options_page')) {
            $this->add_helper_functions();
        }
        
        // Modificar get_field para soportar 'option'
        add_filter('acf/load_value', array($this, 'load_option_value'), 10, 3);
        add_filter('acf/update_value', array($this, 'update_option_value'), 10, 3);
    }
    
    /**
     * Agregar funciones helper
     */
    private function add_helper_functions() {
        if (!function_exists('acf_add_options_page')) {
            /**
             * Agregar página de opciones
             */
            function acf_add_options_page($args = array()) {
                return ACF_Pro_Features_Options_Pages::add_page($args);
            }
        }
        
        if (!function_exists('acf_add_options_sub_page')) {
            /**
             * Agregar sub-página de opciones
             */
            function acf_add_options_sub_page($args = array()) {
                return ACF_Pro_Features_Options_Pages::add_sub_page($args);
            }
        }
        
        if (!function_exists('acf_get_options_pages')) {
            /**
             * Obtener páginas de opciones
             */
            function acf_get_options_pages() {
                return ACF_Pro_Features_Options_Pages::get_pages();
            }
        }
    }
    
    /**
     * Registrar páginas en WordPress
     */
    public function register_pages() {
        // Las páginas se registran automáticamente cuando se llama acf_add_options_page()
        // Este método está aquí por compatibilidad
    }
    
    /**
     * Agregar página de opciones
     */
    public static function add_page($args = array()) {
        $defaults = array(
            'page_title' => __('Options', 'acf-pro-features-free'),
            'menu_title' => __('Options', 'acf-pro-features-free'),
            'menu_slug' => 'acf-options',
            'capability' => 'edit_posts',
            'icon_url' => '',
            'position' => null,
            'parent_slug' => '',
            'redirect' => true,
            'post_id' => 'options',
            'autoload' => false,
        );
        
        $args = wp_parse_args($args, $defaults);
        
        // Agregar a la lista
        self::$pages[$args['menu_slug']] = $args;
        
        // Registrar página en WordPress inmediatamente si admin_menu ya se ejecutó
        // o en el siguiente hook
        if (did_action('admin_menu')) {
            self::register_single_page($args);
        } else {
            add_action('admin_menu', function() use ($args) {
                self::register_single_page($args);
            }, 20);
        }
        
        return $args;
    }
    
    /**
     * Registrar una página individual
     */
    private static function register_single_page($args) {
        if (empty($args['parent_slug'])) {
            // Página principal
            add_menu_page(
                $args['page_title'],
                $args['menu_title'],
                $args['capability'],
                $args['menu_slug'],
                array('ACF_Pro_Features_Options_Pages', 'render_page'),
                $args['icon_url'],
                $args['position']
            );
        } else {
            // Sub-página
            add_submenu_page(
                $args['parent_slug'],
                $args['page_title'],
                $args['menu_title'],
                $args['capability'],
                $args['menu_slug'],
                array('ACF_Pro_Features_Options_Pages', 'render_page'),
                $args['position']
            );
        }
    }
    
    /**
     * Agregar sub-página de opciones
     */
    public static function add_sub_page($args = array()) {
        // Si no se especifica parent, usar la primera página principal
        if (empty($args['parent_slug'])) {
            $parent = self::get_first_parent();
            if ($parent) {
                $args['parent_slug'] = $parent['menu_slug'];
            } else {
                // Crear página principal por defecto
                $parent = self::add_page(array(
                    'page_title' => __('Options', 'acf-pro-features-free'),
                    'menu_title' => __('Options', 'acf-pro-features-free'),
                ));
                $args['parent_slug'] = $parent['menu_slug'];
            }
        }
        
        return self::add_page($args);
    }
    
    /**
     * Obtener primera página principal
     */
    private static function get_first_parent() {
        foreach (self::$pages as $page) {
            if (empty($page['parent_slug'])) {
                return $page;
            }
        }
        return null;
    }
    
    /**
     * Obtener páginas registradas
     */
    public static function get_pages() {
        return self::$pages;
    }
    
    /**
     * Renderizar página de opciones
     */
    public static function render_page() {
        $menu_slug = isset($_GET['page']) ? $_GET['page'] : '';
        $page = isset(self::$pages[$menu_slug]) ? self::$pages[$menu_slug] : null;
        
        if (!$page) {
            wp_die(__('Página de opciones no encontrada', 'acf-pro-features-free'));
        }
        
        // Verificar permisos
        if (!current_user_can($page['capability'])) {
            wp_die(__('No tienes permisos para acceder a esta página', 'acf-pro-features-free'));
        }
        
        // Obtener grupos de campos para esta página
        $field_groups = self::get_field_groups_for_page($page);
        
        // Renderizar formulario
        ?>
        <div class="wrap acf-options-page">
            <h1><?php echo esc_html($page['page_title']); ?></h1>
            
            <?php if (!empty($field_groups)): ?>
                <form method="post" action="">
                    <?php
                    // Nonce
                    wp_nonce_field('acf_options_page_' . $page['menu_slug'], 'acf_options_page_nonce');
                    
                    // Renderizar campos
                    foreach ($field_groups as $field_group) {
                        $fields = function_exists('acf_get_fields') ? acf_get_fields($field_group) : array();
                        if (!empty($fields)) {
                            ?>
                            <div class="acf-fields">
                                <?php
                                foreach ($fields as $field) {
                                    if (function_exists('acf_render_field_wrap')) {
                                        acf_render_field_wrap($field, 'div');
                                    } else {
                                        self::render_field_simple($field);
                                    }
                                }
                                ?>
                            </div>
                            <?php
                        }
                    }
                    ?>
                    
                    <p class="submit">
                        <input type="submit" name="submit" id="submit" class="button button-primary" value="<?php esc_attr_e('Guardar Cambios', 'acf-pro-features-free'); ?>">
                    </p>
                </form>
            <?php else: ?>
                <div class="notice notice-info">
                    <p><?php esc_html_e('No hay grupos de campos asignados a esta página de opciones.', 'acf-pro-features-free'); ?></p>
                    <p>
                        <a href="<?php echo admin_url('post-new.php?post_type=acf-field-group'); ?>" class="button">
                            <?php esc_html_e('Crear Grupo de Campos', 'acf-pro-features-free'); ?>
                        </a>
                    </p>
                </div>
            <?php endif; ?>
        </div>
        <?php
        
        // Procesar guardado
        if (isset($_POST['submit']) && isset($_POST['acf_options_page_nonce'])) {
            if (wp_verify_nonce($_POST['acf_options_page_nonce'], 'acf_options_page_' . $page['menu_slug'])) {
                self::save_options($page);
            }
        }
    }
    
    /**
     * Renderizar campo simple (fallback)
     */
    private static function render_field_simple($field) {
        $value = get_option('options_' . $field['name'], '');
        ?>
        <div class="acf-field acf-field-<?php echo esc_attr($field['type']); ?>">
            <div class="acf-label">
                <label><?php echo esc_html($field['label']); ?></label>
            </div>
            <div class="acf-input">
                <?php
                switch ($field['type']) {
                    case 'text':
                    case 'email':
                    case 'url':
                        ?>
                        <input type="<?php echo esc_attr($field['type']); ?>" 
                               name="acf[<?php echo esc_attr($field['key']); ?>]" 
                               value="<?php echo esc_attr($value); ?>" />
                        <?php
                        break;
                    case 'textarea':
                        ?>
                        <textarea name="acf[<?php echo esc_attr($field['key']); ?>]" rows="4"><?php echo esc_textarea($value); ?></textarea>
                        <?php
                        break;
                    default:
                        if (function_exists('acf_render_field')) {
                            $field['value'] = $value;
                            acf_render_field($field);
                        }
                        break;
                }
                ?>
            </div>
        </div>
        <?php
    }
    
    /**
     * Obtener grupos de campos para la página
     */
    private static function get_field_groups_for_page($page) {
        if (!function_exists('acf_get_field_groups')) {
            return array();
        }
        
        $field_groups = acf_get_field_groups();
        $matching_groups = array();
        
        foreach ($field_groups as $group) {
            $location_rules = isset($group['location']) ? $group['location'] : array();
            
            // Verificar si el grupo está asignado a esta página de opciones
            foreach ($location_rules as $rule_group) {
                foreach ($rule_group as $rule) {
                    if ($rule['param'] === 'options_page' && $rule['operator'] === '==') {
                        if ($rule['value'] === $page['menu_slug'] || $rule['value'] === 'all') {
                            $matching_groups[] = $group;
                            break 2;
                        }
                    }
                }
            }
        }
        
        return $matching_groups;
    }
    
    /**
     * Guardar opciones
     */
    private static function save_options($page) {
        if (!isset($_POST['acf']) || !is_array($_POST['acf'])) {
            return;
        }
        
        // Usar ACF para procesar y guardar si está disponible
        if (function_exists('acf_save_post')) {
            acf_save_post('option');
        } else {
            // Fallback manual
            foreach ($_POST['acf'] as $field_key => $value) {
                $field = function_exists('acf_get_field') ? acf_get_field($field_key) : null;
                if (!$field) {
                    continue;
                }
                
                $field_name = $field['name'];
                $option_name = 'options_' . $field_name;
                
                // Procesar valor según el tipo de campo
                $value = self::process_field_value($value, $field);
                
                // Guardar
                update_option($option_name, $value);
            }
        }
        
        // Mensaje de éxito
        add_action('admin_notices', function() {
            ?>
            <div class="notice notice-success is-dismissible">
                <p><?php esc_html_e('Opciones guardadas correctamente.', 'acf-pro-features-free'); ?></p>
            </div>
            <?php
        });
    }
    
    /**
     * Procesar valor de campo
     */
    private static function process_field_value($value, $field) {
        switch ($field['type']) {
            case 'number':
                return floatval($value);
            case 'true_false':
                return (bool) $value;
            case 'image':
            case 'file':
                return intval($value);
            default:
                return $value;
        }
    }
    
    /**
     * Cargar valor de opción
     */
    public function load_option_value($value, $post_id, $field) {
        if ($post_id === 'option' || $post_id === 'options') {
            $option_name = 'options_' . $field['name'];
            $option_value = get_option($option_name, null);
            
            if ($option_value !== null) {
                return $option_value;
            }
        }
        
        return $value;
    }
    
    /**
     * Actualizar valor de opción
     */
    public function update_option_value($value, $post_id, $field) {
        if ($post_id === 'option' || $post_id === 'options') {
            $option_name = 'options_' . $field['name'];
            update_option($option_name, $value);
            return $value;
        }
        
        return $value;
    }
}

// Inicializar
new ACF_Pro_Features_Options_Pages();

