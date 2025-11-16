<?php
/**
 * Campos personalizados para secciones de páginas
 */

// Prevenir acceso directo
if (!defined('ABSPATH')) {
    exit;
}

class Restaurant_Page_Sections {
    
    public function __construct() {
        // Agregar meta boxes para páginas
        add_action('add_meta_boxes', array($this, 'add_page_section_meta_boxes'));
        add_action('save_post', array($this, 'save_page_sections'));
        
        // Agregar scripts y estilos
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
    }
    
    /**
     * Agregar meta boxes según el slug de la página
     */
    public function add_page_section_meta_boxes() {
        global $post;
        
        if (!$post) {
            return;
        }
        
        $slug = $post->post_name;
        
        // Meta box para página Home
        if ($slug === 'home' || $post->ID === get_option('page_on_front')) {
            add_meta_box(
                'restaurant_home_sections',
                __('Home Page Sections', 'restaurant'),
                array($this, 'render_home_sections'),
                'page',
                'normal',
                'high'
            );
        }
        
        // Meta box para página About
        if ($slug === 'about') {
            add_meta_box(
                'restaurant_about_sections',
                __('About Page Sections', 'restaurant'),
                array($this, 'render_about_sections'),
                'page',
                'normal',
                'high'
            );
        }
        
        // Meta box para página Contact
        if ($slug === 'contact') {
            add_meta_box(
                'restaurant_contact_sections',
                __('Contact Page Sections', 'restaurant'),
                array($this, 'render_contact_sections'),
                'page',
                'normal',
                'high'
            );
        }
        
        // Meta box para página Services
        if ($slug === 'services') {
            add_meta_box(
                'restaurant_services_sections',
                __('Services Page Sections', 'restaurant'),
                array($this, 'render_services_sections'),
                'page',
                'normal',
                'high'
            );
        }
        
        // Meta box para página Menu
        if ($slug === 'menu') {
            add_meta_box(
                'restaurant_menu_sections',
                __('Menu Page Sections', 'restaurant'),
                array($this, 'render_menu_sections'),
                'page',
                'normal',
                'high'
            );
        }
    }
    
    /**
     * Renderizar secciones de Home
     */
    public function render_home_sections($post) {
        wp_nonce_field('restaurant_save_sections', 'restaurant_sections_nonce');
        
        // Leer datos guardados o usar valores por defecto
        $hero_meta = get_post_meta($post->ID, '_restaurant_hero_section', true);
        $about_meta = get_post_meta($post->ID, '_restaurant_about_section', true);
        $dishes_meta = get_post_meta($post->ID, '_restaurant_dishes_section', true);
        
        // Si no hay datos guardados, intentar leer campos individuales
        $hero = $hero_meta ?: array(
            'subtitle' => get_post_meta($post->ID, 'heroSubtitle', true) ?: 'art of fine dining',
            'title' => get_post_meta($post->ID, 'heroTitle', true) ?: 'Dining redefined with every bite',
            'description' => get_post_meta($post->ID, 'heroDescription', true) ?: '',
            'main_image' => get_post_meta($post->ID, 'heroMainImage', true) ?: '/images/hero-img.jpg'
        );
        
        $about = $about_meta ?: array(
            'subtitle' => get_post_meta($post->ID, 'aboutSubtitle', true) ?: 'about us',
            'title' => get_post_meta($post->ID, 'aboutTitle', true) ?: 'Our Commitment to Authenticity & excellence',
            'description' => get_post_meta($post->ID, 'aboutDescription', true) ?: ''
        );
        
        $dishes = $dishes_meta ?: array(
            'subtitle' => get_post_meta($post->ID, 'dishesSubtitle', true) ?: 'our main dishes',
            'title' => get_post_meta($post->ID, 'dishesTitle', true) ?: 'Satisfy your cravings with our signature mains'
        );
        
        include plugin_dir_path(__FILE__) . '../templates/home-sections.php';
    }
    
