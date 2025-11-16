<?php
// Los valores se pasan desde el método render_home_sections
// Asegurar que las variables estén definidas
$hero = $hero ?? array();
$about = $about ?? array();
$dishes = $dishes ?? array();
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
        .restaurant-upload-image {
            margin-top: 10px;
        }
        .restaurant-image-preview {
            margin-top: 10px;
        }
        .restaurant-image-preview img {
            max-width: 200px;
            height: auto;
            display: block;
        }
    </style>

    <!-- Hero Section -->
    <div class="restaurant-section">
        <h3><?php _e('Hero Section', 'restaurant'); ?></h3>
        
        <div class="restaurant-field">
            <label for="hero_subtitle"><?php _e('Hero Subtitle', 'restaurant'); ?></label>
            <input type="text" 
                   id="hero_subtitle" 
                   name="restaurant_hero_section[subtitle]" 
                   value="<?php echo esc_attr($hero['subtitle'] ?? ''); ?>" 
                   placeholder="art of fine dining">
        </div>
        
        <div class="restaurant-field">
            <label for="hero_title"><?php _e('Hero Title', 'restaurant'); ?></label>
            <input type="text" 
                   id="hero_title" 
                   name="restaurant_hero_section[title]" 
                   value="<?php echo esc_attr($hero['title'] ?? ''); ?>" 
                   placeholder="Dining redefined with every bite">
        </div>
        
        <div class="restaurant-field">
            <label for="hero_description"><?php _e('Hero Description', 'restaurant'); ?></label>
            <textarea id="hero_description" 
                      name="restaurant_hero_section[description]" 
                      placeholder="Immerse yourself in a dining experience..."><?php echo esc_textarea($hero['description'] ?? ''); ?></textarea>
        </div>
        
        <div class="restaurant-field">
            <label for="hero_main_image"><?php _e('Hero Main Image', 'restaurant'); ?></label>
            <input type="hidden" 
                   id="hero_main_image" 
                   name="restaurant_hero_section[main_image]" 
                   value="<?php echo esc_attr($hero['main_image'] ?? ''); ?>">
            <button type="button" class="button restaurant-upload-image">
                <?php _e('Upload Image', 'restaurant'); ?>
            </button>
            <div class="restaurant-image-preview">
                <?php if (!empty($hero['main_image'])): ?>
                    <img src="<?php echo esc_url($hero['main_image']); ?>" alt="Hero Image Preview">
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- About Section -->
    <div class="restaurant-section">
        <h3><?php _e('About Section', 'restaurant'); ?></h3>
        
        <div class="restaurant-field">
            <label for="about_subtitle"><?php _e('About Subtitle', 'restaurant'); ?></label>
            <input type="text" 
                   id="about_subtitle" 
                   name="restaurant_about_section[subtitle]" 
                   value="<?php echo esc_attr($about['subtitle'] ?? ''); ?>" 
                   placeholder="about us">
        </div>
        
        <div class="restaurant-field">
            <label for="about_title"><?php _e('About Title', 'restaurant'); ?></label>
            <input type="text" 
                   id="about_title" 
                   name="restaurant_about_section[title]" 
                   value="<?php echo esc_attr($about['title'] ?? ''); ?>" 
                   placeholder="Our Commitment to Authenticity & excellence">
        </div>
        
        <div class="restaurant-field">
            <label for="about_description"><?php _e('About Description', 'restaurant'); ?></label>
            <textarea id="about_description" 
                      name="restaurant_about_section[description]" 
                      placeholder="Every dish we create..."><?php echo esc_textarea($about['description'] ?? ''); ?></textarea>
        </div>
    </div>

    <!-- Dishes Section -->
    <div class="restaurant-section">
        <h3><?php _e('Dishes Section', 'restaurant'); ?></h3>
        
        <div class="restaurant-field">
            <label for="dishes_subtitle"><?php _e('Dishes Subtitle', 'restaurant'); ?></label>
            <input type="text" 
                   id="dishes_subtitle" 
                   name="restaurant_dishes_section[subtitle]" 
                   value="<?php echo esc_attr($dishes['subtitle'] ?? ''); ?>" 
                   placeholder="our main dishes">
        </div>
        
        <div class="restaurant-field">
            <label for="dishes_title"><?php _e('Dishes Title', 'restaurant'); ?></label>
            <input type="text" 
                   id="dishes_title" 
                   name="restaurant_dishes_section[title]" 
                   value="<?php echo esc_attr($dishes['title'] ?? ''); ?>" 
                   placeholder="Satisfy your cravings with our signature mains">
        </div>
    </div>
</div>

