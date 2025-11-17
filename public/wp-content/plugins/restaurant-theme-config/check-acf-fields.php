<?php
/**
 * Script para verificar y eliminar grupos de campos ACF guardados en la base de datos
 * Acceder desde: http://restaurant.local/wp-content/plugins/restaurant-theme-config/check-acf-fields.php
 */

// Prevenir acceso directo
if (!defined('ABSPATH')) {
    require_once('../../../wp-load.php');
}

if (!function_exists('acf_get_field_groups')) {
    die('ACF no está activo.');
}

echo "<h1>Verificación de Campos ACF</h1>";

// Obtener todos los grupos de campos desde la base de datos
$field_groups = get_posts(array(
    'post_type' => 'acf-field-group',
    'posts_per_page' => -1,
    'post_status' => 'any'
));

echo "<h2>Grupos de campos guardados en la base de datos:</h2>";
echo "<p>Total encontrados: " . count($field_groups) . "</p>";

if (empty($field_groups)) {
    echo "<p style='color: green;'>✅ No hay grupos de campos guardados en la base de datos.</p>";
} else {
    echo "<table border='1' cellpadding='10' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>ID</th><th>Título</th><th>Key</th><th>Estado</th><th>Acción</th></tr>";
    
    foreach ($field_groups as $group) {
        $key = get_post_meta($group->ID, '_acf_key', true) ?: 'N/A';
        $status = $group->post_status;
        $status_color = ($status === 'publish') ? 'green' : 'orange';
        
        echo "<tr>";
        echo "<td>{$group->ID}</td>";
        echo "<td><strong>{$group->post_title}</strong></td>";
        echo "<td>{$key}</td>";
        echo "<td style='color: {$status_color};'>{$status}</td>";
        echo "<td>";
        echo "<a href='?delete={$group->ID}' style='color: red;' onclick='return confirm(\"¿Estás seguro de eliminar este grupo?\")'>Eliminar</a>";
        echo "</td>";
        echo "</tr>";
    }
    
    echo "</table>";
}

// Procesar eliminación
if (isset($_GET['delete']) && is_numeric($_GET['delete'])) {
    $delete_id = intval($_GET['delete']);
    $result = wp_delete_post($delete_id, true);
    
    if ($result) {
        echo "<p style='color: green;'>✅ Grupo eliminado correctamente. <a href='?'>Recargar</a></p>";
    } else {
        echo "<p style='color: red;'>❌ Error al eliminar el grupo.</p>";
    }
}

// Verificar campos locales
echo "<h2>Campos locales (desde código/JSON):</h2>";
$local_groups = acf_get_local_field_groups();
if (empty($local_groups)) {
    echo "<p style='color: green;'>✅ No hay campos locales cargados.</p>";
} else {
    echo "<p style='color: orange;'>⚠️ Se encontraron " . count($local_groups) . " grupos de campos locales.</p>";
    echo "<ul>";
    foreach ($local_groups as $group) {
        echo "<li><strong>{$group['title']}</strong> (Key: {$group['key']})</li>";
    }
    echo "</ul>";
    echo "<p>Estos campos se cargan desde código PHP o archivos JSON. Verifica que no haya archivos JSON en carpetas acf-json.</p>";
}

echo "<hr>";
echo "<p><a href='/wp-admin/edit.php?post_type=acf-field-group'>Ver en el admin de WordPress</a></p>";

