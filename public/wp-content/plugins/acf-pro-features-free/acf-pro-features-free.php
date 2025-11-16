<?php
/**
 * Plugin Name: ACF Pro Features Free
 * Plugin URI: https://github.com/your-repo/acf-pro-features-free
 * Description: Recrea las funcionalidades de ACF PRO (Repeater, Flexible Content, Clone) de forma gratuita y segura. Compatible con ACF gratuito y GraphQL.
 * Version: 1.0.0
 * Author: Restaurant Team
 * Author URI: https://restaurant.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: acf-pro-features-free
 * Domain Path: /languages
 * Requires at least: 5.0
 * Requires PHP: 7.4
 */

// Prevenir acceso directo
if (!defined('ABSPATH')) {
    exit;
}

// Definir constantes del plugin
define('ACF_PRO_FEATURES_VERSION', '1.0.0');
define('ACF_PRO_FEATURES_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ACF_PRO_FEATURES_PLUGIN_URL', plugin_dir_url(__FILE__));
define('ACF_PRO_FEATURES_PLUGIN_BASENAME', plugin_basename(__FILE__));

/**
 * Clase principal del plugin
 */
class ACF_Pro_Features_Free {
    
    /**
     * Instancia única del plugin
     */
    private static $instance = null;
    
    /**
     * Obtener instancia única
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     */
    private function __construct() {
        $this->init();
    }
    
    /**
     * Inicializar el plugin
     */
    private function init() {
        // Verificar que ACF esté activo
        add_action('admin_init', array($this, 'check_acf_dependency'));
        
        // Cargar archivos necesarios
        $this->load_dependencies();
        
        // Inicializar componentes
        add_action('plugins_loaded', array($this, 'load_components'));
        
        // Cargar scripts y estilos
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        
        // Registrar hooks de activación/desactivación
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }
    
    /**
     * Verificar dependencia de ACF
     */
    public function check_acf_dependency() {
        if (!function_exists('acf_add_local_field_group')) {
            add_action('admin_notices', array($this, 'acf_missing_notice'));
            deactivate_plugins(ACF_PRO_FEATURES_PLUGIN_BASENAME);
        }
    }
    
    /**
     * Notificación si ACF no está activo
     */
    public function acf_missing_notice() {
        ?>
        <div class="notice notice-error">
            <p>
                <strong><?php esc_html_e('ACF Pro Features Free', 'acf-pro-features-free'); ?></strong>: 
                <?php esc_html_e('Este plugin requiere Advanced Custom Fields (ACF) para funcionar. Por favor, instala y activa ACF primero.', 'acf-pro-features-free'); ?>
            </p>
        </div>
        <?php
    }
    
    /**
     * Cargar dependencias
     */
    private function load_dependencies() {
        // NO cargar las clases de campos aquí porque acf_field aún no existe
        // Se cargarán cuando ACF esté listo mediante el hook acf/include_field_types
        
        // Solo cargar archivos que no dependen de acf_field
        require_once ACF_PRO_FEATURES_PLUGIN_DIR . 'includes/class-graphql-integration.php';
        require_once ACF_PRO_FEATURES_PLUGIN_DIR . 'includes/class-admin-page.php';
        require_once ACF_PRO_FEATURES_PLUGIN_DIR . 'includes/functions.php';
        
        // Cargar las clases de campos cuando ACF esté listo
        add_action('acf/include_field_types', array($this, 'load_field_classes'));
    }
    
    /**
     * Cargar clases de campos cuando ACF esté listo
     */
    public function load_field_classes() {
        // Verificar que acf_field exista
        if (!class_exists('acf_field')) {
            return;
        }
        
        // Solo registrar si ACF PRO no está activo
        if (class_exists('acf_field_repeater')) {
            return;
        }
        
        // Ahora sí podemos cargar las clases que extienden acf_field
        require_once ACF_PRO_FEATURES_PLUGIN_DIR . 'includes/class-repeater-field.php';
        require_once ACF_PRO_FEATURES_PLUGIN_DIR . 'includes/class-flexible-content-field.php';
        require_once ACF_PRO_FEATURES_PLUGIN_DIR . 'includes/class-clone-field.php';
        
        // Registrar los tipos de campo
        $repeater = acf_register_field_type('ACF_Pro_Features_Repeater_Field');
        $flexible = acf_register_field_type('ACF_Pro_Features_Flexible_Content_Field');
        $clone = acf_register_field_type('ACF_Pro_Features_Clone_Field');
        
        // Asegurar que la propiedad 'pro' sea false
        if ($repeater) {
            $repeater->pro = false;
        }
        if ($flexible) {
            $flexible->pro = false;
        }
        if ($clone) {
            $clone->pro = false;
        }
        
        // Interceptar acf_get_pro_field_types() para remover nuestros campos
        // Como ACF no tiene un filtro, usamos un wrapper de la función
        add_filter('acf/field_group/admin_enqueue_scripts', array($this, 'intercept_pro_field_types'), 5);
        add_action('acf/field_group/admin_enqueue_scripts', array($this, 'remove_pro_from_js'), 20);
        
        // Filtrar la información del tipo de campo para ocultar "(PRO Only)"
        add_filter('acf/get_field_type_prop', array($this, 'remove_pro_label'), 10, 3);
        add_filter('acf/get_field_types_info', array($this, 'remove_pro_from_info'), 10, 1);
    }
    
