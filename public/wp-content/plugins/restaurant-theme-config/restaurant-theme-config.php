<?php
/**
 * Plugin Name: Restaurant Theme Config
 * Description: Configuración del tema para el restaurante - Registra menús y opciones del tema
 * Version: 1.0.0
 * Author: Restaurant Team
 */

// Prevenir acceso directo
if (!defined('ABSPATH')) {
    exit;
}

class Restaurant_Theme_Config {
    
    public function __construct() {
        // Registrar ubicaciones de menús
        add_action('after_setup_theme', array($this, 'register_nav_menus'));
        
        // Registrar opciones del tema
        add_action('admin_init', array($this, 'register_theme_options'));
        add_action('admin_menu', array($this, 'add_theme_options_page'));
        
        // Agregar endpoint REST API para opciones del tema
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }
    
    /**
     * Registrar ubicaciones de menús
     */
    public function register_nav_menus() {
        register_nav_menus(array(
            'primary' => __('Primary Menu', 'restaurant'),
            'footer' => __('Footer Menu', 'restaurant')
        ));
    }
    
    /**
     * Registrar opciones del tema
     */
    public function register_theme_options() {
        // Registrar configuración
        register_setting('restaurant_theme_options', 'restaurant_theme_settings');
        
        // Sección de información general
        add_settings_section(
            'restaurant_general_section',
            __('General Information', 'restaurant'),
            array($this, 'general_section_callback'),
            'restaurant_theme_options'
        );
        
        // Campo Logo
        add_settings_field(
            'logo',
            __('Logo', 'restaurant'),
            array($this, 'logo_field_callback'),
            'restaurant_theme_options',
            'restaurant_general_section'
        );
        
        // Campo Dirección
        add_settings_field(
            'address',
            __('Address', 'restaurant'),
            array($this, 'address_field_callback'),
            'restaurant_theme_options',
            'restaurant_general_section'
        );
        
        // Campo Teléfono
        add_settings_field(
            'phone',
            __('Phone', 'restaurant'),
            array($this, 'phone_field_callback'),
            'restaurant_theme_options',
            'restaurant_general_section'
        );
        
        // Campo Email
        add_settings_field(
            'email',
            __('Email', 'restaurant'),
            array($this, 'email_field_callback'),
            'restaurant_theme_options',
            'restaurant_general_section'
        );
        
        // Sección de redes sociales
        add_settings_section(
            'restaurant_social_section',
            __('Social Media', 'restaurant'),
            array($this, 'social_section_callback'),
            'restaurant_theme_options'
        );
        
        // Campo Facebook
        add_settings_field(
            'facebook',
            __('Facebook URL', 'restaurant'),
            array($this, 'facebook_field_callback'),
            'restaurant_theme_options',
            'restaurant_social_section'
        );
        
        // Campo Instagram
        add_settings_field(
            'instagram',
            __('Instagram URL', 'restaurant'),
            array($this, 'instagram_field_callback'),
            'restaurant_theme_options',
            'restaurant_social_section'
        );
        
        // Campo Dribbble
        add_settings_field(
            'dribbble',
            __('Dribbble URL', 'restaurant'),
            array($this, 'dribbble_field_callback'),
            'restaurant_theme_options',
            'restaurant_social_section'
        );
        
        // Campo Copyright
        add_settings_field(
            'copyright',
            __('Copyright Text', 'restaurant'),
            array($this, 'copyright_field_callback'),
            'restaurant_theme_options',
            'restaurant_general_section'
        );
    }
    
    /**
     * Agregar página de opciones del tema
     */
    public function add_theme_options_page() {
        add_theme_page(
            __('Theme Options', 'restaurant'),
            __('Theme Options', 'restaurant'),
            'manage_options',
            'restaurant-theme-options',
            array($this, 'theme_options_page_callback')
        );
    }
    
    /**
     * Callback de sección general
     */
    public function general_section_callback() {
        echo '<p>' . __('Configure general information for your restaurant.', 'restaurant') . '</p>';
    }
    
    /**
     * Callback de sección de redes sociales
     */
    public function social_section_callback() {
        echo '<p>' . __('Configure social media links.', 'restaurant') . '</p>';
    }
    
    /**
     * Callback campo Logo
     */
    public function logo_field_callback() {
        $options = get_option('restaurant_theme_settings');
        $logo = isset($options['logo']) ? $options['logo'] : '';
        ?>
        <input type="text" name="restaurant_theme_settings[logo]" value="<?php echo esc_attr($logo); ?>" class="regular-text" />
        <button type="button" class="button" id="upload_logo_button"><?php _e('Upload Logo', 'restaurant'); ?></button>
        <?php if ($logo): ?>
            <br><img src="<?php echo esc_url($logo); ?>" style="max-width: 200px; margin-top: 10px;" />
        <?php endif; ?>
        <script>
        jQuery(document).ready(function($) {
            $('#upload_logo_button').click(function(e) {
                e.preventDefault();
                var mediaUploader = wp.media({
                    title: '<?php _e('Choose Logo', 'restaurant'); ?>',
                    button: {
                        text: '<?php _e('Use this logo', 'restaurant'); ?>'
                    },
                    multiple: false
                });
                mediaUploader.on('select', function() {
                    var attachment = mediaUploader.state().get('selection').first().toJSON();
                    $('input[name="restaurant_theme_settings[logo]"]').val(attachment.url);
                });
                mediaUploader.open();
            });
        });
        </script>
        <?php
    }
    
