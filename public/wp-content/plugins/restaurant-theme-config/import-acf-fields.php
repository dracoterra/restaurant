<?php
/**
 * Script para importar grupos de campos ACF directamente
 * Ejecutar una vez desde el admin o via WP-CLI: wp eval-file import-acf-fields.php
 */

// Prevenir acceso directo
if (!defined('ABSPATH')) {
    require_once('../../../wp-load.php');
}

if (!function_exists('acf_add_local_field_group')) {
    die('ACF no está activo. Por favor activa Advanced Custom Fields primero.');
}

// Leer el archivo JSON
$json_file = plugin_dir_path(__FILE__) . 'acf-export.json';
if (!file_exists($json_file)) {
    die('Archivo acf-export.json no encontrado.');
}

$json_content = file_get_contents($json_file);
$field_groups = json_decode($json_content, true);

if (!$field_groups) {
    die('Error al parsear el archivo JSON.');
}

// Importar cada grupo de campos
foreach ($field_groups as $field_group) {
    // Convertir location rules si usan page:slug:xxx
    if (isset($field_group['location'])) {
        foreach ($field_group['location'] as &$location_group) {
            foreach ($location_group as &$rule) {
                if (isset($rule['value']) && strpos($rule['value'], 'page:slug:') === 0) {
                    $slug = str_replace('page:slug:', '', $rule['value']);
                    $page = get_page_by_path($slug);
                    if ($page) {
                        $rule['value'] = $page->ID;
                    } else {
                        // Si no existe la página, usar el slug como fallback
                        $rule['param'] = 'page_template';
                        $rule['value'] = 'default';
                    }
                }
            }
        }
    }
    
    // Agregar el grupo de campos
    acf_add_local_field_group($field_group);
}

echo "✅ Grupos de campos ACF importados correctamente:\n";
foreach ($field_groups as $group) {
    echo "  - " . $group['title'] . "\n";
}