    /**
     * Interceptar acf_get_pro_field_types() antes de que se use
     */
    public function intercept_pro_field_types() {
        // Verificar que nuestros campos estén registrados
        $our_fields = array('repeater', 'flexible_content', 'clone');
        $fields_registered = false;
        
        foreach ($our_fields as $field_name) {
            $field_type = acf_get_field_type($field_name);
            if ($field_type && (
                get_class($field_type) === 'ACF_Pro_Features_Repeater_Field' || 
                get_class($field_type) === 'ACF_Pro_Features_Flexible_Content_Field' ||
                get_class($field_type) === 'ACF_Pro_Features_Clone_Field'
            )) {
                $fields_registered = true;
                break;
            }
        }
        
        if ($fields_registered) {
            // Modificar los datos localizados después de que ACF los establezca
            add_action('admin_footer', function() use ($our_fields) {
                if (!function_exists('get_current_screen') || !get_current_screen()) {
                    return;
                }
                
                $screen = get_current_screen();
                if ($screen->post_type !== 'acf-field-group') {
                    return;
                }
                ?>
                <script type="text/javascript">
                // Modificar los datos de ACF inmediatamente después de que se carguen
                (function() {
                    function modifyAcfData() {
                        if (typeof acf === 'undefined' || !acf.data) {
                            return;
                        }
                        
                        <?php foreach ($our_fields as $field_name): ?>
                        // Remover de PROFieldTypes
                        if (acf.data.PROFieldTypes && acf.data.PROFieldTypes['<?php echo esc_js($field_name); ?>']) {
                            delete acf.data.PROFieldTypes['<?php echo esc_js($field_name); ?>'];
                        }
                        
                        // Remover propiedad 'pro' de fieldTypes
                        if (acf.data.fieldTypes && acf.data.fieldTypes['<?php echo esc_js($field_name); ?>']) {
                            acf.data.fieldTypes['<?php echo esc_js($field_name); ?>'].pro = false;
                        }
                        <?php endforeach; ?>
                    }
                    
                    // Ejecutar múltiples veces para asegurar que se ejecute
                    modifyAcfData();
                    
                    // Ejecutar cuando ACF esté listo
                    if (typeof acf !== 'undefined' && typeof acf.addAction !== 'undefined') {
                        acf.addAction('prepare', modifyAcfData, 1);
                    }
                    
                    // Ejecutar cuando el DOM esté listo
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', modifyAcfData);
                    } else {
                        setTimeout(modifyAcfData, 0);
                    }
                    
                    // Ejecutar después de un pequeño delay para asegurar que ACF haya cargado
                    setTimeout(modifyAcfData, 100);
                    setTimeout(modifyAcfData, 500);
                })();
                </script>
                <?php
            }, 1);
        }
    }
    
    /**
     * Remover campos PRO del JavaScript usando inline script
     */
    public function remove_pro_from_js() {
        $our_fields = array('repeater', 'flexible_content', 'clone');
        $fields_to_remove = array();
        
        foreach ($our_fields as $field_name) {
            $field_type = acf_get_field_type($field_name);
            if ($field_type && (
                get_class($field_type) === 'ACF_Pro_Features_Repeater_Field' || 
                get_class($field_type) === 'ACF_Pro_Features_Flexible_Content_Field' ||
                get_class($field_type) === 'ACF_Pro_Features_Clone_Field'
            )) {
                $fields_to_remove[] = $field_name;
            }
        }
        
        if (!empty($fields_to_remove)) {
            // Usar acf_localize_data para modificar los datos antes de que se pasen a JS
            add_filter('acf/input/admin_l10n', function($l10n) use ($fields_to_remove) {
                // Este filtro se ejecuta después, así que usamos JavaScript directo
                return $l10n;
            });
            
            // Agregar script que se ejecute antes de que ACF use los datos
            add_action('admin_footer', function() use ($fields_to_remove) {
                if (!function_exists('get_current_screen') || !get_current_screen()) {
                    return;
                }
                
                $screen = get_current_screen();
                if ($screen->post_type !== 'acf-field-group') {
                    return;
                }
                ?>
                <script type="text/javascript">
                (function() {
                    // Interceptar cuando ACF establece los datos
                    if (typeof acf !== 'undefined') {
                        // Usar un observer o modificar directamente después de que se cargue
                        var originalPrepare = acf.doAction || function(){};
                        
                        // Modificar datos inmediatamente si ya están disponibles
                        function removeProFields() {
                            if (typeof acf !== 'undefined' && acf.data) {
                                <?php foreach ($fields_to_remove as $field_name): ?>
                                if (acf.data.PROFieldTypes && acf.data.PROFieldTypes['<?php echo esc_js($field_name); ?>']) {
                                    delete acf.data.PROFieldTypes['<?php echo esc_js($field_name); ?>'];
                                }
                                if (acf.data.fieldTypes && acf.data.fieldTypes['<?php echo esc_js($field_name); ?>']) {
                                    acf.data.fieldTypes['<?php echo esc_js($field_name); ?>'].pro = false;
                                }
                                <?php endforeach; ?>
                            }
                        }
                        
                        // Ejecutar inmediatamente
                        removeProFields();
                        
                        // También ejecutar cuando ACF esté listo
                        if (typeof acf.addAction !== 'undefined') {
                            acf.addAction('prepare', removeProFields, 1);
                        }
                        
                        // Ejecutar después de que el DOM esté listo
                        if (document.readyState === 'loading') {
                            document.addEventListener('DOMContentLoaded', removeProFields);
                        } else {
                            removeProFields();
                        }
                    }
                })();
                </script>
                <?php
            }, 5);
        }
    }
    
    /**
     * Remover etiqueta PRO de los campos
     */
    public function remove_pro_label($value, $name, $prop) {
        // Si es la propiedad 'pro' y el campo es uno de los nuestros, retornar false
        if ($prop === 'pro' && in_array($name, array('repeater', 'flexible_content', 'clone'))) {
            $field_type = acf_get_field_type($name);
            if ($field_type && (get_class($field_type) === 'ACF_Pro_Features_Repeater_Field' || 
                                get_class($field_type) === 'ACF_Pro_Features_Flexible_Content_Field' ||
                                get_class($field_type) === 'ACF_Pro_Features_Clone_Field')) {
                return false;
            }
        }
        
        return $value;
    }
    
    /**
     * Remover PRO de la información de tipos de campo
     */
    public function remove_pro_from_info($field_types_info) {
        $our_fields = array('repeater', 'flexible_content', 'clone');
        
        foreach ($our_fields as $field_name) {
            if (isset($field_types_info[$field_name])) {
                $field_type = acf_get_field_type($field_name);
                if ($field_type && (get_class($field_type) === 'ACF_Pro_Features_Repeater_Field' || 
                                    get_class($field_type) === 'ACF_Pro_Features_Flexible_Content_Field' ||
                                    get_class($field_type) === 'ACF_Pro_Features_Clone_Field')) {
                    $field_types_info[$field_name]['pro'] = false;
                }
            }
        }
        
        return $field_types_info;
    }
    
    /**
     * Cargar componentes
     */
    public function load_components() {
        if (!function_exists('acf_add_local_field_group')) {
            return;
        }
        
        // Los campos se registran automáticamente mediante el hook acf/include_field_types
        // No necesitamos instanciarlos manualmente
        
        // Inicializar integración GraphQL
        if (class_exists('WPGraphQL')) {
            new ACF_Pro_Features_GraphQL_Integration();
        }
        
        // Inicializar página de administración
        if (is_admin()) {
            new ACF_Pro_Features_Admin_Page();
        }
    }
    
    /**
     * Cargar scripts y estilos del admin
     */
    public function enqueue_admin_assets($hook) {
        // Cargar en páginas de edición y en la página de ACF
        $acf_pages = array('post.php', 'post-new.php', 'page.php', 'page-new.php', 'acf-field-group');
        $is_acf_page = strpos($hook, 'acf') !== false;
        
        if (!in_array($hook, $acf_pages) && !$is_acf_page) {
            return;
        }
        
        // CSS
        wp_enqueue_style(
            'acf-pro-features-admin',
            ACF_PRO_FEATURES_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            ACF_PRO_FEATURES_VERSION
        );
        
        // JavaScript
        wp_enqueue_script(
            'acf-pro-features-admin',
            ACF_PRO_FEATURES_PLUGIN_URL . 'assets/js/admin.js',
            array('jquery', 'jquery-ui-sortable', 'wp-media'),
            ACF_PRO_FEATURES_VERSION,
            true
        );
        
        // Localizar script
        wp_localize_script('acf-pro-features-admin', 'acfProFeatures', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('acf_pro_features_nonce'),
            'strings' => array(
                'addRow' => __('Agregar Fila', 'acf-pro-features-free'),
                'removeRow' => __('Eliminar Fila', 'acf-pro-features-free'),
                'confirmDelete' => __('¿Estás seguro de que deseas eliminar esta fila?', 'acf-pro-features-free'),
            )
        ));
    }
    
    /**
     * Cargar scripts y estilos del frontend
     */
    public function enqueue_frontend_assets() {
        // Solo si es necesario en el frontend
    }
    
    /**
     * Activar plugin
     */
    public function activate() {
        // Crear opciones por defecto
        add_option('acf_pro_features_version', ACF_PRO_FEATURES_VERSION);
        add_option('acf_pro_features_activated', true);
        
        // Flush rewrite rules si es necesario
        flush_rewrite_rules();
    }
    
    /**
     * Desactivar plugin
     */
    public function deactivate() {
        // Limpiar opciones si es necesario
        // delete_option('acf_pro_features_version');
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }
}

/**
 * Inicializar el plugin
 */
function acf_pro_features_free_init() {
    return ACF_Pro_Features_Free::get_instance();
}

// Iniciar el plugin
acf_pro_features_free_init();

