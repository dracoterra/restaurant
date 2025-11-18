<?php
/**
 * Script de verificación del plugin ACF Pro Features Free
 * 
 * Ejecutar desde WordPress Admin o desde línea de comandos:
 * wp eval-file verify-plugin.php
 */

// Verificar que estamos en WordPress
if (!defined('ABSPATH')) {
    require_once('../../../wp-load.php');
}

echo "=== VERIFICACIÓN DEL PLUGIN ACF PRO FEATURES FREE ===\n\n";

// 1. Verificar que ACF esté activo
echo "1. Verificando Advanced Custom Fields...\n";
if (function_exists('acf_add_local_field_group')) {
    echo "   ✅ ACF está activo\n";
    $acf_version = defined('ACF_VERSION') ? ACF_VERSION : 'Desconocida';
    echo "   Versión: $acf_version\n";
} else {
    echo "   ❌ ACF NO está activo - REQUERIDO\n";
    exit(1);
}

// 2. Verificar que ACF PRO no esté activo
echo "\n2. Verificando ACF PRO...\n";
if (class_exists('acf_field_repeater') && get_class(new acf_field_repeater()) !== 'ACF_Pro_Features_Repeater_Field') {
    echo "   ⚠️  ACF PRO está activo - Este plugin no se usará\n";
} else {
    echo "   ✅ ACF PRO no está activo - Este plugin funcionará\n";
}

// 3. Verificar que el plugin esté activo
echo "\n3. Verificando plugin ACF Pro Features Free...\n";
if (class_exists('ACF_Pro_Features_Free')) {
    echo "   ✅ Plugin está activo\n";
    $plugin_version = defined('ACF_PRO_FEATURES_VERSION') ? ACF_PRO_FEATURES_VERSION : 'Desconocida';
    echo "   Versión: $plugin_version\n";
} else {
    echo "   ❌ Plugin NO está activo\n";
    exit(1);
}

// 4. Verificar que los campos estén registrados
echo "\n4. Verificando campos registrados...\n";

// Repeater
$repeater = acf_get_field_type('repeater');
if ($repeater) {
    $repeater_class = get_class($repeater);
    echo "   ✅ Repeater está registrado\n";
    echo "      Clase: $repeater_class\n";
    if ($repeater_class === 'ACF_Pro_Features_Repeater_Field') {
        echo "      ✅ Usando implementación del plugin (correcto)\n";
    } else {
        echo "      ⚠️  Usando otra implementación (posiblemente ACF PRO)\n";
    }
} else {
    echo "   ❌ Repeater NO está registrado\n";
}

// Flexible Content
$flexible = acf_get_field_type('flexible_content');
if ($flexible) {
    $flexible_class = get_class($flexible);
    echo "   ✅ Flexible Content está registrado\n";
    echo "      Clase: $flexible_class\n";
    if ($flexible_class === 'ACF_Pro_Features_Flexible_Content_Field') {
        echo "      ✅ Usando implementación del plugin (correcto)\n";
    } else {
        echo "      ⚠️  Usando otra implementación (posiblemente ACF PRO)\n";
    }
} else {
    echo "   ❌ Flexible Content NO está registrado\n";
}

// Clone
$clone = acf_get_field_type('clone');
if ($clone) {
    $clone_class = get_class($clone);
    echo "   ✅ Clone está registrado\n";
    echo "      Clase: $clone_class\n";
    if ($clone_class === 'ACF_Pro_Features_Clone_Field') {
        echo "      ✅ Usando implementación del plugin (correcto)\n";
    } else {
        echo "      ⚠️  Usando otra implementación (posiblemente ACF PRO)\n";
    }
} else {
    echo "   ❌ Clone NO está registrado\n";
}

// 5. Verificar integración GraphQL
echo "\n5. Verificando integración GraphQL...\n";
if (class_exists('WPGraphQL')) {
    echo "   ✅ WPGraphQL está activo\n";
    
    if (class_exists('WPGraphQLACF')) {
        echo "   ✅ WPGraphQL for ACF está activo\n";
    } else {
        echo "   ⚠️  WPGraphQL for ACF NO está activo (opcional)\n";
    }
    
    if (class_exists('ACF_Pro_Features_GraphQL_Integration')) {
        echo "   ✅ Integración GraphQL del plugin está disponible\n";
    } else {
        echo "   ⚠️  Integración GraphQL del plugin NO está disponible\n";
    }
} else {
    echo "   ⚠️  WPGraphQL NO está activo (opcional)\n";
}

// 6. Verificar archivos del plugin
echo "\n6. Verificando archivos del plugin...\n";
$plugin_dir = ACF_PRO_FEATURES_PLUGIN_DIR;
$required_files = array(
    'includes/class-repeater-field.php',
    'includes/class-flexible-content-field.php',
    'includes/class-clone-field.php',
    'includes/class-graphql-integration.php',
    'includes/class-admin-page.php',
    'includes/functions.php',
    'assets/js/admin.js',
    'assets/css/admin.css'
);

foreach ($required_files as $file) {
    $file_path = $plugin_dir . $file;
    if (file_exists($file_path)) {
        echo "   ✅ $file\n";
    } else {
        echo "   ❌ $file - NO ENCONTRADO\n";
    }
}

// 7. Verificar funciones auxiliares
echo "\n7. Verificando funciones auxiliares...\n";
$helper_functions = array(
    'acf_pro_features_get_repeater_field',
    'acf_pro_features_get_flexible_content_field',
    'acf_pro_features_get_field',
    'acf_pro_features_is_pro_active'
);

foreach ($helper_functions as $func) {
    if (function_exists($func)) {
        echo "   ✅ $func()\n";
    } else {
        echo "   ❌ $func() - NO DISPONIBLE\n";
    }
}

// 8. Verificar hooks de ACF
echo "\n8. Verificando hooks de ACF...\n";
if (has_action('acf/include_field_types')) {
    echo "   ✅ Hook 'acf/include_field_types' está registrado\n";
} else {
    echo "   ⚠️  Hook 'acf/include_field_types' NO está registrado\n";
}

// Resumen
echo "\n=== RESUMEN ===\n";
$all_ok = true;

if (!function_exists('acf_add_local_field_group')) {
    echo "❌ ACF no está activo\n";
    $all_ok = false;
}

if (!class_exists('ACF_Pro_Features_Free')) {
    echo "❌ Plugin no está activo\n";
    $all_ok = false;
}

$repeater = acf_get_field_type('repeater');
if (!$repeater || get_class($repeater) !== 'ACF_Pro_Features_Repeater_Field') {
    echo "⚠️  Repeater puede no estar funcionando correctamente\n";
}

$flexible = acf_get_field_type('flexible_content');
if (!$flexible || get_class($flexible) !== 'ACF_Pro_Features_Flexible_Content_Field') {
    echo "⚠️  Flexible Content puede no estar funcionando correctamente\n";
}

$clone = acf_get_field_type('clone');
if (!$clone || get_class($clone) !== 'ACF_Pro_Features_Clone_Field') {
    echo "⚠️  Clone puede no estar funcionando correctamente\n";
}

if ($all_ok) {
    echo "✅ Plugin está correctamente instalado y funcionando\n";
} else {
    echo "❌ Hay problemas que deben resolverse\n";
}

echo "\n=== FIN DE VERIFICACIÓN ===\n";

