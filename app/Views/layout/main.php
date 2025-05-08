<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventory Management System</title>
    
    <!-- CSS Files -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" rel="stylesheet">
    <link href="<?= base_url('public/assets/css/style.css') ?>" rel="stylesheet">
    <meta name="csrf-token" content="<?= csrf_hash() ?>">
</head>
<body class="d-flex flex-column min-vh-100">
    <div class="app-container d-flex">
        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header p-3 mb-3">
                <div class="d-flex flex-column">
                    <div class="d-flex align-items-center">
                        <div class="sidebar-logo me-3">
                            <i class="bi bi-box-seam fs-3 text-primary"></i>
                        </div>
                        <div>
                            <h5 class="mb-0 fw-bold text-white">IMS</h5>
                            <small class="text-white-50">Inventory System</small>
                        </div>
                    </div>
                </div>
                <!-- Date display aligned with IMS Dashboard -->
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <h6 class="fw-bold mb-0 text-white">IMS Dashboard</h6>
                    <span class="text-white-50 small">
                        <i class="bi bi-calendar3 me-1"></i><?= date('F d, Y'); ?>
                    </span>
                </div>
            </div>
            
            <div class="sidebar-content px-3">
                <ul class="nav flex-column">
                    <li class="nav-item mb-2">
                        <a href="#" class="nav-link active" onclick="showContent('dashboard'); return false;">
                            <i class="bi bi-speedometer2"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li class="nav-item mb-2">
                        <a href="#" class="nav-link" onclick="showContent('products'); return false;">
                            <i class="bi bi-box"></i>
                            <span>Products</span>
                        </a>
                    </li>
                    <li class="nav-item mb-2">
                        <a href="#" class="nav-link" onclick="showContent('categories'); return false;">
                            <i class="bi bi-tags"></i>
                            <span>Categories</span>
                        </a>
                    </li>
                    <li class="nav-item mb-2">
                        <a href="#" class="nav-link" onclick="showContent('suppliers'); return false;">
                            <i class="bi bi-truck"></i>
                            <span>Suppliers</span>
                        </a>
                    </li>
                    <li class="nav-item mb-2">
                        <a href="#" class="nav-link" onclick="showContent('reports'); return false;">
                            <i class="bi bi-file-earmark-text"></i>
                            <span>Reports</span>
                        </a>
                    </li>
                </ul>
            </div>
            
            <!-- Position logout button above the user info with improved styling -->
            <div style="position: absolute; bottom: 80px; width: 100%; padding: 0 1.5rem;">
                <hr class="border-secondary opacity-50 my-3">
                <a href="<?= site_url('logout') ?>" class="btn btn-danger btn-sm d-flex align-items-center justify-content-center w-100">
                    <i class="bi bi-box-arrow-right me-2"></i>
                    <span>Logout</span>
                </a>
            </div>
            
            <!-- Sidebar footer with enhanced user info styling -->
            <div class="sidebar-footer p-3 mt-auto border-top border-secondary" style="background-color: rgba(0,0,0,0.2);">
                <div class="d-flex align-items-center">
                    <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style="width: 42px; height: 42px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                        <span class="text-white"><?= substr(session()->get('name') ?? session()->get('username') ?? 'U', 0, 1) ?></span>
                    </div>
                    <div>
                        <h6 class="mb-0 text-white"><?= session()->get('name') ?? session()->get('username') ?? 'User' ?></h6>
                        <small class="text-white-50 d-flex align-items-center">
                            <i class="bi bi-person-badge me-1"></i>
                            <?= session()->get('role') ?? 'User' ?>
                        </small>
                    </div>
                </div>
            </div>
        </aside>
        
        <!-- Sidebar backdrop for mobile -->
        <div class="sidebar-backdrop"></div>
        
        <!-- Main content area -->
        <main class="main-content">
            <!-- Top navbar -->
            <nav class="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
                <div class="container-fluid px-4">
                    <!-- Sidebar toggle button -->
                    <button class="btn btn-link text-dark d-lg-none me-2" id="sidebarToggle">
                        <i class="bi bi-list fs-5"></i>
                    </button>
                    
                    <!-- Empty space on left -->
                    <div class="d-none d-lg-block" style="width: 100px;"></div>
                    
                    <!-- Date centered in navbar -->
                    <div class="mx-auto text-center">
                        <span class="navbar-text text-muted small">
                            <i class="bi bi-calendar3 me-1"></i><?= date('F d, Y'); ?>
                        </span>
                    </div>
                    
                    <!-- Page title on the right -->
                    <div class="d-flex align-items-center">
                        <h5 class="navbar-text mb-0 fw-semibold">
                            Inventory Management System
                        </h5>
                    </div>
                </div>
            </nav>
            
            <!-- Page content -->
            <div class="page-content p-4">
                <?= $this->renderSection('body') ?>
            </div>
        </main>
    </div>
    
    <!-- JavaScript Files -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="<?= base_url('public/assets/js/app.js') ?>"></script>
</body>
</html>
