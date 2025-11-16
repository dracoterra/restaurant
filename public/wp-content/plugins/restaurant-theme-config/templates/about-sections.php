<?php
// Valores por defecto
$about_content = $about_content ?: array(
    'subtitle' => 'about us',
    'title' => 'Our Commitment to Authenticity & excellence',
    'description' => 'Every dish we create is a celebration of connection, crafted with passion and inspired by diverse flavors.',
    'features' => array(
        'seasonal & locally sourced ingredients',
        'vegetarian & dietary-friendly options',
        'exquisite pairings & unique flavors'
    ),
    'main_image' => '/images/about-us-image.jpg',
    'secondary_image' => '/images/about-us-img-2.jpg',
    'experience_years' => '30',
    'experience_text' => '+ years of experience',
    'primary_button_text' => 'order now',
    'primary_button_link' => '/contact',
    'secondary_button_text' => 'book a table',
    'secondary_button_link' => '/contact'
);

$about_details = $about_details ?: array(
    array(
        'icon' => '/images/icon-about-detail-1.svg',
        'title' => 'premium dining',
        'description' => 'It\'s very personal, and can only be a positive experience.'
    ),
    array(
        'icon' => '/images/icon-about-detail-2.svg',
        'title' => 'abundant flavors',
        'description' => 'At secret recipe, we take immense pride in crafting.'
    ),
    array(
        'icon' => '/images/icon-about-detail-3.svg',
        'title' => 'indigenous meal',
        'description' => 'With local ingredients, unique spins on traditional flavors.'
    )
);

$approach = $approach ?: array(
    'mission' => array(
        'title' => 'our mission',
        'heading' => 'creating moments around flavor',
        'content' => 'At SpicyHunt, our vision is to redefine the dining experience by bringing people together over authentic, flavorful meals crafted with love and passion.',
        'features' => array(
            'Delivering unforgettable flavors with every dish we serve.',
            'Creating a welcoming space where food connects hearts.',
            'Committed to quality, innovation, and exceptional service.'
        ),
        'image' => '/images/approch-tab-img-1.jpg'
    ),
    'vision' => array(
        'title' => 'our vision',
        'heading' => 'shaping the future of dining',
        'content' => 'We envision a world where every meal is an opportunity to connect, celebrate, and create lasting memories.',
        'features' => array(
            'Leading innovation in culinary experiences.',
            'Building a community around exceptional food.',
            'Setting new standards for restaurant excellence.'
        ),
        'image' => '/images/approch-tab-img-2.jpg'
    ),
    'value' => array(
        'title' => 'our value',
        'heading' => 'what drives us forward',
        'content' => 'Our values are the foundation of everything we do. We believe in authenticity, respect for ingredients, and creating experiences that matter.',
        'features' => array(
            'Authenticity in every dish we create.',
            'Respect for ingredients and traditions.',
            'Excellence in service and experience.'
        ),
        'image' => '/images/approch-tab-img-3.jpg'
    )
);
?>

<style>
.restaurant-section {
    margin-bottom: 30px;
    padding: 20px;
    background: #f9f9f9;
    border: 1px solid #ddd;
}
.restaurant-section h3 {
    margin-top: 0;
    border-bottom: 2px solid #0073aa;
    padding-bottom: 10px;
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
}
.restaurant-field textarea {
    min-height: 100px;
}
.restaurant-items-container {
    margin-top: 10px;
}
.restaurant-item {
    background: white;
    padding: 15px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    position: relative;
}
.restaurant-sort-handle {
    cursor: move;
    color: #666;
    margin-right: 10px;
}
.restaurant-remove-item {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #dc3232;
    text-decoration: none;
}
.restaurant-upload-image {
    margin-left: 10px;
}
</style>

