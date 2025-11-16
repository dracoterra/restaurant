<?php
// Los valores se pasan desde el método render_services_sections
// Asegurar que la variable esté definida
$services = $services ?? array();
?>

<div class="restaurant-sections-container">
    <style>
        .restaurant-sections-container {
            padding: 20px 0;
        }
        .restaurant-section {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #ddd;
            background: #f9f9f9;
        }
        .restaurant-section h3 {
            margin-top: 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #0073aa;
        }
        .restaurant-field {
            margin-bottom: 15px;
        }
        .restaurant-field label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .restaurant-field input[type="text"],
        .restaurant-field textarea {
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
        }
        .restaurant-field textarea {
            min-height: 100px;
        }
    </style>

    <!-- Services Section -->
    <div class="restaurant-section">
        <h3><?php _e('Services Section', 'restaurant'); ?></h3>
        
        <div class="restaurant-field">
            <label for="services_subtitle"><?php _e('Services Subtitle', 'restaurant'); ?></label>
            <input type="text" 
                   id="services_subtitle" 
                   name="restaurant_services_section[subtitle]" 
                   value="<?php echo esc_attr($services['subtitle'] ?? ''); ?>" 
                   placeholder="our services">
        </div>
        
        <div class="restaurant-field">
            <label for="services_title"><?php _e('Services Title', 'restaurant'); ?></label>
            <input type="text" 
                   id="services_title" 
                   name="restaurant_services_section[title]" 
                   value="<?php echo esc_attr($services['title'] ?? ''); ?>" 
                   placeholder="What we offer">
        </div>
        
        <div class="restaurant-field">
            <label for="services_description"><?php _e('Services Description', 'restaurant'); ?></label>
            <textarea id="services_description" 
                      name="restaurant_services_section[description]" 
                      placeholder="We provide exceptional dining experiences..."><?php echo esc_textarea($services['description'] ?? ''); ?></textarea>
        </div>
    </div>
</div>

