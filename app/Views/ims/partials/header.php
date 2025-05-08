<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
        <a class="navbar-brand" href="<?= site_url('dashboard') ?>">Inventory Management System</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link <?= uri_string() == 'dashboard' ? 'active' : '' ?>" href="<?= site_url('dashboard') ?>">Dashboard</a>
                </li>
                <!-- Add other navigation items here -->
            </ul>
            
            <!-- User info and logout button at top right -->
            <div class="ms-auto d-flex align-items-center">
                <span class="text-light me-3">
                    <?= session()->get('name') ?? session()->get('username') ?>
                </span>
                <a href="<?= site_url('logout') ?>" class="btn btn-outline-light btn-sm">
                    Logout
                </a>
            </div>
        </div>
    </div>
</nav>