    /**
     * Renderizar secciones de About
     */
    public function render_about_sections($post) {
        wp_nonce_field('restaurant_save_sections', 'restaurant_sections_nonce');
        
        $about_content = get_post_meta($post->ID, '_restaurant_about_content_section', true);
        $about_details = get_post_meta($post->ID, '_restaurant_about_details', true);
        $approach = get_post_meta($post->ID, '_restaurant_approach_section', true);
        
        include plugin_dir_path(__FILE__) . '../templates/about-sections.php';
    }
    
    /**
     * Renderizar secciones de Contact
     */
    public function render_contact_sections($post) {
        wp_nonce_field('restaurant_save_sections', 'restaurant_sections_nonce');
        
        $contact = get_post_meta($post->ID, '_restaurant_contact_section', true);
        $map = get_post_meta($post->ID, '_restaurant_map_section', true);
        
        include plugin_dir_path(__FILE__) . '../templates/contact-sections.php';
    }
    
    /**
     * Renderizar secciones de Services
     */
    public function render_services_sections($post) {
        wp_nonce_field('restaurant_save_sections', 'restaurant_sections_nonce');
        
        // Leer datos guardados o usar valores por defecto
        $services_meta = get_post_meta($post->ID, '_restaurant_services_section', true);
        
        // Si no hay datos guardados, intentar leer campos individuales
        $services = $services_meta ?: array(
            'subtitle' => get_post_meta($post->ID, 'servicesSubtitle', true) ?: 'our services',
            'title' => get_post_meta($post->ID, 'servicesTitle', true) ?: 'What we offer',
            'description' => get_post_meta($post->ID, 'servicesDescription', true) ?: 'We provide exceptional dining experiences with a range of services designed to make your visit memorable.'
        );
        
        include plugin_dir_path(__FILE__) . '../templates/services-sections.php';
    }
    
    /**
     * Renderizar secciones de Menu
     */
    public function render_menu_sections($post) {
        wp_nonce_field('restaurant_save_sections', 'restaurant_sections_nonce');
        
        $menu = get_post_meta($post->ID, '_restaurant_menu_section', true);
        
        include plugin_dir_path(__FILE__) . '../templates/menu-sections.php';
    }
    
