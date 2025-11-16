<?php
/**
 * Funciones auxiliares del plugin
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Obtener valor de campo repeater
 * 
 * @param string $field_name Nombre del campo
 * @param int $post_id ID del post
 * @return array Array de filas del repeater
 */
function acf_pro_features_get_repeater_field($field_name, $post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    if (!$post_id) {
        return array();
    }
    
    $value = get_post_meta($post_id, $field_name, true);
    
    if (empty($value) || !is_array($value)) {
        return array();
    }
    
    return $value;
}

/**
 * Obtener valor de campo flexible content
 * 
 * @param string $field_name Nombre del campo
 * @param int $post_id ID del post
 * @return array Array de layouts
 */
function acf_pro_features_get_flexible_content_field($field_name, $post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    if (!$post_id) {
        return array();
    }
    
    $value = get_post_meta($post_id, $field_name, true);
    
    if (empty($value) || !is_array($value)) {
        return array();
    }
    
    return $value;
}

/**
 * Verificar si ACF PRO está activo
 * 
 * @return bool
 */
function acf_pro_features_is_pro_active() {
    return class_exists('acf_field_repeater');
}

/**
 * Obtener campo ACF (compatible con PRO y Free)
 * 
 * @param string $field_name Nombre del campo
 * @param int $post_id ID del post
 * @return mixed Valor del campo
 */
function acf_pro_features_get_field($field_name, $post_id = null) {
    // Si ACF está disponible, usar su función
    if (function_exists('get_field')) {
        return get_field($field_name, $post_id);
    }
    
    // Fallback a meta directo
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    if (!$post_id) {
        return null;
    }
    
    return get_post_meta($post_id, $field_name, true);
}

/**
 * Verificar si un campo es de tipo repeater
 * 
 * @param string $field_name Nombre del campo
 * @return bool
 */
function acf_pro_features_is_repeater_field($field_name) {
    $field = acf_get_field($field_name);
    
    if (!$field) {
        return false;
    }
    
    return $field['type'] === 'repeater';
}

/**
 * Verificar si un campo es de tipo flexible content
 * 
 * @param string $field_name Nombre del campo
 * @return bool
 */
function acf_pro_features_is_flexible_content_field($field_name) {
    $field = acf_get_field($field_name);
    
    if (!$field) {
        return false;
    }
    
    return $field['type'] === 'flexible_content';
}

