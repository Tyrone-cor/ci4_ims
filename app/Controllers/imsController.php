<?php
namespace App\Controllers;
use CodeIgniter\Controller;

class imsController extends BaseController
{
    public function index()
    {
        return view('ims/index'); // Main dashboard view
    }
}