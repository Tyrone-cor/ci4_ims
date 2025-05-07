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
        // Debug session information
        log_message('debug', '---------------------');
        log_message('debug', 'Dashboard Access Attempt');
        log_message('debug', 'Session Data: ' . json_encode(session()->get()));
        
        // Check authentication
        if (!session()->get('isLoggedIn')) {
            log_message('debug', 'User not logged in, redirecting to login');
            return redirect()->to('/login');
        }

        // Prepare view data
        $data = [
            'title' => 'Dashboard',
            'user' => [
                'name' => session()->get('name'),
                'email' => session()->get('email'),
                'role' => session()->get('role')
            ]
        ];

        log_message('debug', 'Rendering dashboard for user: ' . $data['user']['name']);
        
        // Create basic dashboard view if it doesn't exist
        if (!is_file(APPPATH . 'Views/dashboard.php')) {
            log_message('debug', 'Creating default dashboard view');
            $defaultView = $this->createDefaultDashboardView();
            if (!$defaultView) {
                return 'Error creating dashboard view';
            }
        }

        return view('dashboard', $data);
    }

    private function createDefaultDashboardView()
    {
        $viewContent = <<<'EOT'
<?= $this->extend('layout/main') ?>
<?= $this->section('body') ?>

<div class="container mt-5">
    <div class="row">
        <div class="col-12">
            <h1>Welcome, <?= esc($user['name']) ?></h1>
            <p>Role: <?= esc($user['role']) ?></p>
            
            <div class="card mt-4">
                <div class="card-body">
                    <h5 class="card-title">Dashboard Overview</h5>
                    <p class="card-text">This is your IMS dashboard.</p>
                </div>
            </div>
        </div>
    </div>
</div>

<?= $this->endSection() ?>
EOT;

        $viewPath = APPPATH . 'Views/dashboard.php';
        return file_put_contents($viewPath, $viewContent) !== false;
    }
}