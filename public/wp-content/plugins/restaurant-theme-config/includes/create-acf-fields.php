<?php
/**
 * Script para crear grupos de campos ACF programáticamente
 * Ejecutar una vez desde el admin de WordPress o via WP-CLI
 */

// Prevenir acceso directo
if (!defined('ABSPATH')) {
    exit;
}

class Restaurant_ACF_Fields_Creator {
    
    public function __construct() {
        // Solo ejecutar si ACF está activo
        if (function_exists('acf_add_local_field_group')) {
            add_action('acf/init', array($this, 'create_field_groups'));
        }
    }
    
    public function create_field_groups() {
        $this->create_home_fields();
        $this->create_about_fields();
        $this->create_contact_fields();
        $this->create_services_fields();
        $this->create_menu_fields();
    }
    
    private function create_home_fields() {
        acf_add_local_field_group(array(
            'key' => 'group_home_page',
            'title' => 'Home Page Sections',
            'fields' => array(
                // Hero Section
                array(
                    'key' => 'field_hero_subtitle',
                    'label' => 'Hero Subtitle',
                    'name' => 'hero_subtitle',
                    'type' => 'text',
                    'default_value' => 'art of fine dining',
                ),
                array(
                    'key' => 'field_hero_title',
                    'label' => 'Hero Title',
                    'name' => 'hero_title',
                    'type' => 'text',
                    'default_value' => 'Dining redefined with every bite',
                ),
                array(
                    'key' => 'field_hero_description',
                    'label' => 'Hero Description',
                    'name' => 'hero_description',
                    'type' => 'textarea',
                    'default_value' => 'Immerse yourself in a dining experience like no other, where every dish is a masterpiece of flavor, crafted with care and precision.',
                ),
                array(
                    'key' => 'field_hero_main_image',
                    'label' => 'Hero Main Image',
                    'name' => 'hero_main_image',
                    'type' => 'image',
                ),
                // About Section
                array(
                    'key' => 'field_about_subtitle',
                    'label' => 'About Subtitle',
                    'name' => 'about_subtitle',
                    'type' => 'text',
                    'default_value' => 'about us',
                ),
                array(
                    'key' => 'field_about_title',
                    'label' => 'About Title',
                    'name' => 'about_title',
                    'type' => 'text',
                    'default_value' => 'Our Commitment to Authenticity & excellence',
                ),
                array(
                    'key' => 'field_about_description',
                    'label' => 'About Description',
                    'name' => 'about_description',
                    'type' => 'textarea',
                ),
                // Dishes Section
                array(
                    'key' => 'field_dishes_subtitle',
                    'label' => 'Dishes Subtitle',
                    'name' => 'dishes_subtitle',
                    'type' => 'text',
                    'default_value' => 'our dishes',
                ),
                array(
                    'key' => 'field_dishes_title',
                    'label' => 'Dishes Title',
                    'name' => 'dishes_title',
                    'type' => 'text',
                    'default_value' => 'Explore our signature dishes',
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'page_type',
                        'operator' => '==',
                        'value' => 'front_page',
                    ),
                ),
            ),
        ));
    }
    
    private function get_page_id_by_slug($slug) {
        $page = get_page_by_path($slug);
        return $page ? $page->ID : 0;
    }
    
    private function create_about_fields() {
        $about_page_id = $this->get_page_id_by_slug('about');
        
        acf_add_local_field_group(array(
            'key' => 'group_about_page',
            'title' => 'About Page Sections',
            'fields' => array(
                // About Content Section
                array(
                    'key' => 'field_about_content_subtitle',
                    'label' => 'Subtitle',
                    'name' => 'about_content_subtitle',
                    'type' => 'text',
                    'default_value' => 'about us',
                ),
                array(
                    'key' => 'field_about_content_title',
                    'label' => 'Title',
                    'name' => 'about_content_title',
                    'type' => 'text',
                    'default_value' => 'Our Commitment to Authenticity & excellence',
                ),
                array(
                    'key' => 'field_about_content_description',
                    'label' => 'Description',
                    'name' => 'about_content_description',
                    'type' => 'textarea',
                ),
                array(
                    'key' => 'field_about_features',
                    'label' => 'Features',
                    'name' => 'about_features',
                    'type' => 'repeater',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_feature_text',
                            'label' => 'Feature Text',
                            'name' => 'feature_text',
                            'type' => 'text',
                        ),
                    ),
                ),
                array(
                    'key' => 'field_about_main_image',
                    'label' => 'Main Image',
                    'name' => 'about_main_image',
                    'type' => 'image',
                ),
                array(
                    'key' => 'field_about_secondary_image',
                    'label' => 'Secondary Image',
                    'name' => 'about_secondary_image',
                    'type' => 'image',
                ),
                array(
                    'key' => 'field_experience_years',
                    'label' => 'Experience Years',
                    'name' => 'experience_years',
                    'type' => 'number',
                    'default_value' => 30,
                ),
                array(
                    'key' => 'field_experience_text',
                    'label' => 'Experience Text',
                    'name' => 'experience_text',
                    'type' => 'text',
                    'default_value' => '+ years of experience',
                ),
                // About Details
                array(
                    'key' => 'field_about_details',
                    'label' => 'About Details',
                    'name' => 'about_details',
                    'type' => 'repeater',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_detail_icon',
                            'label' => 'Icon',
                            'name' => 'icon',
                            'type' => 'image',
                        ),
                        array(
                            'key' => 'field_detail_title',
                            'label' => 'Title',
                            'name' => 'title',
                            'type' => 'text',
                        ),
                        array(
                            'key' => 'field_detail_description',
                            'label' => 'Description',
                            'name' => 'description',
                            'type' => 'textarea',
                        ),
                    ),
                ),
                // Approach Section
                array(
                    'key' => 'field_mission_title',
                    'label' => 'Mission Title',
                    'name' => 'mission_title',
                    'type' => 'text',
                    'default_value' => 'our mission',
                ),
                array(
                    'key' => 'field_mission_heading',
                    'label' => 'Mission Heading',
                    'name' => 'mission_heading',
                    'type' => 'text',
                    'default_value' => 'creating moments around flavor',
                ),
                array(
                    'key' => 'field_mission_content',
                    'label' => 'Mission Content',
                    'name' => 'mission_content',
                    'type' => 'wysiwyg',
                ),
                array(
                    'key' => 'field_mission_image',
                    'label' => 'Mission Image',
                    'name' => 'mission_image',
                    'type' => 'image',
                ),
                array(
                    'key' => 'field_vision_title',
                    'label' => 'Vision Title',
                    'name' => 'vision_title',
                    'type' => 'text',
                    'default_value' => 'our vision',
                ),
                array(
                    'key' => 'field_vision_heading',
                    'label' => 'Vision Heading',
                    'name' => 'vision_heading',
                    'type' => 'text',
                    'default_value' => 'shaping the future of dining',
                ),
                array(
                    'key' => 'field_vision_content',
                    'label' => 'Vision Content',
                    'name' => 'vision_content',
                    'type' => 'wysiwyg',
                ),
                array(
                    'key' => 'field_vision_image',
                    'label' => 'Vision Image',
                    'name' => 'vision_image',
                    'type' => 'image',
                ),
                array(
                    'key' => 'field_value_title',
                    'label' => 'Value Title',
                    'name' => 'value_title',
                    'type' => 'text',
                    'default_value' => 'our value',
                ),
                array(
                    'key' => 'field_value_heading',
                    'label' => 'Value Heading',
                    'name' => 'value_heading',
                    'type' => 'text',
                    'default_value' => 'what drives us forward',
                ),
                array(
                    'key' => 'field_value_content',
                    'label' => 'Value Content',
                    'name' => 'value_content',
                    'type' => 'wysiwyg',
                ),
                array(
                    'key' => 'field_value_image',
                    'label' => 'Value Image',
                    'name' => 'value_image',
                    'type' => 'image',
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'page',
                        'operator' => '==',
                        'value' => $about_page_id ?: 'page',
                    ),
                ),
            ),
        ));
    }
    
    private function create_contact_fields() {
        $contact_page_id = $this->get_page_id_by_slug('contact');
        acf_add_local_field_group(array(
            'key' => 'group_contact_page',
            'title' => 'Contact Page Sections',
            'fields' => array(
                array(
                    'key' => 'field_contact_subtitle',
                    'label' => 'Subtitle',
                    'name' => 'contact_subtitle',
                    'type' => 'text',
                    'default_value' => 'contact us',
                ),
                array(
                    'key' => 'field_contact_title',
                    'label' => 'Title',
                    'name' => 'contact_title',
                    'type' => 'text',
                    'default_value' => 'Get in touch with us',
                ),
                array(
                    'key' => 'field_contact_description',
                    'label' => 'Description',
                    'name' => 'contact_description',
                    'type' => 'textarea',
                ),
                array(
                    'key' => 'field_map_embed',
                    'label' => 'Map Embed Code',
                    'name' => 'map_embed',
                    'type' => 'textarea',
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'page',
                        'operator' => '==',
                        'value' => $contact_page_id ?: 'page',
                    ),
                ),
            ),
        ));
    }
    
    private function create_services_fields() {
        $services_page_id = $this->get_page_id_by_slug('services');
        acf_add_local_field_group(array(
            'key' => 'group_services_page',
            'title' => 'Services Page Sections',
            'fields' => array(
                array(
                    'key' => 'field_services_subtitle',
                    'label' => 'Subtitle',
                    'name' => 'services_subtitle',
                    'type' => 'text',
                    'default_value' => 'our services',
                ),
                array(
                    'key' => 'field_services_title',
                    'label' => 'Title',
                    'name' => 'services_title',
                    'type' => 'text',
                    'default_value' => 'What we offer',
                ),
                array(
                    'key' => 'field_services_description',
                    'label' => 'Description',
                    'name' => 'services_description',
                    'type' => 'textarea',
                ),
                array(
                    'key' => 'field_services_items',
                    'label' => 'Services',
                    'name' => 'services_items',
                    'type' => 'repeater',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_service_icon',
                            'label' => 'Icon',
                            'name' => 'icon',
                            'type' => 'image',
                        ),
                        array(
                            'key' => 'field_service_title',
                            'label' => 'Title',
                            'name' => 'title',
                            'type' => 'text',
                        ),
                        array(
                            'key' => 'field_service_description',
                            'label' => 'Description',
                            'name' => 'description',
                            'type' => 'textarea',
                        ),
                        array(
                            'key' => 'field_service_link',
                            'label' => 'Link',
                            'name' => 'link',
                            'type' => 'text',
                        ),
                    ),
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'page',
                        'operator' => '==',
                        'value' => $services_page_id ?: 'page',
                    ),
                ),
            ),
        ));
    }
    
    private function create_menu_fields() {
        $menu_page_id = $this->get_page_id_by_slug('menu');
        acf_add_local_field_group(array(
            'key' => 'group_menu_page',
            'title' => 'Menu Page Sections',
            'fields' => array(
                array(
                    'key' => 'field_menu_subtitle',
                    'label' => 'Subtitle',
                    'name' => 'menu_subtitle',
                    'type' => 'text',
                    'default_value' => 'taste the best that surprise you',
                ),
                array(
                    'key' => 'field_menu_title',
                    'label' => 'Title',
                    'name' => 'menu_title',
                    'type' => 'text',
                    'default_value' => 'our special menu',
                ),
                array(
                    'key' => 'field_menu_description',
                    'label' => 'Description',
                    'name' => 'menu_description',
                    'type' => 'textarea',
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'page',
                        'operator' => '==',
                        'value' => $menu_page_id ?: 'page',
                    ),
                ),
            ),
        ));
    }
}

// Inicializar solo si ACF está activo
if (function_exists('acf_add_local_field_group')) {
    new Restaurant_ACF_Fields_Creator();
}

