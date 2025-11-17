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
            // También ejecutar en admin_init para asegurar que se creen los campos
            add_action('admin_init', array($this, 'create_field_groups'), 20);
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
        $home_page_id = $this->get_page_id_by_slug('home');
        
        // Usar acf_update_field_group para crear directamente en la base de datos
        // Esto permite que los campos funcionen con WPGraphQL
        $field_group = array(
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
                // Daily Offer Section
                array(
                    'key' => 'field_daily_offer_image',
                    'label' => 'Daily Offer Image',
                    'name' => 'daily_offer_image',
                    'type' => 'image',
                ),
                array(
                    'key' => 'field_daily_offer_subtitle',
                    'label' => 'Daily Offer Subtitle',
                    'name' => 'daily_offer_subtitle',
                    'type' => 'text',
                    'default_value' => 'our daily offers',
                ),
                array(
                    'key' => 'field_daily_offer_title',
                    'label' => 'Daily Offer Title',
                    'name' => 'daily_offer_title',
                    'type' => 'text',
                    'default_value' => 'taste the savings with our daily specials',
                ),
                array(
                    'key' => 'field_daily_offer_description',
                    'label' => 'Daily Offer Description',
                    'name' => 'daily_offer_description',
                    'type' => 'textarea',
                    'default_value' => 'Every day is an opportunity to enjoy your favorites at a discounted price. Explore our daily rotating specials and indulge in flavorful meals at a fraction of the cost.',
                ),
                array(
                    'key' => 'field_daily_offer_features',
                    'label' => 'Daily Offer Features',
                    'name' => 'daily_offer_features',
                    'type' => 'repeater',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_daily_offer_feature_text',
                            'label' => 'Feature Text',
                            'name' => 'feature_text',
                            'type' => 'text',
                        ),
                    ),
                ),
                array(
                    'key' => 'field_daily_offer_burger_title',
                    'label' => 'Daily Offer Burger Title',
                    'name' => 'daily_offer_burger_title',
                    'type' => 'text',
                    'default_value' => 'Delicious Burger',
                ),
                array(
                    'key' => 'field_daily_offer_burger_features',
                    'label' => 'Daily Offer Burger Features',
                    'name' => 'daily_offer_burger_features',
                    'type' => 'repeater',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_burger_feature_text',
                            'label' => 'Feature Text',
                            'name' => 'feature_text',
                            'type' => 'text',
                        ),
                    ),
                ),
                // Our Menu Section
                array(
                    'key' => 'field_menu_subtitle',
                    'label' => 'Menu Subtitle',
                    'name' => 'menu_subtitle',
                    'type' => 'text',
                    'default_value' => 'from our menu',
                ),
                array(
                    'key' => 'field_menu_title',
                    'label' => 'Menu Title',
                    'name' => 'menu_title',
                    'type' => 'text',
                    'default_value' => 'An Inspired Menu That Blends Tradition',
                ),
                // Intro Video Section
                array(
                    'key' => 'field_intro_video_bg',
                    'label' => 'Intro Video Background',
                    'name' => 'intro_video_bg',
                    'type' => 'file',
                    'return_format' => 'url',
                    'mime_types' => 'mp4,webm,ogg',
                ),
                array(
                    'key' => 'field_intro_video_url',
                    'label' => 'Intro Video URL (YouTube)',
                    'name' => 'intro_video_url',
                    'type' => 'url',
                    'default_value' => 'https://www.youtube.com/watch?v=Y-x0efG1seA',
                ),
                // Our Ingredients Section
                array(
                    'key' => 'field_ingredients_image',
                    'label' => 'Ingredients Image',
                    'name' => 'ingredients_image',
                    'type' => 'image',
                ),
                array(
                    'key' => 'field_ingredients_subtitle',
                    'label' => 'Ingredients Subtitle',
                    'name' => 'ingredients_subtitle',
                    'type' => 'text',
                    'default_value' => 'our ingredients',
                ),
                array(
                    'key' => 'field_ingredients_title',
                    'label' => 'Ingredients Title',
                    'name' => 'ingredients_title',
                    'type' => 'text',
                    'default_value' => 'Crafting Dishes with freshest Flavors',
                ),
                array(
                    'key' => 'field_ingredients_description',
                    'label' => 'Ingredients Description',
                    'name' => 'ingredients_description',
                    'type' => 'textarea',
                    'default_value' => 'We take pride in using only the freshest, hand-picked ingredients that are free from preservatives and artificial additives. Taste the difference with every bite as we serve dishes made from nature\'s finest.',
                ),
                array(
                    'key' => 'field_ingredients_features',
                    'label' => 'Ingredients Features',
                    'name' => 'ingredients_features',
                    'type' => 'repeater',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_ingredient_feature_icon',
                            'label' => 'Icon',
                            'name' => 'icon',
                            'type' => 'image',
                        ),
                        array(
                            'key' => 'field_ingredient_feature_title',
                            'label' => 'Title',
                            'name' => 'title',
                            'type' => 'text',
                        ),
                    ),
                ),
                array(
                    'key' => 'field_ingredients_happy_customers',
                    'label' => 'Happy Customers Count',
                    'name' => 'ingredients_happy_customers',
                    'type' => 'number',
                    'default_value' => 620,
                ),
                array(
                    'key' => 'field_ingredients_customer_images',
                    'label' => 'Customer Images',
                    'name' => 'ingredients_customer_images',
                    'type' => 'gallery',
                ),
                array(
                    'key' => 'field_ingredients_counters',
                    'label' => 'Ingredients Counters',
                    'name' => 'ingredients_counters',
                    'type' => 'repeater',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_counter_icon',
                            'label' => 'Icon',
                            'name' => 'icon',
                            'type' => 'image',
                        ),
                        array(
                            'key' => 'field_counter_number',
                            'label' => 'Number',
                            'name' => 'number',
                            'type' => 'number',
                        ),
                        array(
                            'key' => 'field_counter_label',
                            'label' => 'Label',
                            'name' => 'label',
                            'type' => 'text',
                        ),
                    ),
                ),
                // Our Testimonial Section
                array(
                    'key' => 'field_testimonial_subtitle',
                    'label' => 'Testimonial Subtitle',
                    'name' => 'testimonial_subtitle',
                    'type' => 'text',
                    'default_value' => 'our testimonials',
                ),
                array(
                    'key' => 'field_testimonial_title',
                    'label' => 'Testimonial Title',
                    'name' => 'testimonial_title',
                    'type' => 'text',
                    'default_value' => 'real stories of memorable meals and experiences',
                ),
                array(
                    'key' => 'field_testimonials',
                    'label' => 'Testimonials',
                    'name' => 'testimonials',
                    'type' => 'repeater',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_testimonial_content',
                            'label' => 'Content',
                            'name' => 'content',
                            'type' => 'textarea',
                        ),
                        array(
                            'key' => 'field_testimonial_author_name',
                            'label' => 'Author Name',
                            'name' => 'author_name',
                            'type' => 'text',
                        ),
                        array(
                            'key' => 'field_testimonial_author_image',
                            'label' => 'Author Image',
                            'name' => 'author_image',
                            'type' => 'image',
                        ),
                    ),
                ),
                // Reserve Table Section
                array(
                    'key' => 'field_reserve_subtitle',
                    'label' => 'Reserve Table Subtitle',
                    'name' => 'reserve_subtitle',
                    'type' => 'text',
                    'default_value' => 'reserve a table',
                ),
                array(
                    'key' => 'field_reserve_title',
                    'label' => 'Reserve Table Title',
                    'name' => 'reserve_title',
                    'type' => 'text',
                    'default_value' => 'reserve now your table and enjoy dining experience.',
                ),
                array(
                    'key' => 'field_reserve_hours',
                    'label' => 'Opening Hours',
                    'name' => 'reserve_hours',
                    'type' => 'repeater',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_hours_days',
                            'label' => 'Days',
                            'name' => 'days',
                            'type' => 'text',
                        ),
                        array(
                            'key' => 'field_hours_time',
                            'label' => 'Time',
                            'name' => 'time',
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
                        'value' => $home_page_id ?: 'page',
                    ),
                ),
            ),
        );
        
        if (function_exists('acf_update_field_group')) {
            acf_update_field_group($field_group);
        } else {
            acf_add_local_field_group($field_group);
        }
    }
    
    private function get_page_id_by_slug($slug) {
        $page = get_page_by_path($slug);
        return $page ? $page->ID : 0;
    }
    
    private function create_about_fields() {
        $about_page_id = $this->get_page_id_by_slug('about');
        
        $field_group = array(
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
        );
        
        if (function_exists('acf_update_field_group')) {
            acf_update_field_group($field_group);
        } else {
            acf_add_local_field_group($field_group);
        }
    }
    
    private function create_contact_fields() {
        $contact_page_id = $this->get_page_id_by_slug('contact');
        $field_group = array(
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
        );
        
        if (function_exists('acf_update_field_group')) {
            acf_update_field_group($field_group);
        } else {
            acf_add_local_field_group($field_group);
        }
    }
    
    private function create_services_fields() {
        $services_page_id = $this->get_page_id_by_slug('services');
        $field_group = array(
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
        );
        
        if (function_exists('acf_update_field_group')) {
            acf_update_field_group($field_group);
        } else {
            acf_add_local_field_group($field_group);
        }
    }
    
    private function create_menu_fields() {
        $menu_page_id = $this->get_page_id_by_slug('menu');
        $field_group = array(
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
        );
        
        if (function_exists('acf_update_field_group')) {
            acf_update_field_group($field_group);
        } else {
            acf_add_local_field_group($field_group);
        }
    }
}

// Inicializar solo si ACF está activo
if (function_exists('acf_add_local_field_group')) {
    new Restaurant_ACF_Fields_Creator();
}

