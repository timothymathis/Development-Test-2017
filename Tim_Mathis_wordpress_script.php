if (!is_admin()) add_action("wp_enqueue_scripts", "load_latest_jquery", 11);
function load_latest_jquery() {
   wp_deregister_script('jquery');
   wp_register_script('jquery', "http" . ($_SERVER['SERVER_PORT'] == 443 ? "s" : "") . "://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js", false, null);
   wp_enqueue_script('jquery');
}
