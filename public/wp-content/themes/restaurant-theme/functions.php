<?php
/**
 * Restaurant Theme Functions
 * 
 * Tema básico para registrar ubicaciones de menús y configuraciones del tema.
 * Este tema es mínimo y solo se usa para configurar WordPress, ya que el frontend
 * está en Nuxt y se comunica a través de GraphQL/REST API.
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Configurar el tema
 */
function restaurant_theme_setup() {
    // Agregar soporte para menús
    add_theme_support('menus');
    
    // Registrar ubicaciones de menús
    register_nav_menus(array(
        'primary' => __('Menú Principal', 'restaurant-theme'),
        'footer'  => __('Menú Footer', 'restaurant-theme'),
    ));
    
    // Agregar soporte para imágenes destacadas
    add_theme_support('post-thumbnails');
    
    // Agregar soporte para títulos automáticos
    add_theme_support('title-tag');
}
add_action('after_setup_theme', 'restaurant_theme_setup');

/**
 * Registrar estilos y scripts (opcional, ya que el frontend está en Nuxt)
 */
function restaurant_theme_scripts() {
    // Este tema no carga estilos/scripts ya que el frontend está en Nuxt
    // Pero mantenemos la función por si se necesita en el futuro
}
add_action('wp_enqueue_scripts', 'restaurant_theme_scripts');

