<?php
/**
 * Página de administración del plugin
 */

if (!defined('ABSPATH')) {
    exit;
}

class ACF_Pro_Features_Admin_Page {
    
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
    }
    
    /**
     * Agregar menú de administración
     */
    public function add_admin_menu() {
        add_submenu_page(
            'edit.php?post_type=acf-field-group',
            __('ACF Pro Features Free', 'acf-pro-features-free'),
            __('Pro Features Free', 'acf-pro-features-free'),
            'manage_options',
            'acf-pro-features-free',
            array($this, 'render_admin_page')
        );
    }
    
    /**
     * Registrar configuraciones
     */
    public function register_settings() {
        register_setting('acf_pro_features_settings', 'acf_pro_features_options');
    }
    
    /**
     * Renderizar página de administración
     */
    public function render_admin_page() {
        if (!current_user_can('manage_options')) {
            return;
        }
        
        // Verificar estado de plugins
        $acf_active = function_exists('acf_add_local_field_group');
        $acf_pro_active = class_exists('acf_field_repeater');
        $graphql_active = class_exists('WPGraphQL');
        $graphql_acf_active = class_exists('WPGraphQLACF');
        
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            
            <div class="acf-pro-features-status">
                <h2><?php esc_html_e('Estado del Sistema', 'acf-pro-features-free'); ?></h2>
                
                <table class="widefat">
                    <thead>
                        <tr>
                            <th><?php esc_html_e('Componente', 'acf-pro-features-free'); ?></th>
                            <th><?php esc_html_e('Estado', 'acf-pro-features-free'); ?></th>
                            <th><?php esc_html_e('Descripción', 'acf-pro-features-free'); ?></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong><?php esc_html_e('Advanced Custom Fields', 'acf-pro-features-free'); ?></strong></td>
                            <td>
                                <?php if ($acf_active): ?>
                                    <span style="color: green;">✓ <?php esc_html_e('Activo', 'acf-pro-features-free'); ?></span>
                                <?php else: ?>
                                    <span style="color: red;">✗ <?php esc_html_e('Inactivo', 'acf-pro-features-free'); ?></span>
                                <?php endif; ?>
                            </td>
                            <td><?php esc_html_e('Plugin base requerido', 'acf-pro-features-free'); ?></td>
                        </tr>
                        <tr>
                            <td><strong><?php esc_html_e('ACF PRO', 'acf-pro-features-free'); ?></strong></td>
                            <td>
                                <?php if ($acf_pro_active): ?>
                                    <span style="color: orange;">⚠ <?php esc_html_e('Activo (No necesario)', 'acf-pro-features-free'); ?></span>
                                <?php else: ?>
                                    <span style="color: green;">✓ <?php esc_html_e('Reemplazado por este plugin', 'acf-pro-features-free'); ?></span>
                                <?php endif; ?>
                            </td>
                            <td><?php esc_html_e('Este plugin reemplaza ACF PRO', 'acf-pro-features-free'); ?></td>
                        </tr>
                        <tr>
                            <td><strong><?php esc_html_e('WPGraphQL', 'acf-pro-features-free'); ?></strong></td>
                            <td>
                                <?php if ($graphql_active): ?>
                                    <span style="color: green;">✓ <?php esc_html_e('Activo', 'acf-pro-features-free'); ?></span>
                                <?php else: ?>
                                    <span style="color: orange;">⚠ <?php esc_html_e('Opcional', 'acf-pro-features-free'); ?></span>
                                <?php endif; ?>
                            </td>
                            <td><?php esc_html_e('Para integración GraphQL', 'acf-pro-features-free'); ?></td>
                        </tr>
                        <tr>
                            <td><strong><?php esc_html_e('WPGraphQL for ACF', 'acf-pro-features-free'); ?></strong></td>
                            <td>
                                <?php if ($graphql_acf_active): ?>
                                    <span style="color: green;">✓ <?php esc_html_e('Activo', 'acf-pro-features-free'); ?></span>
                                <?php else: ?>
                                    <span style="color: orange;">⚠ <?php esc_html_e('Opcional', 'acf-pro-features-free'); ?></span>
                                <?php endif; ?>
                            </td>
                            <td><?php esc_html_e('Para exponer campos ACF en GraphQL', 'acf-pro-features-free'); ?></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="acf-pro-features-features" style="margin-top: 30px;">
                <h2><?php esc_html_e('Funcionalidades Disponibles', 'acf-pro-features-free'); ?></h2>
                
                <div class="feature-list">
                    <div class="feature-item">
                        <h3>✓ <?php esc_html_e('Campo Repeater', 'acf-pro-features-free'); ?></h3>
                        <p><?php esc_html_e('Crea campos repetibles con sub-campos. Perfecto para listas, galerías y contenido estructurado.', 'acf-pro-features-free'); ?></p>
                    </div>
                    
                    <div class="feature-item">
                        <h3>✓ <?php esc_html_e('Campo Flexible Content', 'acf-pro-features-free'); ?></h3>
                        <p><?php esc_html_e('Crea layouts flexibles con diferentes secciones. Ideal para páginas con contenido modular.', 'acf-pro-features-free'); ?></p>
                    </div>
                    
                    <div class="feature-item">
                        <h3>✓ <?php esc_html_e('Campo Clone', 'acf-pro-features-free'); ?></h3>
                        <p><?php esc_html_e('Clona campos o grupos de campos existentes. Útil para reutilizar configuraciones.', 'acf-pro-features-free'); ?></p>
                    </div>
                    
                    <div class="feature-item">
                        <h3>✓ <?php esc_html_e('Integración GraphQL', 'acf-pro-features-free'); ?></h3>
                        <p><?php esc_html_e('Todos los campos son compatibles con GraphQL y se exponen automáticamente.', 'acf-pro-features-free'); ?></p>
                    </div>
                </div>
            </div>
            
            <div class="acf-pro-features-info" style="margin-top: 30px; padding: 20px; background: #f0f0f1; border-left: 4px solid #2271b1;">
                <h3><?php esc_html_e('Información', 'acf-pro-features-free'); ?></h3>
                <p>
                    <?php esc_html_e('Este plugin recrea las funcionalidades de ACF PRO de forma gratuita y segura. No requiere licencia y es 100% compatible con ACF gratuito.', 'acf-pro-features-free'); ?>
                </p>
                <p>
                    <strong><?php esc_html_e('Versión:', 'acf-pro-features-free'); ?></strong> <?php echo esc_html(ACF_PRO_FEATURES_VERSION); ?>
                </p>
            </div>
        </div>
        
        <style>
        .acf-pro-features-status table {
            margin-top: 20px;
        }
        .feature-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .feature-item {
            padding: 20px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .feature-item h3 {
            margin-top: 0;
            color: #2271b1;
        }
        </style>
        <?php
    }
}

