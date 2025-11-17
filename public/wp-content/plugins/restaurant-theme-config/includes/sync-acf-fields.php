<?php
/**
 * Script para sincronizar campos ACF locales con la base de datos
 * Ejecutar una vez desde el admin de WordPress o via WP-CLI
 */

// Prevenir acceso directo
if (!defined('ABSPATH')) {
    exit;
}

class Restaurant_ACF_Fields_Sync {
    
    public function __construct() {
        // Solo ejecutar si ACF está activo
        if (function_exists('acf_get_field_groups')) {
            add_action('admin_init', array($this, 'sync_field_groups'));
        }
    }
    
    public function sync_field_groups() {
        // Verificar si ya se sincronizó
        if (get_option('restaurant_acf_fields_synced')) {
            return;
        }
        
        // Obtener grupos de campos locales
        $local_groups = acf_get_local_field_groups();
        
        foreach ($local_groups as $group) {
            // Verificar si el grupo ya existe en la base de datos
            $existing_group = acf_get_field_group($group['key']);
            
            if (!$existing_group) {
                // El grupo no existe, crearlo
                acf_update_field_group($group);
            } else {
                // El grupo existe, actualizar los campos
                $this->sync_fields($group);
            }
        }
        
        // Marcar como sincronizado
        update_option('restaurant_acf_fields_synced', true);
    }
    
    private function sync_fields($group) {
        if (!isset($group['fields']) || !is_array($group['fields'])) {
            return;
        }
        
        foreach ($group['fields'] as $field) {
            // Verificar si el campo ya existe
            $existing_field = acf_get_field($field['key']);
            
            if (!$existing_field) {
                // El campo no existe, crearlo
                acf_update_field($field);
            } else {
                // El campo existe, actualizarlo
                acf_update_field($field);
            }
            
            // Si el campo tiene sub_fields (repeater, group, etc.), sincronizarlos también
            if (isset($field['sub_fields']) && is_array($field['sub_fields'])) {
                foreach ($field['sub_fields'] as $sub_field) {
                    $existing_sub_field = acf_get_field($sub_field['key']);
                    if (!$existing_sub_field) {
                        acf_update_field($sub_field);
                    } else {
                        acf_update_field($sub_field);
                    }
                }
            }
        }
    }
}

// Inicializar solo si ACF está activo
if (function_exists('acf_get_field_groups')) {
    new Restaurant_ACF_Fields_Sync();
}