    /**
     * Guardar secciones
     */
    public function save_page_sections($post_id) {
        // Verificar nonce
        if (!isset($_POST['restaurant_sections_nonce']) || 
            !wp_verify_nonce($_POST['restaurant_sections_nonce'], 'restaurant_save_sections')) {
            return;
        }
        
        // Verificar permisos
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
        
        // Guardar secciones según el tipo de página
        $slug = get_post_field('post_name', $post_id);
        
        // Home
        if ($slug === 'home' || $post_id === get_option('page_on_front')) {
            // Guardar Hero Section
            if (isset($_POST['restaurant_hero_section'])) {
                $hero = $_POST['restaurant_hero_section'];
                update_post_meta($post_id, '_restaurant_hero_section', $hero);
                // Guardar campos individuales para ACF
                if (is_array($hero)) {
                    update_post_meta($post_id, 'heroSubtitle', $hero['subtitle'] ?? '');
                    update_post_meta($post_id, 'heroTitle', $hero['title'] ?? '');
                    update_post_meta($post_id, 'heroDescription', $hero['description'] ?? '');
                    update_post_meta($post_id, 'heroMainImage', $hero['main_image'] ?? '');
                }
            }
            // Guardar About Section
            if (isset($_POST['restaurant_about_section'])) {
                $about = $_POST['restaurant_about_section'];
                update_post_meta($post_id, '_restaurant_about_section', $about);
                // Guardar campos individuales para ACF
                if (is_array($about)) {
                    update_post_meta($post_id, 'aboutSubtitle', $about['subtitle'] ?? '');
                    update_post_meta($post_id, 'aboutTitle', $about['title'] ?? '');
                    update_post_meta($post_id, 'aboutDescription', $about['description'] ?? '');
                }
            }
            // Guardar Dishes Section
            if (isset($_POST['restaurant_dishes_section'])) {
                $dishes = $_POST['restaurant_dishes_section'];
                update_post_meta($post_id, '_restaurant_dishes_section', $dishes);
                // Guardar campos individuales para ACF
                if (is_array($dishes)) {
                    update_post_meta($post_id, 'dishesSubtitle', $dishes['subtitle'] ?? '');
                    update_post_meta($post_id, 'dishesTitle', $dishes['title'] ?? '');
                }
            }
        }
        
        // About
        if ($slug === 'about') {
            if (isset($_POST['restaurant_about_content_section'])) {
                update_post_meta($post_id, '_restaurant_about_content_section', $_POST['restaurant_about_content_section']);
            }
            if (isset($_POST['restaurant_about_details'])) {
                update_post_meta($post_id, '_restaurant_about_details', $_POST['restaurant_about_details']);
            }
            if (isset($_POST['restaurant_approach_section'])) {
                update_post_meta($post_id, '_restaurant_approach_section', $_POST['restaurant_approach_section']);
            }
        }
        
        // Contact
        if ($slug === 'contact') {
            if (isset($_POST['restaurant_contact_section'])) {
                update_post_meta($post_id, '_restaurant_contact_section', $_POST['restaurant_contact_section']);
            }
            if (isset($_POST['restaurant_map_section'])) {
                update_post_meta($post_id, '_restaurant_map_section', $_POST['restaurant_map_section']);
            }
        }
        
        // Services
        if ($slug === 'services') {
            if (isset($_POST['restaurant_services_section'])) {
                $services = $_POST['restaurant_services_section'];
                update_post_meta($post_id, '_restaurant_services_section', $services);
                // Guardar campos individuales para ACF
                if (is_array($services)) {
                    update_post_meta($post_id, 'servicesSubtitle', $services['subtitle'] ?? '');
                    update_post_meta($post_id, 'servicesTitle', $services['title'] ?? '');
                    update_post_meta($post_id, 'servicesDescription', $services['description'] ?? '');
                }
            }
        }
        
        // Menu
        if ($slug === 'menu') {
            if (isset($_POST['restaurant_menu_section'])) {
                update_post_meta($post_id, '_restaurant_menu_section', $_POST['restaurant_menu_section']);
            }
        }
    }
    
    /**
     * Enqueue scripts y estilos del admin
     */
    public function enqueue_admin_scripts($hook) {
        if ($hook !== 'post.php' && $hook !== 'post-new.php') {
            return;
        }
        
        wp_enqueue_media();
        wp_enqueue_script('jquery-ui-sortable');
        
        wp_add_inline_script('jquery', '
            jQuery(document).ready(function($) {
                // Uploader de imágenes
                $(".restaurant-upload-image").on("click", function(e) {
                    e.preventDefault();
                    var button = $(this);
                    var input = button.siblings("input[type=\'hidden\']");
                    
                    var mediaUploader = wp.media({
                        title: "Seleccionar imagen",
                        button: { text: "Usar esta imagen" },
                        multiple: false
                    });
                    
                    mediaUploader.on("select", function() {
                        var attachment = mediaUploader.state().get("selection").first().toJSON();
                        input.val(attachment.url);
                        if (button.siblings("img").length) {
                            button.siblings("img").attr("src", attachment.url);
                        } else {
                            button.after(\'<img src="\' + attachment.url + \'" style="max-width: 200px; display: block; margin-top: 10px;" />\');
                        }
                    });
                    
                    mediaUploader.open();
                });
                
                // Agregar item repetible
                $(".restaurant-add-item").on("click", function(e) {
                    e.preventDefault();
                    var template = $(this).data("template");
                    var container = $(this).siblings(".restaurant-items-container");
                    var newItem = $(template).clone();
                    newItem.find("input, textarea").val("");
                    container.append(newItem);
                });
                
                // Eliminar item
                $(document).on("click", ".restaurant-remove-item", function(e) {
                    e.preventDefault();
                    $(this).closest(".restaurant-item").remove();
                });
                
                // Sortable
                $(".restaurant-items-container").sortable({
                    handle: ".restaurant-sort-handle",
                    placeholder: "restaurant-sort-placeholder"
                });
            });
        ');
    }
}

// Inicializar
new Restaurant_Page_Sections();

