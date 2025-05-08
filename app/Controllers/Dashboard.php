<?php

namespace App\Controllers;

class Dashboard extends BaseController
{
    protected $helpers = ['form', 'url'];

    public function __construct()
    {
        helper(['form', 'url']);
    }

    public function index()
    {
        // Check authentication (this is redundant if using the auth filter)
        if (!session()->get('isLoggedIn')) {
            return redirect()->to('/login');
        }

        // Prepare view data
        $data = [
            'title' => 'Dashboard',
            'user' => [
                'name' => session()->get('name'),
                'username' => session()->get('username'),
                'role' => session()->get('role')
            ]
        ];

        return view('ims/index', $data);
    }
}
