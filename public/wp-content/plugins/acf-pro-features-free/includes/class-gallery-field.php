<?php
/**
 * Campo Gallery para ACF
 * 
 * Recrea la funcionalidad del campo Gallery de ACF PRO
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Clase del campo Gallery
 */
class ACF_Pro_Features_Gallery_Field extends acf_field {
    
    /**
     * Inicializar
     */
    function initialize() {
        $this->name = 'gallery';
        $this->label = __('Gallery', 'acf-pro-features-free');
        $this->category = 'content';
        $this->description = __('Gestiona colecciones de imágenes de manera intuitiva', 'acf-pro-features-free');
        $this->defaults = array(
            'return_format' => 'array',
            'preview_size' => 'medium',
            'insert' => 'append',
            'library' => 'all',
            'min' => 0,
            'max' => 0,
            'min_width' => 0,
            'min_height' => 0,
            'min_size' => 0,
            'max_width' => 0,
            'max_height' => 0,
            'max_size' => 0,
            'mime_types' => '',
        );
        $this->pro = false;
        $this->public = true;
        
        // AJAX actions
        add_action('wp_ajax_acf/fields/gallery/get_attachment', array($this, 'ajax_get_attachment'));
        add_action('wp_ajax_nopriv_acf/fields/gallery/get_attachment', array($this, 'ajax_get_attachment'));
        
        add_action('wp_ajax_acf/fields/gallery/update_attachment', array($this, 'ajax_update_attachment'));
        add_action('wp_ajax_nopriv_acf/fields/gallery/update_attachment', array($this, 'ajax_update_attachment'));
        
        add_action('wp_ajax_acf/fields/gallery/get_sort_order', array($this, 'ajax_get_sort_order'));
        add_action('wp_ajax_nopriv_acf/fields/gallery/get_sort_order', array($this, 'ajax_get_sort_order'));
    }
    
    /**
     * Enqueue scripts
     */
    function input_admin_enqueue_scripts() {
        // Enqueue uploader si está disponible
        if (function_exists('acf_get_setting')) {
            $uploader = acf_get_setting('uploader');
            if ($uploader === 'wp' && function_exists('acf_enqueue_uploader')) {
                acf_enqueue_uploader();
            }
        }
    }
    
    /**
     * AJAX: Obtener attachment
     */
    function ajax_get_attachment() {
        // Validar nonce (ACF usa 'acf_nonce' o podemos verificar de otra forma)
        $nonce = isset($_POST['nonce']) ? sanitize_text_field($_POST['nonce']) : '';
        if (!wp_verify_nonce($nonce, 'acf_nonce') && !wp_verify_nonce($nonce, 'acf_pro_features_nonce')) {
            wp_die(__('Error de seguridad', 'acf-pro-features-free'));
        }
        
        $id = isset($_POST['id']) ? absint($_POST['id']) : 0;
        $field_key = isset($_POST['field_key']) ? sanitize_text_field($_POST['field_key']) : '';
        
        if (!$id) {
            wp_die(__('ID de imagen no válido', 'acf-pro-features-free'));
        }
        
        // Verificar permisos
        if (!current_user_can('edit_post', $id)) {
            wp_die(__('No tienes permisos para editar esta imagen', 'acf-pro-features-free'));
        }
        
        // Cargar field
        $field = function_exists('acf_get_field') ? acf_get_field($field_key) : null;
        if (!$field) {
            $field = array();
        }
        
        // Renderizar
        $this->render_attachment_sidebar($id, $field);
        die();
    }
    
