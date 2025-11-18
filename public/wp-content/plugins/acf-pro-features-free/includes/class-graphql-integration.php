<?php
/**
 * Integración con GraphQL
 * 
 * Expone los campos personalizados en GraphQL
 */

if (!defined('ABSPATH')) {
    exit;
}

class ACF_Pro_Features_GraphQL_Integration {
    
    public function __construct() {
        // Solo si WPGraphQL está activo
        if (!class_exists('WPGraphQL')) {
            return;
        }
        
        // Registrar campos en GraphQL
        add_action('graphql_register_types', array($this, 'register_graphql_fields'));
        
        // Registrar campos ACF en GraphQL si wp-graphql-acf está activo
        add_filter('acf/format_value', array($this, 'format_value_for_graphql'), 10, 3);
    }
    
    /**
     * Registrar campos en GraphQL
     */
    public function register_graphql_fields() {
        // Registrar campos repeater
        $this->register_repeater_fields();
        
        // Registrar campos flexible content
        $this->register_flexible_content_fields();
    }
    
    /**
     * Registrar campos repeater en GraphQL
     */
    private function register_repeater_fields() {
        // Si wp-graphql-acf está activo, los campos se registran automáticamente
        // Solo necesitamos asegurarnos de que los datos estén en el formato correcto
    }
    
    /**
     * Registrar campos flexible content en GraphQL
     */
    private function register_flexible_content_fields() {
        // Similar a repeater
    }
    
    /**
     * Formatear valor para GraphQL
     */
    public function format_value_for_graphql($value, $post_id, $field) {
        // Si es un campo repeater
        if ($field['type'] === 'repeater' && is_array($value)) {
            return $this->format_repeater_for_graphql($value, $field);
        }
        
        // Si es un campo flexible content
        if ($field['type'] === 'flexible_content' && is_array($value)) {
            return $this->format_flexible_content_for_graphql($value, $field);
        }
        
        // Si es un campo clone
        if ($field['type'] === 'clone' && is_array($value)) {
            return $this->format_clone_for_graphql($value, $field);
        }
        
        // Si es un campo gallery
        if ($field['type'] === 'gallery' && is_array($value)) {
            return $this->format_gallery_for_graphql($value, $field);
        }
        
        return $value;
    }
    
    /**
     * Formatear repeater para GraphQL
     */
    private function format_repeater_for_graphql($value, $field) {
        $formatted = array();
        
        foreach ($value as $row) {
            $formatted_row = array();
            
            if (isset($field['sub_fields']) && is_array($field['sub_fields'])) {
                foreach ($field['sub_fields'] as $sub_field) {
                    $sub_field_name = $sub_field['name'];
                    
                    if (isset($row[$sub_field_name])) {
                        $formatted_row[$sub_field_name] = $this->format_field_value($row[$sub_field_name], $sub_field);
                    }
                }
            }
            
            $formatted[] = $formatted_row;
        }
        
        return $formatted;
    }
    
    /**
     * Formatear flexible content para GraphQL
     */
    private function format_flexible_content_for_graphql($value, $field) {
        $formatted = array();
        
        foreach ($value as $layout) {
            if (!isset($layout['acf_fc_layout'])) {
                continue;
            }
            
            $formatted_layout = array(
                'layout' => $layout['acf_fc_layout']
            );
            
            // Buscar configuración del layout
            $layout_config = null;
            if (isset($field['layouts']) && is_array($field['layouts'])) {
                foreach ($field['layouts'] as $config) {
                    if ($config['key'] === $layout['acf_fc_layout'] || $config['name'] === $layout['acf_fc_layout']) {
                        $layout_config = $config;
                        break;
                    }
                }
            }
            
            // Procesar sub-campos
            if ($layout_config && isset($layout_config['sub_fields'])) {
                foreach ($layout_config['sub_fields'] as $sub_field) {
                    $sub_field_name = $sub_field['name'];
                    
                    if (isset($layout[$sub_field_name])) {
                        $formatted_layout[$sub_field_name] = $this->format_field_value($layout[$sub_field_name], $sub_field);
                    }
                }
            }
            
            $formatted[] = $formatted_layout;
        }
        
        return $formatted;
    }
    
    /**
     * Formatear gallery para GraphQL
     */
    private function format_gallery_for_graphql($value, $field) {
        $formatted = array();
        
        foreach ($value as $image_id) {
            if (!is_numeric($image_id)) {
                continue;
            }
            
            $image = wp_get_attachment_image_src($image_id, 'full');
            if ($image) {
                $formatted[] = array(
                    'id' => $image_id,
                    'url' => $image[0],
                    'width' => $image[1],
                    'height' => $image[2],
                    'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true),
                    'title' => get_the_title($image_id),
                    'caption' => wp_get_attachment_caption($image_id),
                    'description' => get_post_field('post_content', $image_id),
                );
            }
        }
        
        return $formatted;
    }
    
    /**
     * Formatear clone para GraphQL
     */
    private function format_clone_for_graphql($value, $field) {
        $formatted = array();
        
        // Obtener campos clonados
        $clone = isset($field['clone']) ? $field['clone'] : array();
        if (empty($clone) || !is_array($clone)) {
            return $formatted;
        }
        
        // Obtener configuración de campos clonados
        $cloned_fields = $this->get_cloned_fields_config($clone);
        
        foreach ($cloned_fields as $cloned_field) {
            $field_name = $cloned_field['name'];
            
            if (isset($value[$field_name])) {
                $formatted[$field_name] = $this->format_field_value($value[$field_name], $cloned_field);
            }
        }
        
        return $formatted;
    }
    
    /**
     * Obtener configuración de campos clonados
     */
    private function get_cloned_fields_config($clone_selectors) {
        $fields = array();
        
        foreach ($clone_selectors as $selector) {
            // Intentar obtener campo por key
            if (function_exists('acf_get_field')) {
                $field = acf_get_field($selector);
                if ($field) {
                    $fields[] = $field;
                    continue;
                }
            }
            
            // Intentar obtener grupo de campos
            if (function_exists('acf_get_field_group')) {
                $group = acf_get_field_group($selector);
                if ($group && function_exists('acf_get_fields')) {
                    $group_fields = acf_get_fields($group);
                    if (!empty($group_fields)) {
                        $fields = array_merge($fields, $group_fields);
                    }
                }
            }
        }
        
        return $fields;
    }
    
    /**
     * Formatear valor de campo
     */
    private function format_field_value($value, $field) {
        switch ($field['type']) {
            case 'gallery':
                if (is_array($value)) {
                    return $this->format_gallery_for_graphql($value, $field);
                }
                return array();
                
            case 'image':
            case 'file':
                if (is_numeric($value)) {
                    $image = wp_get_attachment_image_src($value, 'full');
                    return array(
                        'id' => $value,
                        'url' => $image ? $image[0] : '',
                        'alt' => get_post_meta($value, '_wp_attachment_image_alt', true),
                        'title' => get_the_title($value)
                    );
                }
                return null;
                
            case 'repeater':
                if (is_array($value)) {
                    return $this->format_repeater_for_graphql($value, $field);
                }
                return array();
                
            case 'flexible_content':
                if (is_array($value)) {
                    return $this->format_flexible_content_for_graphql($value, $field);
                }
                return array();
                
            case 'clone':
                if (is_array($value)) {
                    return $this->format_clone_for_graphql($value, $field);
                }
                return array();
                
            case 'number':
                return floatval($value);
                
            case 'true_false':
                return (bool) $value;
                
            default:
                return $value;
        }
    }
}