<!-- About Content Section -->
<div class="restaurant-section">
    <h3>About Content Section</h3>
    
    <div class="restaurant-field">
        <label>Subtitle:</label>
        <input type="text" name="restaurant_about_content_section[subtitle]" 
               value="<?php echo esc_attr($about_content['subtitle'] ?? ''); ?>" />
    </div>
    
    <div class="restaurant-field">
        <label>Title:</label>
        <input type="text" name="restaurant_about_content_section[title]" 
               value="<?php echo esc_attr($about_content['title'] ?? ''); ?>" />
    </div>
    
    <div class="restaurant-field">
        <label>Description:</label>
        <textarea name="restaurant_about_content_section[description]"><?php echo esc_textarea($about_content['description'] ?? ''); ?></textarea>
    </div>
    
    <div class="restaurant-field">
        <label>Features (one per line):</label>
        <textarea name="restaurant_about_content_section[features_text]"><?php 
            echo esc_textarea(implode("\n", $about_content['features'] ?? array())); 
        ?></textarea>
        <small>One feature per line</small>
    </div>
    
    <div class="restaurant-field">
        <label>Main Image:</label>
        <input type="hidden" name="restaurant_about_content_section[main_image]" 
               value="<?php echo esc_attr($about_content['main_image'] ?? ''); ?>" />
        <button type="button" class="button restaurant-upload-image">Upload Image</button>
        <?php if (!empty($about_content['main_image'])): ?>
            <img src="<?php echo esc_url($about_content['main_image']); ?>" style="max-width: 200px; display: block; margin-top: 10px;" />
        <?php endif; ?>
    </div>
    
    <div class="restaurant-field">
        <label>Secondary Image:</label>
        <input type="hidden" name="restaurant_about_content_section[secondary_image]" 
               value="<?php echo esc_attr($about_content['secondary_image'] ?? ''); ?>" />
        <button type="button" class="button restaurant-upload-image">Upload Image</button>
        <?php if (!empty($about_content['secondary_image'])): ?>
            <img src="<?php echo esc_url($about_content['secondary_image']); ?>" style="max-width: 200px; display: block; margin-top: 10px;" />
        <?php endif; ?>
    </div>
    
    <div class="restaurant-field">
        <label>Experience Years:</label>
        <input type="number" name="restaurant_about_content_section[experience_years]" 
               value="<?php echo esc_attr($about_content['experience_years'] ?? '30'); ?>" />
    </div>
    
    <div class="restaurant-field">
        <label>Experience Text:</label>
        <input type="text" name="restaurant_about_content_section[experience_text]" 
               value="<?php echo esc_attr($about_content['experience_text'] ?? '+ years of experience'); ?>" />
    </div>
</div>

<!-- About Details Section -->
<div class="restaurant-section">
    <h3>About Details (3 items)</h3>
    <div class="restaurant-items-container">
        <?php 
        $details = $about_details ?: array();
        for ($i = 0; $i < 3; $i++): 
            $detail = $details[$i] ?? array();
        ?>
        <div class="restaurant-item">
            <span class="restaurant-sort-handle">☰</span>
            <a href="#" class="restaurant-remove-item">×</a>
            
            <div class="restaurant-field">
                <label>Icon:</label>
                <input type="hidden" name="restaurant_about_details[<?php echo $i; ?>][icon]" 
                       value="<?php echo esc_attr($detail['icon'] ?? ''); ?>" />
                <button type="button" class="button restaurant-upload-image">Upload Icon</button>
                <?php if (!empty($detail['icon'])): ?>
                    <img src="<?php echo esc_url($detail['icon']); ?>" style="max-width: 50px; display: block; margin-top: 10px;" />
                <?php endif; ?>
            </div>
            
            <div class="restaurant-field">
                <label>Title:</label>
                <input type="text" name="restaurant_about_details[<?php echo $i; ?>][title]" 
                       value="<?php echo esc_attr($detail['title'] ?? ''); ?>" />
            </div>
            
            <div class="restaurant-field">
                <label>Description:</label>
                <textarea name="restaurant_about_details[<?php echo $i; ?>][description]"><?php echo esc_textarea($detail['description'] ?? ''); ?></textarea>
            </div>
        </div>
        <?php endfor; ?>
    </div>
</div>

<!-- Our Approach Section -->
<div class="restaurant-section">
    <h3>Our Approach (Mission, Vision, Value)</h3>
    
    <?php foreach (array('mission', 'vision', 'value') as $tab): ?>
    <div style="margin-bottom: 20px; padding: 15px; background: white; border: 1px solid #ddd;">
        <h4 style="margin-top: 0; text-transform: capitalize;"><?php echo $tab; ?></h4>
        
        <div class="restaurant-field">
            <label>Title:</label>
            <input type="text" name="restaurant_approach_section[<?php echo $tab; ?>][title]" 
                   value="<?php echo esc_attr($approach[$tab]['title'] ?? ''); ?>" />
        </div>
        
        <div class="restaurant-field">
            <label>Heading:</label>
            <input type="text" name="restaurant_approach_section[<?php echo $tab; ?>][heading]" 
                   value="<?php echo esc_attr($approach[$tab]['heading'] ?? ''); ?>" />
        </div>
        
        <div class="restaurant-field">
            <label>Content:</label>
            <textarea name="restaurant_approach_section[<?php echo $tab; ?>][content]"><?php echo esc_textarea($approach[$tab]['content'] ?? ''); ?></textarea>
        </div>
        
        <div class="restaurant-field">
            <label>Features (one per line):</label>
            <textarea name="restaurant_approach_section[<?php echo $tab; ?>][features_text]"><?php 
                echo esc_textarea(implode("\n", $approach[$tab]['features'] ?? array())); 
            ?></textarea>
        </div>
        
        <div class="restaurant-field">
            <label>Image:</label>
            <input type="hidden" name="restaurant_approach_section[<?php echo $tab; ?>][image]" 
                   value="<?php echo esc_attr($approach[$tab]['image'] ?? ''); ?>" />
            <button type="button" class="button restaurant-upload-image">Upload Image</button>
            <?php if (!empty($approach[$tab]['image'])): ?>
                <img src="<?php echo esc_url($approach[$tab]['image']); ?>" style="max-width: 200px; display: block; margin-top: 10px;" />
            <?php endif; ?>
        </div>
    </div>
    <?php endforeach; ?>
</div>