    /**
     * AJAX: Actualizar attachment
     */
    function ajax_update_attachment() {
        // Validar nonce
        $nonce = isset($_POST['nonce']) ? sanitize_text_field($_POST['nonce']) : '';
        if (!wp_verify_nonce($nonce, 'acf_nonce') && !wp_verify_nonce($nonce, 'acf_pro_features_nonce')) {
            wp_send_json_error(array('message' => __('Error de seguridad', 'acf-pro-features-free')));
        }
        
        if (empty($_POST['attachments']) || !is_array($_POST['attachments'])) {
            wp_send_json_error(array('message' => __('No se proporcionaron attachments', 'acf-pro-features-free')));
        }
        
        // Procesar cada attachment
        foreach ($_POST['attachments'] as $id => $changes) {
            $id = absint($id);
            
            if (!$id || !current_user_can('edit_post', $id)) {
                wp_send_json_error(array('message' => __('No tienes permisos para editar esta imagen', 'acf-pro-features-free')));
            }
            
            $post = get_post($id, ARRAY_A);
            if (!$post || $post['post_type'] !== 'attachment') {
                wp_send_json_error(array('message' => __('Imagen no encontrada', 'acf-pro-features-free')));
            }
            
            // Sanitizar y actualizar campos
            if (isset($changes['title']) && is_string($changes['title'])) {
                $post['post_title'] = sanitize_text_field($changes['title']);
            }
            if (isset($changes['caption']) && is_string($changes['caption'])) {
                $post['post_excerpt'] = sanitize_textarea_field($changes['caption']);
            }
            if (isset($changes['description']) && is_string($changes['description'])) {
                $post['post_content'] = wp_kses_post($changes['description']);
            }
            if (isset($changes['alt']) && is_string($changes['alt'])) {
                $alt = sanitize_text_field($changes['alt']);
                $alt = wp_strip_all_tags($alt, true);
                update_post_meta($id, '_wp_attachment_image_alt', wp_slash($alt));
            }
            
            // Guardar
            wp_update_post($post);
            
            // Aplicar filtros
            if (function_exists('apply_filters')) {
                $post = apply_filters('attachment_fields_to_save', $post, $changes);
            }
        }
        
        wp_send_json_success();
    }
    
    /**
     * AJAX: Obtener orden de clasificación
     */
    function ajax_get_sort_order() {
        // Validar nonce
        $nonce = isset($_POST['nonce']) ? sanitize_text_field($_POST['nonce']) : '';
        if (!wp_verify_nonce($nonce, 'acf_nonce') && !wp_verify_nonce($nonce, 'acf_pro_features_nonce')) {
            wp_send_json_error(array('message' => __('Error de seguridad', 'acf-pro-features-free')));
        }
        
        $ids = isset($_POST['ids']) ? $_POST['ids'] : array();
        $sort = isset($_POST['sort']) ? sanitize_text_field($_POST['sort']) : 'date';
        
        // Validar que sort sea un valor permitido
        $allowed_sorts = array('date', 'modified', 'title', 'reverse');
        if (!in_array($sort, $allowed_sorts, true)) {
            $sort = 'date';
        }
        
        if (empty($ids) || !is_array($ids)) {
            wp_send_json_error(array('message' => __('No se proporcionaron IDs válidos', 'acf-pro-features-free')));
        }
        
        // Sanitizar IDs
        $ids = array_map('absint', $ids);
        $ids = array_filter($ids);
        
        if (empty($ids)) {
            wp_send_json_error(array('message' => __('No se proporcionaron IDs válidos', 'acf-pro-features-free')));
        }
        
        // Revertir orden
        if ($sort === 'reverse') {
            $ids = array_reverse($ids);
            wp_send_json_success($ids);
        }
        
        // Ordenar
        $order = ($sort === 'title') ? 'ASC' : 'DESC';
        
        $posts = get_posts(array(
            'post_type' => 'attachment',
            'numberposts' => -1,
            'post_status' => 'any',
            'post__in' => $ids,
            'order' => $order,
            'orderby' => $sort,
            'fields' => 'ids'
        ));
        
        if (!empty($posts)) {
            wp_send_json_success($posts);
        }
        
        wp_send_json_error(array('message' => __('No se encontraron imágenes', 'acf-pro-features-free')));
    }
    
