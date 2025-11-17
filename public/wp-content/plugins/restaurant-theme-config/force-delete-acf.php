<?php
/**
 * Script para FORZAR la eliminación de todos los grupos de campos ACF
 * Acceder desde: http://restaurant.local/wp-content/plugins/restaurant-theme-config/force-delete-acf.php
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

echo "<h1>Eliminación Forzada de Campos ACF</h1>";

// Obtener TODOS los grupos de campos ACF desde la base de datos directamente
$field_groups = $wpdb->get_results("
    SELECT ID, post_title, post_name, post_status 
    FROM {$wpdb->posts} 
    WHERE post_type = 'acf-field-group'
    AND post_status != 'trash'
");

echo "<h2>Grupos encontrados en la base de datos:</h2>";
echo "<p>Total: " . count($field_groups) . "</p>";

if (empty($field_groups)) {
    echo "<p style='color: green; font-size: 18px;'>✅ No hay grupos de campos ACF en la base de datos.</p>";
} else {
    echo "<table border='1' cellpadding='10' style='border-collapse: collapse; width: 100%; margin: 20px 0;'>";
    echo "<tr style='background: #f0f0f0;'><th>ID</th><th>Título</th><th>Slug</th><th>Estado</th><th>Acción</th></tr>";
    
    foreach ($field_groups as $group) {
        echo "<tr>";
        echo "<td>{$group->ID}</td>";
        echo "<td><strong>{$group->post_title}</strong></td>";
        echo "<td>{$group->post_name}</td>";
        echo "<td>{$group->post_status}</td>";
        echo "<td>";
        echo "<a href='?delete={$group->ID}' style='color: red; font-weight: bold;' onclick='return confirm(\"¿Eliminar permanentemente este grupo? Esta acción no se puede deshacer.\")'>ELIMINAR</a>";
        echo "</td>";
        echo "</tr>";
    }
    
    echo "</table>";
    
    // Botón para eliminar todos
    echo "<p style='margin-top: 20px;'>";
    echo "<a href='?delete_all=1' style='background: red; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;' onclick='return confirm(\"¿Eliminar TODOS los grupos de campos ACF? Esta acción no se puede deshacer.\")'>ELIMINAR TODOS</a>";
    echo "</p>";
}

// Procesar eliminación individual
if (isset($_GET['delete']) && is_numeric($_GET['delete'])) {
    $delete_id = intval($_GET['delete']);
    
    // Eliminar campos relacionados primero
    $fields = $wpdb->get_results($wpdb->prepare("
        SELECT ID FROM {$wpdb->posts} 
        WHERE post_type = 'acf-field' 
        AND post_parent = %d
    ", $delete_id));
    
    foreach ($fields as $field) {
        wp_delete_post($field->ID, true);
    }
    
    // Eliminar el grupo
    $result = wp_delete_post($delete_id, true);
    
    if ($result) {
        echo "<div style='background: #d4edda; color: #155724; padding: 15px; border: 1px solid #c3e6cb; border-radius: 5px; margin: 20px 0;'>";
        echo "✅ Grupo eliminado correctamente. <a href='?'>Recargar página</a>";
        echo "</div>";
    } else {
        echo "<div style='background: #f8d7da; color: #721c24; padding: 15px; border: 1px solid #f5c6cb; border-radius: 5px; margin: 20px 0;'>";
        echo "❌ Error al eliminar el grupo.";
        echo "</div>";
    }
}

// Procesar eliminación masiva
if (isset($_GET['delete_all']) && $_GET['delete_all'] == '1') {
    $deleted = 0;
    $errors = 0;
    
    foreach ($field_groups as $group) {
        // Eliminar campos relacionados
        $fields = $wpdb->get_results($wpdb->prepare("
            SELECT ID FROM {$wpdb->posts} 
            WHERE post_type = 'acf-field' 
            AND post_parent = %d
        ", $group->ID));
        
        foreach ($fields as $field) {
            wp_delete_post($field->ID, true);
        }
        
        // Eliminar el grupo
        $result = wp_delete_post($group->ID, true);
        
        if ($result) {
            $deleted++;
        } else {
            $errors++;
        }
    }
    
    echo "<div style='background: #d4edda; color: #155724; padding: 15px; border: 1px solid #c3e6cb; border-radius: 5px; margin: 20px 0;'>";
    echo "<h3>Resultado de la eliminación masiva:</h3>";
    echo "<p>✅ Eliminados: {$deleted}</p>";
    if ($errors > 0) {
        echo "<p>❌ Errores: {$errors}</p>";
    }
    echo "<p><a href='?'>Recargar página</a></p>";
    echo "</div>";
}

// Verificar campos locales
echo "<hr style='margin: 30px 0;'>";
echo "<h2>Verificación de Campos Locales</h2>";

if (function_exists('acf_get_local_field_groups')) {
    $local_groups = acf_get_local_field_groups();
    if (empty($local_groups)) {
        echo "<p style='color: green;'>✅ No hay campos locales cargados desde código.</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ Se encontraron " . count($local_groups) . " grupos de campos locales:</p>";
        echo "<ul>";
        foreach ($local_groups as $group) {
            echo "<li><strong>{$group['title']}</strong> (Key: {$group['key']})</li>";
        }
        echo "</ul>";
        echo "<p>Estos campos se cargan desde código PHP o archivos JSON. Verifica que no haya archivos JSON en carpetas acf-json del tema.</p>";
    }
}

echo "<hr style='margin: 30px 0;'>";
echo "<p><a href='/wp-admin/edit.php?post_type=acf-field-group'>Ver en el admin de WordPress</a> | ";
echo "<a href='/wp-admin/post.php?post=2552&action=edit'>Volver a editar la página Home</a></p>";

