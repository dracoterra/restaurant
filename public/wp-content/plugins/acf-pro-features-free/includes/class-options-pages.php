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
        // Agregar funciones helper
        $this->add_helper_functions();
        
        // Modificar get_field para soportar 'option'
        add_filter('acf/load_value', array($this, 'load_option_value'), 10, 3);
        add_filter('acf/update_value', array($this, 'update_option_value'), 10, 3);
        
        // Interceptar la página de preview de ACF y reemplazarla con nuestra interfaz
        add_action('admin_menu', array($this, 'intercept_acf_options_page'), 5);
    }
    
    /**
     * Interceptar la página de Options Pages de ACF
     */
    public function intercept_acf_options_page() {
        // Remover la página de preview de ACF
        remove_submenu_page('edit.php?post_type=acf-field-group', 'acf_options_preview');
        
        // Agregar nuestra propia página de Options Pages
        add_submenu_page(
            'edit.php?post_type=acf-field-group',
            __('Options Pages', 'acf-pro-features-free'),
            __('Options Pages', 'acf-pro-features-free'),
            'manage_options',
            'acf_options_preview',
            array($this, 'render_options_pages_list')
        );
    }
    
    /**
     * Renderizar lista de Options Pages (similar a ACF PRO)
     */
    public function render_options_pages_list() {
        // Procesar creación de nueva página primero
        if (isset($_GET['action']) && $_GET['action'] === 'add' && isset($_GET['page_title'])) {
            $this->handle_add_options_page();
            return;
        }
        
        $pages = self::get_pages();
        ?>
        <div class="wrap acf-admin-page acf-options-pages-list">
            <h1 class="wp-heading-inline">
                <?php esc_html_e('Options Pages', 'acf-pro-features-free'); ?>
            </h1>
            <a href="#" class="page-title-action acf-btn acf-btn-primary" id="acf-add-options-page">
                <?php esc_html_e('+ Add Options Page', 'acf-pro-features-free'); ?>
            </a>
            <hr class="wp-header-end">
            
            <?php if (!empty($pages)): ?>
                <div class="acf-options-pages-grid" style="margin-top: 20px;">
                    <?php foreach ($pages as $page): ?>
                        <div class="acf-options-page-card" style="border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; background: #fff; border-radius: 4px;">
                            <h2 style="margin-top: 0;">
                                <a href="<?php echo esc_url(admin_url('admin.php?page=' . $page['menu_slug'])); ?>">
                                    <?php echo esc_html($page['page_title']); ?>
                                </a>
                            </h2>
                            <p>
                                <strong><?php esc_html_e('Menu Title:', 'acf-pro-features-free'); ?></strong> 
                                <?php echo esc_html($page['menu_title']); ?><br>
                                <strong><?php esc_html_e('Menu Slug:', 'acf-pro-features-free'); ?></strong> 
                                <code><?php echo esc_html($page['menu_slug']); ?></code><br>
                                <?php if (!empty($page['parent_slug'])): ?>
                                    <strong><?php esc_html_e('Parent:', 'acf-pro-features-free'); ?></strong> 
                                    <?php echo esc_html($page['parent_slug']); ?>
                                <?php endif; ?>
                            </p>
                            <p>
                                <a href="<?php echo esc_url(admin_url('admin.php?page=' . $page['menu_slug'])); ?>" class="button button-primary">
                                    <?php esc_html_e('Edit', 'acf-pro-features-free'); ?>
                                </a>
                            </p>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <div class="acf-options-pages-empty" style="text-align: center; padding: 60px 20px; background: #fff; border: 1px solid #ddd; border-radius: 4px; margin-top: 20px;">
                    <div style="font-size: 48px; color: #ccc; margin-bottom: 20px;">📄</div>
                    <h2><?php esc_html_e('No Options Pages', 'acf-pro-features-free'); ?></h2>
                    <p style="color: #666; max-width: 600px; margin: 20px auto;">
                        <?php esc_html_e('Options Pages allow you to create custom admin pages for managing global settings via fields. You can create multiple pages and sub-pages.', 'acf-pro-features-free'); ?>
                    </p>
                    <p>
                        <a href="#" class="button button-primary button-large" id="acf-add-options-page-first">
                            <?php esc_html_e('+ Add Options Page', 'acf-pro-features-free'); ?>
                        </a>
                    </p>
                    <p style="margin-top: 30px; font-size: 13px; color: #999;">
                        <?php esc_html_e('New to ACF?', 'acf-pro-features-free'); ?> 
                        <a href="https://www.advancedcustomfields.com/resources/getting-started/" target="_blank">
                            <?php esc_html_e('Take a look at our getting started guide.', 'acf-pro-features-free'); ?>
                        </a>
                    </p>
                </div>
            <?php endif; ?>
        </div>
        
        <script type="text/javascript">
        jQuery(document).ready(function($) {
            $('#acf-add-options-page, #acf-add-options-page-first').on('click', function(e) {
                e.preventDefault();
                
                var pageTitle = prompt('<?php esc_html_e('Page Title:', 'acf-pro-features-free'); ?>', '<?php esc_html_e('Options', 'acf-pro-features-free'); ?>');
                if (!pageTitle) {
                    return;
                }
                
                var menuTitle = prompt('<?php esc_html_e('Menu Title:', 'acf-pro-features-free'); ?>', pageTitle);
                if (!menuTitle) {
                    return;
                }
                
                var menuSlug = prompt('<?php esc_html_e('Menu Slug:', 'acf-pro-features-free'); ?>', 'acf-options-' + pageTitle.toLowerCase().replace(/\s+/g, '-'));
                if (!menuSlug) {
                    return;
                }
                
                // Crear página usando AJAX o redirigir
                window.location.href = '<?php echo esc_url(admin_url('admin.php?page=acf_options_preview&action=add&page_title=')); ?>' + encodeURIComponent(pageTitle) + '&menu_title=' + encodeURIComponent(menuTitle) + '&menu_slug=' + encodeURIComponent(menuSlug);
            });
        });
        </script>
        <?php
    }
    
    /**
     * Manejar creación de nueva Options Page
     */
    private function handle_add_options_page() {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('No tienes permisos para realizar esta acción', 'acf-pro-features-free'));
        }
        
        $page_title = isset($_GET['page_title']) ? sanitize_text_field($_GET['page_title']) : '';
        $menu_title = isset($_GET['menu_title']) ? sanitize_text_field($_GET['menu_title']) : $page_title;
        $menu_slug = isset($_GET['menu_slug']) ? sanitize_key($_GET['menu_slug']) : '';
        
        if (empty($page_title) || empty($menu_slug)) {
            wp_die(esc_html__('Parámetros inválidos', 'acf-pro-features-free'));
        }
        
        // Crear la página
        self::add_page(array(
            'page_title' => $page_title,
            'menu_title' => $menu_title,
            'menu_slug' => $menu_slug,
        ));
        
        // Redirigir a la página de edición
        wp_redirect(admin_url('admin.php?page=' . $menu_slug));
        exit;
    }
    
    /**
     * Agregar funciones helper
     */
    private function add_helper_functions() {
        // Registrar funciones antes de que ACF las busque
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
             * Esta función es usada por ACF para detectar páginas registradas
             */
            function acf_get_options_pages() {
                $pages = ACF_Pro_Features_Options_Pages::get_pages();
                
                // Formatear para compatibilidad con ACF
                $formatted = array();
                foreach ($pages as $slug => $page) {
                    $formatted[] = array(
                        'page_title' => $page['page_title'],
                        'menu_title' => $page['menu_title'],
                        'menu_slug' => $page['menu_slug'],
                        'capability' => $page['capability'],
                        'icon_url' => $page['icon_url'],
                        'position' => $page['position'],
                        'parent_slug' => isset($page['parent_slug']) ? $page['parent_slug'] : '',
                        'redirect' => isset($page['redirect']) ? $page['redirect'] : true,
                        'post_id' => isset($page['post_id']) ? $page['post_id'] : 'options',
                        'autoload' => isset($page['autoload']) ? $page['autoload'] : false,
                    );
                }
                
                return $formatted;
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
        
        // Sanitizar argumentos
        $args['page_title'] = sanitize_text_field($args['page_title']);
        $args['menu_title'] = sanitize_text_field($args['menu_title']);
        $args['menu_slug'] = sanitize_key($args['menu_slug']);
        $args['capability'] = sanitize_key($args['capability']);
        $args['icon_url'] = esc_url_raw($args['icon_url']);
        $args['parent_slug'] = sanitize_text_field($args['parent_slug']);
        $args['post_id'] = sanitize_key($args['post_id']);
        
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
        $menu_slug = isset($_GET['page']) ? sanitize_text_field($_GET['page']) : '';
        $page = isset(self::$pages[$menu_slug]) ? self::$pages[$menu_slug] : null;
        
        if (!$page) {
            wp_die(esc_html__('Página de opciones no encontrada', 'acf-pro-features-free'));
        }
        
        // Verificar permisos
        $capability = isset($page['capability']) ? sanitize_text_field($page['capability']) : 'edit_posts';
        if (!current_user_can($capability)) {
            wp_die(esc_html__('No tienes permisos para acceder a esta página', 'acf-pro-features-free'));
        }
        
        // Obtener grupos de campos para esta página
        $field_groups = self::get_field_groups_for_page($page);
        
        // Renderizar formulario
        ?>
        <div class="wrap acf-options-page">
            <h1 class="wp-heading-inline"><?php echo esc_html($page['page_title']); ?></h1>
            <a href="<?php echo esc_url(admin_url('admin.php?page=acf_options_preview')); ?>" class="page-title-action">
                <?php esc_html_e('← Back to Options Pages', 'acf-pro-features-free'); ?>
            </a>
            <hr class="wp-header-end">
            
            <?php if (!empty($field_groups)): ?>
                <form method="post" action="">
                    <?php
                    // Nonce
                    wp_nonce_field('acf_options_page_' . $page['menu_slug'], 'acf_options_page_nonce');
                    
                    // Establecer post_id como 'option' para que ACF cargue valores correctos
                    if (function_exists('acf_setup_meta')) {
                        acf_setup_meta(array(), 'option', true);
                    }
                    
                    // Renderizar campos
                    foreach ($field_groups as $field_group) {
                        $fields = function_exists('acf_get_fields') ? acf_get_fields($field_group) : array();
                        if (!empty($fields)) {
                            ?>
                            <div class="acf-fields -clear" style="margin-top: 20px;">
                                <?php
                                foreach ($fields as $field) {
                                    // Establecer post_id como 'option' para cada campo
                                    $field['post_id'] = 'option';
                                    
                                    // Cargar valor desde opciones si ACF no lo hace automáticamente
                                    if (!isset($field['value']) || $field['value'] === null) {
                                        $option_name = 'options_' . $field['name'];
                                        $field['value'] = get_option($option_name, '');
                                    }
                                    
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
                    
                    // Limpiar meta
                    if (function_exists('acf_reset_meta')) {
                        acf_reset_meta('option');
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
            $nonce = sanitize_text_field($_POST['acf_options_page_nonce']);
            $menu_slug = isset($page['menu_slug']) ? sanitize_key($page['menu_slug']) : '';
            if (wp_verify_nonce($nonce, 'acf_options_page_' . $menu_slug)) {
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
                // Sanitizar field_key
                $field_key = sanitize_text_field($field_key);
                
                $field = function_exists('acf_get_field') ? acf_get_field($field_key) : null;
                if (!$field || !isset($field['name'])) {
                    continue;
                }
                
                $field_name = sanitize_key($field['name']);
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
        $field_type = isset($field['type']) ? sanitize_key($field['type']) : 'text';
        
        switch ($field_type) {
            case 'number':
                return floatval($value);
            case 'true_false':
                return (bool) $value;
            case 'image':
            case 'file':
                return absint($value);
            case 'email':
                return sanitize_email($value);
            case 'url':
                return esc_url_raw($value);
            case 'textarea':
                return sanitize_textarea_field($value);
            case 'text':
            default:
                return sanitize_text_field($value);
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