    /**
     * Renderizar sidebar de attachment
     */
    private function render_attachment_sidebar($id, $field) {
        if (!function_exists('wp_prepare_attachment_for_js')) {
            return;
        }
        
        $attachment = wp_prepare_attachment_for_js($id);
        if (!$attachment) {
            return;
        }
        
        $thumb = '';
        if (isset($attachment['thumb']['src'])) {
            $thumb = $attachment['thumb']['src'];
        } elseif (isset($attachment['sizes']['thumbnail']['url'])) {
            $thumb = $attachment['sizes']['thumbnail']['url'];
        } elseif ($attachment['type'] === 'image') {
            $thumb = $attachment['url'];
        } else {
            $thumb = wp_mime_type_icon();
        }
        
        $dimensions = '';
        if ($attachment['type'] === 'audio' && isset($attachment['fileLength'])) {
            $dimensions = __('Length', 'acf-pro-features-free') . ': ' . $attachment['fileLength'];
        } elseif (!empty($attachment['width'])) {
            $dimensions = $attachment['width'] . ' x ' . $attachment['height'];
        }
        if (!empty($attachment['filesizeHumanReadable'])) {
            $dimensions .= ' (' . $attachment['filesizeHumanReadable'] . ')';
        }
        
        $prefix = 'attachments[' . $id . ']';
        
        ?>
        <div class="acf-gallery-side-info">
            <img src="<?php echo esc_url($thumb); ?>" alt="<?php echo esc_attr($attachment['alt']); ?>" />
            <p class="filename"><strong><?php echo esc_html($attachment['filename']); ?></strong></p>
            <p class="uploaded"><?php echo esc_html($attachment['dateFormatted']); ?></p>
            <?php if ($dimensions): ?>
                <p class="dimensions"><?php echo esc_html($dimensions); ?></p>
            <?php endif; ?>
            <p class="actions">
                <a href="#" class="acf-gallery-edit" data-id="<?php echo esc_attr($id); ?>"><?php esc_html_e('Edit', 'acf-pro-features-free'); ?></a>
                <a href="#" class="acf-gallery-remove" data-id="<?php echo esc_attr($id); ?>"><?php esc_html_e('Remove', 'acf-pro-features-free'); ?></a>
            </p>
        </div>
        <table class="form-table">
            <tbody>
                <?php if (function_exists('acf_render_field_wrap')): ?>
                    <?php
                    acf_render_field_wrap(array(
                        'name' => 'title',
                        'prefix' => $prefix,
                        'type' => 'text',
                        'label' => __('Title', 'acf-pro-features-free'),
                        'value' => $attachment['title']
                    ), 'tr');
                    
                    acf_render_field_wrap(array(
                        'name' => 'caption',
                        'prefix' => $prefix,
                        'type' => 'textarea',
                        'label' => __('Caption', 'acf-pro-features-free'),
                        'value' => $attachment['caption']
                    ), 'tr');
                    
                    acf_render_field_wrap(array(
                        'name' => 'alt',
                        'prefix' => $prefix,
                        'type' => 'text',
                        'label' => __('Alt Text', 'acf-pro-features-free'),
                        'value' => $attachment['alt']
                    ), 'tr');
                    
                    acf_render_field_wrap(array(
                        'name' => 'description',
                        'prefix' => $prefix,
                        'type' => 'textarea',
                        'label' => __('Description', 'acf-pro-features-free'),
                        'value' => $attachment['description']
                    ), 'tr');
                    ?>
                <?php else: ?>
                    <tr>
                        <th><label><?php esc_html_e('Title', 'acf-pro-features-free'); ?></label></th>
                        <td><input type="text" name="<?php echo esc_attr($prefix); ?>[title]" value="<?php echo esc_attr($attachment['title']); ?>" /></td>
                    </tr>
                    <tr>
                        <th><label><?php esc_html_e('Caption', 'acf-pro-features-free'); ?></label></th>
                        <td><textarea name="<?php echo esc_attr($prefix); ?>[caption]"><?php echo esc_textarea($attachment['caption']); ?></textarea></td>
                    </tr>
                    <tr>
                        <th><label><?php esc_html_e('Alt Text', 'acf-pro-features-free'); ?></label></th>
                        <td><input type="text" name="<?php echo esc_attr($prefix); ?>[alt]" value="<?php echo esc_attr($attachment['alt']); ?>" /></td>
                    </tr>
                    <tr>
                        <th><label><?php esc_html_e('Description', 'acf-pro-features-free'); ?></label></th>
                        <td><textarea name="<?php echo esc_attr($prefix); ?>[description]"><?php echo esc_textarea($attachment['description']); ?></textarea></td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
        <?php
    }
    
