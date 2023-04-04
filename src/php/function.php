<?php
    
    function order_scripts() {
        wp_enqueue_style('style-css', get_stylesheet_uri());
        
        wp_enqueue_script('scripts-js', get_template_directory_uri() . 'index.js');

       
    };
    add_action('wp_enqueue_scripts', 'order_scripts_scripts', 'mk_scripts_slick');
?>