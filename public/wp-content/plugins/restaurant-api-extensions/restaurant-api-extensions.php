<?php
/**
 * Plugin Name: Restaurant API Extensions
 * Description: Extiende la API REST y GraphQL de WordPress para exponer datos adicionales necesarios para el frontend (logo, body classes, widgets, theme mods, etc.)
 * Version: 1.0.0
 * Author: Restaurant Team
 */

if (!defined('ABSPATH')) {
    exit;
}

class Restaurant_API_Extensions {
    
    public function __construct() {
        // REST API Routes
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        
        // GraphQL Extensions (si WPGraphQL está activo)
        add_action('graphql_register_types', array($this, 'register_graphql_types'));
    }
    
    /**
     * Registrar rutas REST API personalizadas
     */
    public function register_rest_routes() {
        // Endpoint para obtener información completa del sitio
        register_rest_route('restaurant/v1', '/site-info', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_site_info'),
            'permission_callback' => '__return_true', // Público
        ));
        
        // Endpoint para obtener body classes
        register_rest_route('restaurant/v1', '/body-classes', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_body_classes'),
            'permission_callback' => '__return_true',
            'args' => array(
                'post_id' => array(
                    'default' => 0,
                    'sanitize_callback' => 'absint',
                ),
                'post_type' => array(
                    'default' => 'page',
                    'sanitize_callback' => 'sanitize_text_field',
                ),
                'slug' => array(
                    'default' => '',
                    'sanitize_callback' => 'sanitize_text_field',
                ),
            ),
        ));
        
        // Endpoint para obtener theme mods (logo, etc.)
        register_rest_route('restaurant/v1', '/theme-mods', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_theme_mods'),
            'permission_callback' => '__return_true',
        ));
        
        // Endpoint para obtener widgets y sidebars
        register_rest_route('restaurant/v1', '/widgets', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_widgets'),
            'permission_callback' => '__return_true',
            'args' => array(
                'sidebar' => array(
                    'default' => '',
                    'sanitize_callback' => 'sanitize_text_field',
                ),
            ),
        ));
        
        // Endpoint para obtener opciones de WordPress
        register_rest_route('restaurant/v1', '/options', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_options'),
            'permission_callback' => '__return_true',
            'args' => array(
                'keys' => array(
                    'default' => array(),
                    'sanitize_callback' => function($param) {
                        if (is_string($param)) {
                            return explode(',', $param);
                        }
                        return is_array($param) ? $param : array();
                    },
                ),
            ),
        ));
        
        // Endpoint para obtener settings del sitio (combina ACF Options + WordPress settings)
        register_rest_route('restaurant/v1', '/settings', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_site_settings'),
            'permission_callback' => '__return_true',
        ));
    }
    
    /**
     * Obtener información completa del sitio
     */
    public function get_site_info($request) {
        $site_info = array(
            'name' => get_bloginfo('name'),
            'description' => get_bloginfo('description'),
            'url' => home_url(),
            'admin_email' => get_option('admin_email'),
            'language' => get_locale(),
            'charset' => get_bloginfo('charset'),
            'timezone' => wp_timezone_string(),
            'date_format' => get_option('date_format'),
            'time_format' => get_option('time_format'),
            'start_of_week' => get_option('start_of_week'),
            'posts_per_page' => get_option('posts_per_page'),
            'theme' => array(
                'name' => wp_get_theme()->get('Name'),
                'version' => wp_get_theme()->get('Version'),
                'template' => get_template(),
                'stylesheet' => get_stylesheet(),
            ),
        );
        
        return rest_ensure_response($site_info);
    }
    
    /**
     * Obtener body classes para una página específica
     */
    public function get_body_classes($request) {
        $post_id = $request->get_param('post_id');
        $post_type = $request->get_param('post_type');
        $slug = $request->get_param('slug');
        
        // Si se proporciona un slug, obtener el post
        if (!empty($slug) && empty($post_id)) {
            $post = get_page_by_path($slug, OBJECT, $post_type);
            if ($post) {
                $post_id = $post->ID;
            }
        }
        
        // Simular el contexto de WordPress para obtener body classes
        global $wp_query, $post;
        
        // Guardar estado actual
        $original_post = $post;
        $original_query = $wp_query;
        
        // Establecer el post si se proporcionó
        if ($post_id) {
            $post = get_post($post_id);
            setup_postdata($post);
        }
        
        // Obtener body classes usando la función de WordPress
        $body_classes = get_body_class();
        
        // Restaurar estado original
        wp_reset_postdata();
        $post = $original_post;
        $wp_query = $original_query;
        
        return rest_ensure_response(array(
            'classes' => $body_classes,
            'classes_string' => implode(' ', $body_classes),
            'post_id' => $post_id,
            'post_type' => $post_type,
            'slug' => $slug,
        ));
    }
    
    /**
     * Obtener theme mods (logo, etc.)
     */
    public function get_theme_mods($request) {
        $theme_mods = array(
            'custom_logo' => get_theme_mod('custom_logo'),
            'custom_logo_url' => '',
            'custom_logo_data' => null,
        );
        
        // Obtener URL del logo si existe
        if ($theme_mods['custom_logo']) {
            $logo_url = wp_get_attachment_image_url($theme_mods['custom_logo'], 'full');
            $theme_mods['custom_logo_url'] = $logo_url;
            
            // Obtener datos completos del logo
            $logo_data = wp_get_attachment_image_src($theme_mods['custom_logo'], 'full');
            if ($logo_data) {
                $theme_mods['custom_logo_data'] = array(
                    'url' => $logo_data[0],
                    'width' => $logo_data[1],
                    'height' => $logo_data[2],
                    'alt' => get_post_meta($theme_mods['custom_logo'], '_wp_attachment_image_alt', true),
                    'title' => get_the_title($theme_mods['custom_logo']),
                );
            }
        }
        
        // Obtener otros theme mods comunes
        $common_mods = array(
            'header_textcolor',
            'background_color',
            'background_image',
            'background_repeat',
            'background_position_x',
            'background_position_y',
            'background_attachment',
            'background_size',
        );
        
        foreach ($common_mods as $mod) {
            $value = get_theme_mod($mod);
            if ($value !== false) {
                $theme_mods[$mod] = $value;
            }
        }
        
        return rest_ensure_response($theme_mods);
    }
    
    /**
     * Obtener widgets y sidebars
     */
    public function get_widgets($request) {
        $sidebar_id = $request->get_param('sidebar');
        
        // Obtener todos los sidebars registrados
        global $wp_registered_sidebars;
        $sidebars = array();
        
        if (!empty($wp_registered_sidebars)) {
            foreach ($wp_registered_sidebars as $id => $sidebar) {
                if (!empty($sidebar_id) && $id !== $sidebar_id) {
                    continue;
                }
                
                $sidebar_data = array(
                    'id' => $id,
                    'name' => $sidebar['name'],
                    'description' => isset($sidebar['description']) ? $sidebar['description'] : '',
                    'widgets' => array(),
                );
                
                // Obtener widgets de este sidebar
                $widgets = wp_get_sidebars_widgets();
                if (isset($widgets[$id]) && is_array($widgets[$id])) {
                    foreach ($widgets[$id] as $widget_id) {
                        $widget_data = $this->get_widget_data($widget_id);
                        if ($widget_data) {
                            $sidebar_data['widgets'][] = $widget_data;
                        }
                    }
                }
                
                $sidebars[] = $sidebar_data;
            }
        }
        
        return rest_ensure_response(array(
            'sidebars' => $sidebars,
            'total' => count($sidebars),
        ));
    }
    
    /**
     * Obtener datos de un widget específico
     */
    private function get_widget_data($widget_id) {
        global $wp_registered_widgets;
        
        if (!isset($wp_registered_widgets[$widget_id])) {
            return null;
        }
        
        $widget = $wp_registered_widgets[$widget_id];
        $widget_data = array(
            'id' => $widget_id,
            'classname' => isset($widget['classname']) ? $widget['classname'] : '',
            'name' => isset($widget['name']) ? $widget['name'] : '',
            'description' => isset($widget['description']) ? $widget['description'] : '',
        );
        
        // Obtener opciones del widget si están disponibles
        $widget_options = get_option('widget_' . $widget['callback'][0]->id_base);
        if ($widget_options) {
            // Extraer el número del widget ID
            preg_match('/-(\d+)$/', $widget_id, $matches);
            if (isset($matches[1])) {
                $widget_number = $matches[1];
                if (isset($widget_options[$widget_number])) {
                    $widget_data['options'] = $widget_options[$widget_number];
                }
            }
        }
        
        return $widget_data;
    }
    
    /**
     * Obtener settings del sitio (combina ACF Options + WordPress settings)
     * Esto reemplaza los valores hardcodeados con datos reales de WordPress
     */
    public function get_site_settings($request) {
        $settings = array();
        
        // Intentar obtener desde ACF Options primero (si existe)
        if (function_exists('get_field')) {
            // Campos comunes que podrían estar en ACF Options
            $acf_fields = array(
                'address' => get_field('address', 'option'),
                'phone' => get_field('phone', 'option'),
                'email' => get_field('email', 'option'),
                'social_media' => array(
                    'facebook' => get_field('facebook_url', 'option') ?: get_field('social_facebook', 'option'),
                    'instagram' => get_field('instagram_url', 'option') ?: get_field('social_instagram', 'option'),
                    'dribbble' => get_field('dribbble_url', 'option') ?: get_field('social_dribbble', 'option'),
                ),
                'copyright' => get_field('copyright', 'option'),
            );
            
            // Solo agregar campos que tienen valores
            foreach ($acf_fields as $key => $value) {
                if (!empty($value)) {
                    if ($key === 'social_media') {
                        // Filtrar valores vacíos de social_media
                        $social_media = array_filter($value);
                        if (!empty($social_media)) {
                            $settings[$key] = $social_media;
                        }
                    } else {
                        $settings[$key] = $value;
                    }
                }
            }
        }
        
        // Si no hay datos de ACF, intentar desde WordPress options
        if (empty($settings)) {
            // Usar datos de WordPress como fallback
            $settings['email'] = get_option('admin_email');
        }
        
        return rest_ensure_response($settings);
    }
    
    /**
     * Obtener opciones de WordPress
     */
    public function get_options($request) {
        $keys = $request->get_param('keys');
        
        // Si no se especifican keys, retornar opciones comunes
        if (empty($keys)) {
            $keys = array(
                'siteurl',
                'home',
                'blogname',
                'blogdescription',
                'admin_email',
                'start_of_week',
                'use_balanceTags',
                'default_category',
                'default_post_format',
                'posts_per_page',
                'date_format',
                'time_format',
                'gmt_offset',
                'timezone_string',
                'WPLANG',
                'users_can_register',
                'default_role',
            );
        }
        
        $options = array();
        foreach ($keys as $key) {
            $key = sanitize_text_field($key);
            $value = get_option($key);
            if ($value !== false) {
                $options[$key] = $value;
            }
        }
        
        return rest_ensure_response($options);
    }
    
    /**
     * Registrar tipos GraphQL personalizados
     */
    public function register_graphql_types() {
        // Extender el tipo SiteInfo si existe
        if (function_exists('register_graphql_field')) {
            // Agregar campos al tipo GeneralSettings
            register_graphql_field('GeneralSettings', 'customLogo', array(
                'type' => 'String',
                'description' => 'URL del logo personalizado',
                'resolve' => function() {
                    $logo_id = get_theme_mod('custom_logo');
                    if ($logo_id) {
                        return wp_get_attachment_image_url($logo_id, 'full');
                    }
                    return null;
                },
            ));
            
            register_graphql_field('GeneralSettings', 'bodyClasses', array(
                'type' => array('list_of' => 'String'),
                'description' => 'Clases CSS del body',
                'args' => array(
                    'postId' => array(
                        'type' => 'Int',
                        'description' => 'ID del post para obtener body classes',
                    ),
                    'slug' => array(
                        'type' => 'String',
                        'description' => 'Slug del post para obtener body classes',
                    ),
                ),
                'resolve' => function($source, $args) {
                    $post_id = isset($args['postId']) ? $args['postId'] : 0;
                    $slug = isset($args['slug']) ? $args['slug'] : '';
                    
                    if (!empty($slug) && empty($post_id)) {
                        $post = get_page_by_path($slug);
                        if ($post) {
                            $post_id = $post->ID;
                        }
                    }
                    
                    global $wp_query, $post;
                    $original_post = $post;
                    if ($post_id) {
                        $post = get_post($post_id);
                        setup_postdata($post);
                    }
                    
                    $classes = get_body_class();
                    wp_reset_postdata();
                    $post = $original_post;
                    
                    return $classes;
                },
            ));
        }
    }
}

// Inicializar el plugin
new Restaurant_API_Extensions();