    /**
     * Renderizar campo
     */
    function render_field($field) {
        // Obtener valor
        $post_id = isset($field['ID']) ? $field['ID'] : 0;
        if (function_exists('acf_get_setting') && acf_get_setting('current_post_id')) {
            $post_id = acf_get_setting('current_post_id');
        }
        $value = $this->load_value(array(), $post_id, $field);
        
        if (empty($value) || !is_array($value)) {
            $value = array();
        }
        
        // Asegurar que todos los valores sean numéricos
        $value = array_filter(array_map('intval', $value));
        
        $field_key = $field['key'];
        $field_name = $field['name'];
        $preview_size = isset($field['preview_size']) ? $field['preview_size'] : 'medium';
        $min = isset($field['min']) ? intval($field['min']) : 0;
        $max = isset($field['max']) ? intval($field['max']) : 0;
        $insert = isset($field['insert']) ? $field['insert'] : 'append';
        $library = isset($field['library']) ? $field['library'] : 'all';
        $mime_types = isset($field['mime_types']) ? $field['mime_types'] : '';
        
        ?>
        <div class="acf-gallery" 
             data-key="<?php echo esc_attr($field_key); ?>"
             data-name="<?php echo esc_attr($field_name); ?>"
             data-preview-size="<?php echo esc_attr($preview_size); ?>"
             data-min="<?php echo esc_attr($min); ?>"
             data-max="<?php echo esc_attr($max); ?>"
             data-insert="<?php echo esc_attr($insert); ?>"
             data-library="<?php echo esc_attr($library); ?>"
             data-mime-types="<?php echo esc_attr($mime_types); ?>">
            
            <!-- Input oculto con los IDs de las imágenes -->
            <input type="hidden" 
                   name="<?php echo esc_attr($field_name); ?>" 
                   value="<?php echo esc_attr(implode(',', $value)); ?>" 
                   class="acf-gallery-value" />
            
            <!-- Contenedor de la galería -->
            <div class="acf-gallery-main">
                <div class="acf-gallery-attachments">
                    <?php if (!empty($value)): ?>
                        <?php foreach ($value as $image_id): ?>
                            <?php $this->render_attachment($image_id, $preview_size, $field_key); ?>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <div class="acf-gallery-empty">
                            <p><?php esc_html_e('No hay imágenes seleccionadas', 'acf-pro-features-free'); ?></p>
                        </div>
                    <?php endif; ?>
                </div>
                
                <!-- Botones de acción -->
                <div class="acf-gallery-toolbar">
                    <ul class="acf-hl">
                        <li>
                            <a href="#" class="acf-button button button-primary acf-gallery-add">
                                <?php esc_html_e('Add to gallery', 'acf-pro-features-free'); ?>
                            </a>
                        </li>
                        <?php if (!empty($value)): ?>
                            <li class="acf-fr">
                                <select class="acf-gallery-sort">
                                    <option value=""><?php esc_html_e('Bulk actions', 'acf-pro-features-free'); ?></option>
                                    <option value="date"><?php esc_html_e('Sort by date uploaded', 'acf-pro-features-free'); ?></option>
                                    <option value="modified"><?php esc_html_e('Sort by date modified', 'acf-pro-features-free'); ?></option>
                                    <option value="title"><?php esc_html_e('Sort by title', 'acf-pro-features-free'); ?></option>
                                    <option value="reverse"><?php esc_html_e('Reverse current order', 'acf-pro-features-free'); ?></option>
                                </select>
                            </li>
                        <?php endif; ?>
                    </ul>
                </div>
            </div>
            
            <!-- Sidebar para editar imágenes -->
            <div class="acf-gallery-side">
                <div class="acf-gallery-side-inner">
                    <div class="acf-gallery-side-data"></div>
                    <div class="acf-gallery-toolbar">
                        <ul class="acf-hl">
                            <li>
                                <a href="#" class="acf-button button acf-gallery-close">
                                    <?php esc_html_e('Close', 'acf-pro-features-free'); ?>
                                </a>
                            </li>
                            <li class="acf-fr">
                                <a class="acf-button button button-primary acf-gallery-update" href="#">
                                    <?php esc_html_e('Update', 'acf-pro-features-free'); ?>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }
    
