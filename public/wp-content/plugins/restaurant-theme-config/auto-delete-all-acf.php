<?php
/**
 * Script para ELIMINAR AUTOMÁTICAMENTE todos los grupos de campos ACF
 * Ejecutar desde: http://restaurant.local/wp-content/plugins/restaurant-theme-config/auto-delete-all-acf.php
 * Este script elimina TODO sin preguntar
 */

// Prevenir acceso directo
if (!defined('ABSPATH')) {
    require_once('../../../wp-load.php');
}

// Verificar que el usuario sea admin
if (!current_user_can('manage_options')) {
    die('No tienes permisos para ejecutar este script.');
}

global $wpdb;

echo "<h1>Eliminación Automática de Campos ACF</h1>";
echo "<p style='color: red; font-weight: bold;'>Este script eliminará TODOS los grupos de campos ACF automáticamente.</p>";

// Obtener TODOS los grupos de campos ACF
$field_groups = $wpdb->get_results("
    SELECT ID, post_title 
    FROM {$wpdb->posts} 
    WHERE post_type = 'acf-field-group'
    AND post_status != 'trash'
");

$deleted_groups = 0;
$deleted_fields = 0;
$errors = 0;

if (empty($field_groups)) {
    echo "<p style='color: green; font-size: 18px;'>✅ No hay grupos de campos ACF en la base de datos.</p>";
} else {
    echo "<p>Encontrados " . count($field_groups) . " grupos de campos. Eliminando...</p>";
    echo "<ul>";
    
    foreach ($field_groups as $group) {
        echo "<li>Eliminando: <strong>{$group->post_title}</strong> (ID: {$group->ID})... ";
        
        // Eliminar todos los campos relacionados
        $fields = $wpdb->get_results($wpdb->prepare("
            SELECT ID FROM {$wpdb->posts} 
            WHERE post_type = 'acf-field' 
            AND post_parent = %d
        ", $group->ID));
        
        foreach ($fields as $field) {
            $result = wp_delete_post($field->ID, true);
            if ($result) {
                $deleted_fields++;
            }
        }
        
        // Eliminar también campos hijos recursivamente
        $all_fields = $wpdb->get_results($wpdb->prepare("
            SELECT ID FROM {$wpdb->posts} 
            WHERE post_type = 'acf-field' 
            AND post_parent = %d
        ", $group->ID));
        
        foreach ($all_fields as $field) {
            // Eliminar sub-campos
            $sub_fields = $wpdb->get_results($wpdb->prepare("
                SELECT ID FROM {$wpdb->posts} 
                WHERE post_type = 'acf-field' 
                AND post_parent = %d
            ", $field->ID));
            
            foreach ($sub_fields as $sub_field) {
                wp_delete_post($sub_field->ID, true);
            }
            
            wp_delete_post($field->ID, true);
        }
        
        // Eliminar el grupo
        $result = wp_delete_post($group->ID, true);
        
        if ($result) {
            $deleted_groups++;
            echo "✅</li>";
        } else {
            $errors++;
            echo "❌ Error</li>";
        }
    }
    
    echo "</ul>";
}

// Limpiar también campos huérfanos
$orphan_fields = $wpdb->get_results("
    SELECT ID FROM {$wpdb->posts} 
    WHERE post_type = 'acf-field'
    AND post_status != 'trash'
");

if (!empty($orphan_fields)) {
    echo "<p>Eliminando campos huérfanos...</p>";
    foreach ($orphan_fields as $field) {
        wp_delete_post($field->ID, true);
        $deleted_fields++;
    }
}

// Limpiar meta data relacionada
$wpdb->query("DELETE FROM {$wpdb->postmeta} WHERE post_id NOT IN (SELECT ID FROM {$wpdb->posts})");

// Limpiar opciones relacionadas
delete_option('restaurant_acf_fields_synced');
delete_option('restaurant_acf_auto_create_disabled');

// Limpiar caché de ACF
if (function_exists('acf_get_store')) {
    acf_get_store('field-groups')->reset();
    acf_get_store('fields')->reset();
}

// Limpiar transients relacionados
$wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_acf%'");
$wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout_acf%'");

echo "<hr style='margin: 30px 0;'>";
echo "<h2>Resumen de la eliminación:</h2>";
echo "<div style='background: #d4edda; color: #155724; padding: 20px; border: 1px solid #c3e6cb; border-radius: 5px;'>";
echo "<p style='font-size: 18px;'><strong>✅ Grupos eliminados: {$deleted_groups}</strong></p>";
echo "<p style='font-size: 18px;'><strong>✅ Campos eliminados: {$deleted_fields}</strong></p>";
if ($errors > 0) {
    echo "<p style='color: red;'><strong>❌ Errores: {$errors}</strong></p>";
}
echo "</div>";

// Verificar que no quede nada
$remaining = $wpdb->get_var("
    SELECT COUNT(*) FROM {$wpdb->posts} 
    WHERE post_type = 'acf-field-group'
    AND post_status != 'trash'
");

if ($remaining == 0) {
    echo "<p style='color: green; font-size: 20px; font-weight: bold; margin-top: 20px;'>🎉 ¡Todos los campos ACF han sido eliminados exitosamente!</p>";
} else {
    echo "<p style='color: orange; font-size: 18px; margin-top: 20px;'>⚠️ Aún quedan {$remaining} grupos. Puede ser necesario ejecutar el script nuevamente.</p>";
}

// Verificar campos locales
echo "<h3>Verificación de Campos Locales:</h3>";
if (function_exists('acf_get_local_field_groups')) {
    $local_groups = acf_get_local_field_groups();
    if (!empty($local_groups)) {
        echo "<p style='color: orange;'>⚠️ Se encontraron " . count($local_groups) . " grupos de campos locales cargados desde código:</p>";
        echo "<ul>";
        foreach ($local_groups as $group) {
            echo "<li><strong>{$group['title']}</strong> (Key: {$group['key']})";
            if (isset($group['local_file'])) {
                echo " - Archivo: {$group['local_file']}";
            }
            echo "</li>";
        }
        echo "</ul>";
        echo "<p style='color: red;'><strong>Estos campos se están cargando desde código PHP o archivos JSON. Necesitas encontrar y eliminar/desactivar el código que los está cargando.</strong></p>";
    } else {
        echo "<p style='color: green;'>✅ No hay campos locales cargados desde código.</p>";
    }
}

echo "<hr style='margin: 30px 0;'>";
echo "<p><a href='/wp-admin/post.php?post=2552&action=edit' style='background: #0073aa; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Ver página Home</a></p>";
echo "<p><a href='/wp-admin/edit.php?post_type=acf-field-group' style='padding: 10px 20px;'>Ver grupos de campos ACF en el admin</a></p>";