    /**
     * Callback campo Dirección
     */
    public function address_field_callback() {
        $options = get_option('restaurant_theme_settings');
        $address = isset($options['address']) ? $options['address'] : '4517 Washington Ave, Kentucky 39495';
        ?>
        <input type="text" name="restaurant_theme_settings[address]" value="<?php echo esc_attr($address); ?>" class="regular-text" />
        <?php
    }
    
    /**
     * Callback campo Teléfono
     */
    public function phone_field_callback() {
        $options = get_option('restaurant_theme_settings');
        $phone = isset($options['phone']) ? $options['phone'] : '+01 780 859 632';
        ?>
        <input type="text" name="restaurant_theme_settings[phone]" value="<?php echo esc_attr($phone); ?>" class="regular-text" />
        <?php
    }
    
    /**
     * Callback campo Email
     */
    public function email_field_callback() {
        $options = get_option('restaurant_theme_settings');
        $email = isset($options['email']) ? $options['email'] : 'info@restaurant.com';
        ?>
        <input type="email" name="restaurant_theme_settings[email]" value="<?php echo esc_attr($email); ?>" class="regular-text" />
        <?php
    }
    
    /**
     * Callback campo Facebook
     */
    public function facebook_field_callback() {
        $options = get_option('restaurant_theme_settings');
        $facebook = isset($options['facebook']) ? $options['facebook'] : '#';
        ?>
        <input type="url" name="restaurant_theme_settings[facebook]" value="<?php echo esc_attr($facebook); ?>" class="regular-text" />
        <?php
    }
    
    /**
     * Callback campo Instagram
     */
    public function instagram_field_callback() {
        $options = get_option('restaurant_theme_settings');
        $instagram = isset($options['instagram']) ? $options['instagram'] : '#';
        ?>
        <input type="url" name="restaurant_theme_settings[instagram]" value="<?php echo esc_attr($instagram); ?>" class="regular-text" />
        <?php
    }
    
    /**
     * Callback campo Dribbble
     */
    public function dribbble_field_callback() {
        $options = get_option('restaurant_theme_settings');
        $dribbble = isset($options['dribbble']) ? $options['dribbble'] : '#';
        ?>
        <input type="url" name="restaurant_theme_settings[dribbble]" value="<?php echo esc_attr($dribbble); ?>" class="regular-text" />
        <?php
    }
    
    /**
     * Callback campo Copyright
     */
    public function copyright_field_callback() {
        $options = get_option('restaurant_theme_settings');
        $copyright = isset($options['copyright']) ? $options['copyright'] : 'Copyright © 2025 All Rights Reserved.';
        ?>
        <input type="text" name="restaurant_theme_settings[copyright]" value="<?php echo esc_attr($copyright); ?>" class="regular-text" />
        <?php
    }
    
    /**
     * Página de opciones del tema
     */
    public function theme_options_page_callback() {
        if (!current_user_can('manage_options')) {
            return;
        }
        
        if (isset($_GET['settings-updated'])) {
            add_settings_error('restaurant_messages', 'restaurant_message', __('Settings Saved', 'restaurant'), 'updated');
        }
        
        settings_errors('restaurant_messages');
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            <form action="options.php" method="post">
                <?php
                settings_fields('restaurant_theme_options');
                do_settings_sections('restaurant_theme_options');
                submit_button(__('Save Settings', 'restaurant'));
                ?>
            </form>
        </div>
        <?php
    }
    
    /**
     * Registrar rutas REST API
     */
    public function register_rest_routes() {
        register_rest_route('restaurant/v1', '/settings', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_theme_settings'),
            'permission_callback' => '__return_true'
        ));
    }
    
    /**
     * Obtener opciones del tema vía REST API
     */
    public function get_theme_settings() {
        $options = get_option('restaurant_theme_settings', array());
        
        return array(
            'logo' => isset($options['logo']) ? $options['logo'] : '/images/logo.svg',
            'address' => isset($options['address']) ? $options['address'] : '4517 Washington Ave, Kentucky 39495',
            'phone' => isset($options['phone']) ? $options['phone'] : '+01 780 859 632',
            'email' => isset($options['email']) ? $options['email'] : 'info@restaurant.com',
            'social_media' => array(
                'facebook' => isset($options['facebook']) ? $options['facebook'] : '#',
                'instagram' => isset($options['instagram']) ? $options['instagram'] : '#',
                'dribbble' => isset($options['dribbble']) ? $options['dribbble'] : '#'
            ),
            'copyright' => isset($options['copyright']) ? $options['copyright'] : 'Copyright © 2025 All Rights Reserved.'
        );
    }
}

// Inicializar plugin
new Restaurant_Theme_Config();

// Incluir campos de secciones de páginas
require_once plugin_dir_path(__FILE__) . 'includes/page-sections.php';