    /**
     * Renderizar attachment individual
     */
    private function render_attachment($image_id, $preview_size, $field_key) {
        if (!is_numeric($image_id)) {
            return;
        }
        
        $image = wp_get_attachment_image_src($image_id, $preview_size);
        if (!$image) {
            return;
        }
        
        $image_alt = get_post_meta($image_id, '_wp_attachment_image_alt', true);
        $image_title = get_the_title($image_id);
        
        // Obtener thumbnail mejorado
        $thumbnail = wp_get_attachment_image_src($image_id, 'medium');
        $image_url = $thumbnail ? $thumbnail[0] : $image[0];
        
        ?>
        <div class="acf-gallery-attachment" data-id="<?php echo esc_attr($image_id); ?>">
            <input type="hidden" name="acf[<?php echo esc_attr($field_key); ?>][]" value="<?php echo esc_attr($image_id); ?>" />
            <div class="margin">
                <div class="thumbnail">
                    <img src="<?php echo esc_url($image_url); ?>" 
                         alt="<?php echo esc_attr($image_alt); ?>" 
                         title="<?php echo esc_attr($image_title); ?>" />
                </div>
            </div>
            <div class="actions">
                <a href="#" class="acf-icon -cancel dark acf-gallery-remove" 
                   data-id="<?php echo esc_attr($image_id); ?>" 
                   title="<?php esc_attr_e('Remove', 'acf-pro-features-free'); ?>"></a>
            </div>
        </div>
        <?php
    }
    
    /**
     * Cargar valor
     */
    function load_value($value, $post_id, $field) {
        if (!empty($value) && is_array($value)) {
            // Sanitizar valores existentes
            return array_map('absint', array_filter($value, 'is_numeric'));
        }
        
        $field_name = isset($field['name']) ? sanitize_key($field['name']) : '';
        if (empty($field_name)) {
            return array();
        }
        
        $meta_value = get_post_meta($post_id, $field_name, true);
        
        if (empty($meta_value)) {
            return array();
        }
        
        // Si es un string (IDs separados por coma), convertir a array
        if (is_string($meta_value)) {
            $ids = explode(',', $meta_value);
            return array_map('absint', array_filter($ids, 'is_numeric'));
        }
        
        // Si es un array, sanitizar y retornar
        if (is_array($meta_value)) {
            return array_map('absint', array_filter($meta_value, 'is_numeric'));
        }
        
        return array();
    }
    
    /**
     * Actualizar valor
     */
    function update_value($value, $post_id, $field) {
        // Si es un string (IDs separados por coma), convertir a array
        if (is_string($value)) {
            $value = explode(',', $value);
            $value = array_filter(array_map('trim', $value));
        }
        
        // Asegurar que todos los valores sean enteros positivos
        if (is_array($value)) {
            $value = array_map('absint', $value);
            $value = array_filter($value, function($id) {
                return $id > 0;
            });
            $value = array_values($value);
            
            // Validar límites
            $min = isset($field['min']) ? absint($field['min']) : 0;
            $max = isset($field['max']) ? absint($field['max']) : 0;
            
            if ($min > 0 && count($value) < $min) {
                // No lanzar error, solo ajustar
            }
            
            if ($max > 0 && count($value) > $max) {
                $value = array_slice($value, 0, $max);
            }
            
            // Guardar como cadena de IDs separados por coma para simplificar
            return !empty($value) ? implode(',', $value) : '';
        }
        
        return '';
    }
    
