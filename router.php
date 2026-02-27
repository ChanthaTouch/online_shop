<?php
/**
 * Laravel router for PHP built-in server
 * This handles routing for the PHP built-in web server
 */

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Serve static files directly
if ($uri !== '/' && file_exists(__DIR__ . '/public' . $uri)) {
    return false;
}

// Everything else goes through Laravel
require_once __DIR__ . '/public/index.php';
