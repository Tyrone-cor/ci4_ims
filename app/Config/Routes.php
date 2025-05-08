<?php

namespace Config;

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();

// Authentication routes
$routes->get('login', 'Auth::login');
$routes->post('auth/authenticate', 'Auth::authenticate');
$routes->get('logout', 'Auth::logout');

// Redirect root to login if not authenticated
$routes->get('/', 'Auth::index');

// Protected routes - require authentication
$routes->group('', ['filter' => 'auth'], function($routes) {
    $routes->get('dashboard', 'Dashboard::index');
    // Add other protected routes here
});

// API routes
$routes->group('api', function($routes) {
    // Categories
    $routes->get('categories', 'Categories::index');
    $routes->post('categories', 'Categories::create');
    $routes->delete('categories/(:num)', 'Categories::delete/$1');
    $routes->get('categories/(:num)', 'Categories::show/$1');
    $routes->put('categories/(:num)', 'Categories::update/$1');
    
    // Products
    $routes->get('products', 'Products::index');
    $routes->post('products', 'Products::create');
    $routes->get('products/(:num)', 'Products::show/$1');
    $routes->put('products/(:num)', 'Products::update/$1');
    $routes->delete('products/(:num)', 'Products::delete/$1');
    
    // Suppliers routes
    $routes->get('suppliers', 'Suppliers::index');
    $routes->post('suppliers', 'Suppliers::create');
    $routes->get('suppliers/(:num)', 'Suppliers::show/$1');
    $routes->put('suppliers/(:num)', 'Suppliers::update/$1');
    $routes->delete('suppliers/(:num)', 'Suppliers::delete/$1');
    
    // Reports routes
    $routes->get('reports', 'Reports::index');
    $routes->post('reports', 'Reports::create');
    $routes->get('reports/(:num)', 'Reports::show/$1');
    $routes->delete('reports/(:num)', 'Reports::delete/$1');
    // Report generation routes
    $routes->get('reports/generate/(:segment)', 'Reports::generateReport/$1');
});