    /**
     * Formatear valor
     */
    function format_value($value, $post_id, $field) {
        if (empty($value) || !is_array($value)) {
            return false;
        }
        
        $return_format = isset($field['return_format']) ? $field['return_format'] : 'array';
        
        switch ($return_format) {
            case 'id':
                return $value;
                
            case 'url':
                $urls = array();
                foreach ($value as $image_id) {
                    $url = wp_get_attachment_image_url($image_id, 'full');
                    if ($url) {
                        $urls[] = $url;
                    }
                }
                return $urls;
                
            case 'array':
            default:
                $images = array();
                foreach ($value as $image_id) {
                    $image = wp_get_attachment_image_src($image_id, 'full');
                    if ($image) {
                        $images[] = array(
                            'ID' => $image_id,
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
                return $images;
        }
    }
    
    /**
     * Renderizar configuración del campo
     */
    function render_field_settings($field) {
        // Return Format
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Return Format', 'acf-pro-features-free'),
                'instructions' => __('Especifica el formato de retorno', 'acf-pro-features-free'),
                'name' => 'return_format',
                'type' => 'radio',
                'layout' => 'horizontal',
                'choices' => array(
                    'array' => __('Image Array', 'acf-pro-features-free'),
                    'url' => __('Image URL', 'acf-pro-features-free'),
                    'id' => __('Image ID', 'acf-pro-features-free'),
                ),
                'default_value' => 'array',
            )
        );
        
        // Preview Size
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Preview Size', 'acf-pro-features-free'),
                'instructions' => __('Tamaño de la imagen en la vista previa', 'acf-pro-features-free'),
                'name' => 'preview_size',
                'type' => 'select',
                'choices' => acf_get_image_sizes(),
                'default_value' => 'medium',
            )
        );
        
