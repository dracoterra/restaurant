<?php
/**
 * Script para ejecutar la importación de campos ACF
 * Acceder desde: http://restaurant.local/wp-content/plugins/restaurant-theme-config/run-import.php
 */

// Cargar WordPress
require_once('../../../wp-load.php');

// Verificar que ACF esté activo
if (!function_exists('acf_import_field_group')) {
    die('❌ ACF no está activo. Por favor activa Advanced Custom Fields primero.');
}

// Leer el archivo JSON
$json_file = __DIR__ . '/acf-export.json';
if (!file_exists($json_file)) {
    die('❌ Archivo acf-export.json no encontrado.');
}

$json_content = file_get_contents($json_file);
$field_groups = json_decode($json_content, true);

if (!$field_groups) {
    die('❌ Error al parsear el archivo JSON.');
}

// Función para obtener ID de página por slug
function get_page_id_by_slug($slug) {
    $page = get_page_by_path($slug);
    return $page ? $page->ID : 0;
}

// Importar cada grupo de campos
$imported = 0;
foreach ($field_groups as $field_group) {
    // Convertir location rules si usan page:slug:xxx
    if (isset($field_group['location'])) {
        foreach ($field_group['location'] as &$location_group) {
            foreach ($location_group as &$rule) {
                if (isset($rule['value']) && strpos($rule['value'], 'page:slug:') === 0) {
                    $slug = str_replace('page:slug:', '', $rule['value']);
                    $page_id = get_page_id_by_slug($slug);
                    if ($page_id) {
                        $rule['value'] = $page_id;
                    } else {
                        // Si no existe, usar page_template como fallback
                        $rule['param'] = 'page_template';
                        $rule['value'] = 'default';
                    }
                }
            }
        }
    }
    
    // Importar el grupo de campos (guarda en BD, no como local)
    $result = acf_import_field_group($field_group);
    if ($result) {
        $imported++;
    }
}

?>
<!DOCTYPE html>
<html>
<head>
    <title>Importación ACF Completada</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; background: #f0f0f1; }
        .success { background: #00a32a; color: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        ul { list-style: none; padding: 0; }
        li { padding: 5px 0; }
        a { color: #2271b1; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="success">
        <h1>✅ Importación Completada</h1>
        <p>Se importaron <strong><?php echo $imported; ?></strong> grupos de campos ACF correctamente.</p>
    </div>
    
    <div class="info">
        <h2>Grupos Importados:</h2>
        <ul>
            <?php foreach ($field_groups as $group): ?>
            <li>✅ <?php echo esc_html($group['title']); ?></li>
            <?php endforeach; ?>
        </ul>
    </div>
    
    <div class="info">
        <h2>Próximos Pasos:</h2>
        <ol>
            <li><a href="/wp-admin/edit.php?post_type=acf-field-group">Ver los grupos de campos</a></li>
            <li><a href="/wp-admin/edit.php?post_type=page">Editar una página</a> para ver los campos</li>
            <li>Activar <strong>ACF to GraphQL</strong> si aún no está activo</li>
        </ol>
    </div>
</body>
</html>

