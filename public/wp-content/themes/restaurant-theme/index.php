<?php
/**
 * Template básico del tema Restaurant
 * 
 * Este archivo es necesario para que WordPress reconozca el tema.
 * El frontend real está en Nuxt y se comunica a través de GraphQL/REST API.
 */

get_header();
?>

<div class="restaurant-theme-container">
    <h1><?php bloginfo('name'); ?></h1>
    <p><?php bloginfo('description'); ?></p>
    <p><strong>Nota:</strong> Este es un tema básico para configurar WordPress. El frontend está en Nuxt.</p>
</div>

<?php
get_footer();