        // Insert
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Insert', 'acf-pro-features-free'),
                'instructions' => __('Especifica dónde se agregan nuevas imágenes', 'acf-pro-features-free'),
                'name' => 'insert',
                'type' => 'select',
                'choices' => array(
                    'append' => __('Append to the end', 'acf-pro-features-free'),
                    'prepend' => __('Prepend to the beginning', 'acf-pro-features-free'),
                ),
                'default_value' => 'append',
            )
        );
        
        // Library
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Library', 'acf-pro-features-free'),
                'instructions' => __('Limitar la biblioteca de medios', 'acf-pro-features-free'),
                'name' => 'library',
                'type' => 'radio',
                'layout' => 'horizontal',
                'choices' => array(
                    'all' => __('All', 'acf-pro-features-free'),
                    'uploadedTo' => __('Uploaded to post', 'acf-pro-features-free'),
                ),
                'default_value' => 'all',
            )
        );
        
        // Min
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Mínimo', 'acf-pro-features-free'),
                'instructions' => __('Número mínimo de imágenes', 'acf-pro-features-free'),
                'name' => 'min',
                'type' => 'number',
                'default_value' => 0,
            )
        );
        
        // Max
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Máximo', 'acf-pro-features-free'),
                'instructions' => __('Número máximo de imágenes', 'acf-pro-features-free'),
                'name' => 'max',
                'type' => 'number',
                'default_value' => 0,
            )
        );
        
        // Min Width/Height/Size
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Restricciones Mínimas', 'acf-pro-features-free'),
                'instructions' => __('Restringe qué imágenes se pueden subir', 'acf-pro-features-free'),
                'type' => 'text',
                'name' => 'min_width',
                'prepend' => __('Width', 'acf-pro-features-free'),
                'append' => 'px',
            )
        );
        
        acf_render_field_setting(
            $field,
            array(
                'label' => '',
                'type' => 'text',
                'name' => 'min_height',
                'prepend' => __('Height', 'acf-pro-features-free'),
                'append' => 'px',
                '_append' => 'min_width',
            )
        );
        
        acf_render_field_setting(
            $field,
            array(
                'label' => '',
                'type' => 'text',
                'name' => 'min_size',
                'prepend' => __('File size', 'acf-pro-features-free'),
                'append' => 'MB',
                '_append' => 'min_width',
            )
        );
        
        // Max Width/Height/Size
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Restricciones Máximas', 'acf-pro-features-free'),
                'instructions' => __('Restringe qué imágenes se pueden subir', 'acf-pro-features-free'),
                'type' => 'text',
                'name' => 'max_width',
                'prepend' => __('Width', 'acf-pro-features-free'),
                'append' => 'px',
            )
        );
        
        acf_render_field_setting(
            $field,
            array(
                'label' => '',
                'type' => 'text',
                'name' => 'max_height',
                'prepend' => __('Height', 'acf-pro-features-free'),
                'append' => 'px',
                '_append' => 'max_width',
            )
        );
        
        acf_render_field_setting(
            $field,
            array(
                'label' => '',
                'type' => 'text',
                'name' => 'max_size',
                'prepend' => __('File size', 'acf-pro-features-free'),
                'append' => 'MB',
                '_append' => 'max_width',
            )
        );
        
        // MIME Types
        acf_render_field_setting(
            $field,
            array(
                'label' => __('Tipos de archivo permitidos', 'acf-pro-features-free'),
                'instructions' => __('Lista separada por comas. Dejar en blanco para todos los tipos', 'acf-pro-features-free'),
                'type' => 'text',
                'name' => 'mime_types',
                'placeholder' => 'jpg, png, gif',
            )
        );
    }
    
    /**
     * Validar valor
     */
    function validate_value($valid, $value, $field, $input) {
        // Si está vacío y no es requerido, está bien
        if (empty($value) || !is_array($value)) {
            $value = array();
        }
        
        // Sanitizar el label del campo para evitar XSS
        $field_label = isset($field['label']) ? esc_html($field['label']) : __('Campo', 'acf-pro-features-free');
        
        // Validar mínimo de imágenes
        $min = isset($field['min']) ? absint($field['min']) : 0;
        if ($min > 0 && count($value) < $min) {
            $valid = sprintf(
                _n('%s requiere al menos %s imagen', '%s requiere al menos %s imágenes', $min, 'acf-pro-features-free'),
                $field_label,
                number_format_i18n($min)
            );
            return $valid;
        }
        
        // Validar máximo de imágenes
        $max = isset($field['max']) ? absint($field['max']) : 0;
        if ($max > 0 && count($value) > $max) {
            $valid = sprintf(
                _n('%s permite máximo %s imagen', '%s permite máximo %s imágenes', $max, 'acf-pro-features-free'),
                $field_label,
                number_format_i18n($max)
            );
            return $valid;
        }
        
        // Validar cada imagen
        foreach ($value as $image_id) {
            $image_id = absint($image_id);
            
            if (!$image_id) {
                continue;
            }
            
            $image_path = get_attached_file($image_id);
            if (!$image_path || !file_exists($image_path)) {
                continue;
            }
            
            // Obtener información de la imagen
            $image_meta = wp_get_attachment_metadata($image_id);
            if (!$image_meta) {
                continue;
            }
            
            $file_size = @filesize($image_path);
            if ($file_size === false) {
                continue;
            }
            
            // Validar dimensiones mínimas
            $min_width = isset($field['min_width']) ? absint($field['min_width']) : 0;
            $min_height = isset($field['min_height']) ? absint($field['min_height']) : 0;
            
            if ($min_width > 0 || $min_height > 0) {
                $width = isset($image_meta['width']) ? absint($image_meta['width']) : 0;
                $height = isset($image_meta['height']) ? absint($image_meta['height']) : 0;
                
                if ($min_width > 0 && $width < $min_width) {
                    $valid = sprintf(
                        __('%s: La imagen debe tener al menos %spx de ancho. La imagen actual tiene %spx.', 'acf-pro-features-free'),
                        $field_label,
                        number_format_i18n($min_width),
                        number_format_i18n($width)
                    );
                    return $valid;
                }
                
                if ($min_height > 0 && $height < $min_height) {
                    $valid = sprintf(
                        __('%s: La imagen debe tener al menos %spx de alto. La imagen actual tiene %spx.', 'acf-pro-features-free'),
                        $field_label,
                        number_format_i18n($min_height),
                        number_format_i18n($height)
                    );
                    return $valid;
                }
            }
            
            // Validar dimensiones máximas
            $max_width = isset($field['max_width']) ? absint($field['max_width']) : 0;
            $max_height = isset($field['max_height']) ? absint($field['max_height']) : 0;
            
            if ($max_width > 0 || $max_height > 0) {
                $width = isset($image_meta['width']) ? absint($image_meta['width']) : 0;
                $height = isset($image_meta['height']) ? absint($image_meta['height']) : 0;
                
                if ($max_width > 0 && $width > $max_width) {
                    $valid = sprintf(
                        __('%s: La imagen no debe exceder %spx de ancho. La imagen actual tiene %spx.', 'acf-pro-features-free'),
                        $field_label,
                        number_format_i18n($max_width),
                        number_format_i18n($width)
                    );
                    return $valid;
                }
                
                if ($max_height > 0 && $height > $max_height) {
                    $valid = sprintf(
                        __('%s: La imagen no debe exceder %spx de alto. La imagen actual tiene %spx.', 'acf-pro-features-free'),
                        $field_label,
                        number_format_i18n($max_height),
                        number_format_i18n($height)
                    );
                    return $valid;
                }
            }
            
            // Validar tamaño de archivo mínimo
            $min_size = isset($field['min_size']) ? floatval($field['min_size']) : 0;
            if ($min_size > 0) {
                $file_size_mb = $file_size / (1024 * 1024);
                if ($file_size_mb < $min_size) {
                    $valid = sprintf(
                        __('%s: El archivo debe tener al menos %sMB. El archivo actual tiene %sMB.', 'acf-pro-features-free'),
                        $field_label,
                        number_format_i18n($min_size, 2),
                        number_format_i18n($file_size_mb, 2)
                    );
                    return $valid;
                }
            }
            
            // Validar tamaño de archivo máximo
            $max_size = isset($field['max_size']) ? floatval($field['max_size']) : 0;
            if ($max_size > 0) {
                $file_size_mb = $file_size / (1024 * 1024);
                if ($file_size_mb > $max_size) {
                    $valid = sprintf(
                        __('%s: El archivo no debe exceder %sMB. El archivo actual tiene %sMB.', 'acf-pro-features-free'),
                        $field_label,
                        number_format_i18n($max_size, 2),
                        number_format_i18n($file_size_mb, 2)
                    );
                    return $valid;
                }
            }
            
            // Validar tipos MIME
            $mime_types = isset($field['mime_types']) ? sanitize_text_field(trim($field['mime_types'])) : '';
            if (!empty($mime_types)) {
                $allowed_types = array_map('trim', explode(',', $mime_types));
                $allowed_types = array_map('sanitize_text_field', $allowed_types);
                $allowed_types = array_filter($allowed_types);
                
                $file_mime = get_post_mime_type($image_id);
                if (!$file_mime) {
                    continue;
                }
                
                // Convertir extensiones a tipos MIME si es necesario
                $mime_map = array(
                    'jpg' => 'image/jpeg',
                    'jpeg' => 'image/jpeg',
                    'png' => 'image/png',
                    'gif' => 'image/gif',
                    'webp' => 'image/webp',
                    'svg' => 'image/svg+xml',
                );
                
                $allowed_mimes = array();
                foreach ($allowed_types as $type) {
                    $type = strtolower($type);
                    if (isset($mime_map[$type])) {
                        $allowed_mimes[] = $mime_map[$type];
                    } else {
                        // Si ya es un tipo MIME válido, usarlo directamente
                        if (preg_match('/^[a-z]+\/[a-z0-9\-\+\.]+$/i', $type)) {
                            $allowed_mimes[] = $type;
                        }
                    }
                }
                
                if (!empty($allowed_mimes) && !in_array($file_mime, $allowed_mimes, true)) {
                    $valid = sprintf(
                        __('%s: El tipo de archivo no está permitido. Tipos permitidos: %s', 'acf-pro-features-free'),
                        $field_label,
                        esc_html(implode(', ', $allowed_types))
                    );
                    return $valid;
                }
            }
        }
        
        return $valid;
    }
}

