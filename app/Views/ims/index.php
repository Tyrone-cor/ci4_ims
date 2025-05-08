<?php $this->extend('layout/main'); ?>
<?php $this->section('body'); ?>

<div class="d-flex">
    <!-- Sidebar -->
    <div class="sidebar bg-dark text-white" style="width: 240px; min-height: 100vh; position: fixed;">
        <div class="p-3 border-bottom border-secondary">
            <h5 class="fw-bold mb-0">IMS Dashboard</h5>
        </div>
        <ul class="nav flex-column p-3">
            <li class="nav-item mb-2">
                <button class="nav-link text-white w-100 text-start rounded p-2 active" data-section="dashboard">
                    <i class="bi bi-speedometer2 me-2"></i> Dashboard
                </button>
            </li>
            <li class="nav-item mb-2">
                <button class="nav-link text-white w-100 text-start rounded p-2" data-section="products">
                    <i class="bi bi-box me-2"></i> Products
                </button>
            </li>
            <li class="nav-item mb-2">
                <button class="nav-link text-white w-100 text-start rounded p-2" data-section="categories">
                    <i class="bi bi-tags me-2"></i> Categories
                </button>
            </li>
            <li class="nav-item mb-2">
                <button class="nav-link text-white w-100 text-start rounded p-2" data-section="suppliers">
                    <i class="bi bi-building me-2"></i> Suppliers
                </button>
            </li>
            <li class="nav-item mb-2">
                <button class="nav-link text-white w-100 text-start rounded p-2" data-section="reports">
                    <i class="bi bi-file-text me-2"></i> Reports
                </button>
            </li>
        </ul>
        
        <!-- Position the logout button above the user info but near the bottom -->
        <div style="position: absolute; bottom: 80px; width: 100%; padding: 0 1.5rem;">
            <hr class="border-secondary opacity-50 my-3">
            <a href="<?= site_url('logout') ?>" class="btn btn-danger btn-sm d-flex align-items-center justify-content-center w-100 mb-2">
                <i class="bi bi-box-arrow-right me-2"></i> 
                <span>Logout</span>
            </a>
        </div>
        
        <!-- User info at bottom of sidebar with improved styling -->
        <div class="position-absolute bottom-0 w-100 p-3 border-top border-secondary">
            <div class="d-flex align-items-center">
                <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style="width: 42px; height: 42px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                    <span class="text-white"><?= substr(session()->get('name') ?? session()->get('username') ?? 'U', 0, 1) ?></span>
                </div>
                <div>
                    <div class="text-white"><?= session()->get('name') ?? session()->get('username') ?? 'User' ?></div>
                    <small class="text-white-50 d-flex align-items-center">
                        <i class="bi bi-person-badge me-1"></i>
                        <?= session()->get('role') ?? 'User' ?>
                    </small>
                </div>
            </div>
        </div>
    </div>

    <div class="sidebar-backdrop"></div>

    <!-- Main Content -->
    <div class="main-content" style="margin-left: 240px; width: calc(100% - 240px);">
        <div class="container-fluid px-3 py-4">
            <div class="dashboard-header mb-4 p-4" style="margin-top: 0;">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 class="mb-1 fw-bold">Inventory Dashboard</h2>
                        <p class="text-muted mb-0">Welcome back! Here's what's happening with your inventory today.</p>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary d-flex align-items-center" onclick="showContent('products')">
                            <i class="bi bi-box me-2"></i>Products
                        </button>
                        <button class="btn btn-outline-secondary d-flex align-items-center" onclick="showContent('reports')">
                            <i class="bi bi-file-earmark-text me-2"></i>Reports
                        </button>
                    </div>
                </div>
            </div>

            <div class="row g-4 mb-4">
                <div class="col-xl-3 col-md-6">
                    <div class="card stats-card bg-primary bg-opacity-10 h-100">
                        <div class="card-body">
                            <h6 class="text-primary fw-bold mb-2">Total Products</h6>
                            <h3 class="fw-bold mb-0" id="totalProductsCount">0</h3>
                            <div class="mt-2 text-success d-flex align-items-center" id="productsChangeIndicator">
                                <i class="bi bi-arrow-up-short"></i>
                                <span id="productsChangeText">Loading...</span>
                            </div>
                            <i class="bi bi-box stats-icon text-primary"></i>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6">
                    <div class="card stats-card bg-success bg-opacity-10 h-100">
                        <div class="card-body">
                            <h6 class="text-success fw-bold mb-2">In Stock</h6>
                            <h3 class="fw-bold mb-0" id="inStockCount">0</h3>
                            <div class="mt-2 text-muted d-flex align-items-center">
                                <span id="inStockPercentage">Loading...</span>
                            </div>
                            <i class="bi bi-check-circle stats-icon text-success"></i>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6">
                    <div class="card stats-card bg-warning bg-opacity-10 h-100">
                        <div class="card-body">
                            <h6 class="text-warning fw-bold mb-2">Low Stock</h6>
                            <h3 class="fw-bold mb-0" id="lowStockCount">0</h3>
                            <div class="mt-2 text-danger d-flex align-items-center" id="lowStockChangeIndicator">
                                <i class="bi bi-arrow-up-short"></i>
                                <span id="lowStockChangeText">Loading...</span>
                            </div>
                            <i class="bi bi-exclamation-triangle stats-icon text-warning"></i>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6">
                    <div class="card stats-card bg-danger bg-opacity-10 h-100">
                        <div class="card-body">
                            <h6 class="text-danger fw-bold mb-2">Out of Stock</h6>
                            <h3 class="fw-bold mb-0" id="outOfStockCount">0</h3>
                            <div class="mt-2 text-success d-flex align-items-center" id="outOfStockChangeIndicator">
                                <i class="bi bi-arrow-down-short"></i>
                                <span id="outOfStockChangeText">Loading...</span>
                            </div>
                            <i class="bi bi-x-circle stats-icon text-danger"></i>
                        </div>
                    </div>
                </div>
            </div>

            <main class="container-fluid p-0">
                <div id="content-area">
                    <div id="dashboardContent" class="content-section" style="display:none">
                        <h3 class="mb-4">Dashboard Overview</h3>
                        
                        <!-- Summary Cards -->
                        <div class="row g-4 mb-5">
                            <div class="col-md-3">
                                <div class="card border-0 shadow-sm bg-gradient">
                                    <div class="card-body p-4">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 class="text-muted mb-2">Total Products</h6>
                                                <h3 class="mb-0" id="totalProducts">0</h3>
                                            </div>
                                            <div class="rounded-circle bg-primary bg-opacity-10 p-3">
                                                <i class="bi bi-box text-primary fs-4"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card border-0 shadow-sm">
                                    <div class="card-body p-4">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 class="text-muted mb-2">Total Categories</h6>
                                                <h3 class="mb-0" id="totalCategories">0</h3>
                                            </div>
                                            <div class="rounded-circle bg-success bg-opacity-10 p-3">
                                                <i class="bi bi-tags text-success fs-4"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card border-0 shadow-sm">
                                    <div class="card-body p-4">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 class="text-muted mb-2">Total Suppliers</h6>
                                                <h3 class="mb-0" id="totalSuppliers">0</h3>
                                            </div>
                                            <div class="rounded-circle bg-warning bg-opacity-10 p-3">
                                                <i class="bi bi-building text-warning fs-4"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card border-0 shadow-sm">
                                    <div class="card-body p-4">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 class="text-muted mb-2">Total Stock Value</h6>
                                                <h3 class="mb-0" id="totalStockValue">₱0.00</h3>
                                            </div>
                                            <div class="rounded-circle bg-info bg-opacity-10 p-3">
                                                <i class="bi bi-currency-dollar text-info fs-4"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Stock Status -->
                        <div class="row g-4 mb-5">
                            <div class="col-md-6">
                                <div class="card border-0 shadow-sm">
                                    <div class="card-body p-4">
                                        <h5 class="card-title mb-4">Stock Status</h5>
                                        <div class="d-flex justify-content-between mb-3">
                                            <span>In Stock</span>
                                            <span class="badge bg-success rounded-pill" id="inStockCount">0</span>
                                        </div>
                                        <div class="d-flex justify-content-between mb-3">
                                            <span>Low Stock</span>
                                            <span class="badge bg-warning rounded-pill" id="lowStockCount">0</span>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <span>Out of Stock</span>
                                            <span class="badge bg-danger rounded-pill" id="outOfStockCount">0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card border-0 shadow-sm">
                                    <div class="card-body p-4">
                                        <h5 class="card-title mb-4">Recent Products</h5>
                                        <div class="table-responsive">
                                            <table class="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Category</th>
                                                        <th>Stock</th>
                                                        <th>Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="recentProducts">
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="productsContent" class="content-section" style="display:none">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h3>Products</h3>
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProductModal">Add New Product</button>
                        </div>
                        <div class="card">
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Product Name</th>
                                                <th>Category</th>
                                                <th>Stock</th>
                                                <th>Price</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Product 1</td>
                                                <td>Category A</td>
                                                <td>100</td>
                                                <td>$99.99</td>
                                                <td>
                                                    <button class="btn btn-sm btn-info">Edit</button>
                                                    <button class="btn btn-sm btn-danger">Delete</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="categoriesContent" class="content-section" style="display:none">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h3>Categories</h3>
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addCategoryModal">Add Category</button>
                        </div>
                        <div class="row g-4">
                            <div class="col-md-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Electronics</h5>
                                        <p class="card-text">50 products</p>
                                        <div class="d-flex gap-2">
                                            <button class="btn btn-sm btn-info">Edit</button>
                                            <button class="btn btn-sm btn-danger">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="suppliersContent" class="content-section" style="display:none">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h3>Suppliers</h3>
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addSupplierModal">
                                Add Supplier
                            </button>
                        </div>
                        <div class="card">
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Company Name</th>
                                                <th>Contact Person</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="suppliersList">
                                            <!-- Suppliers will be loaded here dynamically -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="reportsContent" class="content-section" style="display:none">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h3>Reports</h3>
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addReportModal">
                                Create Custom Report
                            </button>
                        </div>
                        
                        <!-- Report Types Cards -->
                        <div class="row g-4 mb-4">
                            <div class="col-md-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Inventory Report</h5>
                                        <p class="card-text">View current inventory levels</p>
                                        <button class="btn btn-primary generate-report" data-type="inventory">Generate Report</button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Sales Report</h5>
                                        <p class="card-text">View sales analytics and trends</p>
                                        <button class="btn btn-primary generate-report" data-type="sales">Generate Report</button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Suppliers Report</h5>
                                        <p class="card-text">View supplier statistics</p>
                                        <button class="btn btn-primary generate-report" data-type="suppliers">Generate Report</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Report Data Display Area -->
                        <div id="reportData" class="mt-4"></div>
                        
                        <!-- Saved Reports Table -->
                        <div class="card mt-4">
                            <div class="card-body">
                                <h5 class="card-title">Saved Reports</h5>
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Type</th>
                                                <th>Created At</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="reportsList">
                                            <!-- Reports will be loaded here dynamically -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Add Category Modal -->
                    <div class="modal fade" id="addCategoryModal" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Add New Category</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <form id="addCategoryForm">
                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <label for="categoryName" class="form-label">Category Name</label>
                                            <input type="text" class="form-control" id="categoryName" name="name" required>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" class="btn btn-primary">Save Category</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Add Supplier Modal -->
                    <div class="modal fade" id="addSupplierModal" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Add New Supplier</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <form id="addSupplierForm">
                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <label for="companyName" class="form-label">Company Name</label>
                                            <input type="text" class="form-control" id="companyName" name="company_name" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="contactPerson" class="form-label">Contact Person</label>
                                            <input type="text" class="form-control" id="contactPerson" name="contact_person" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="email" class="form-label">Email</label>
                                            <input type="email" class="form-control" id="email" name="email" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="phone" class="form-label">Phone</label>
                                            <input type="tel" class="form-control" id="phone" name="phone" required>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" class="btn btn-primary">Save Supplier</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Add Custom Report Modal -->
                    <div class="modal fade" id="addReportModal" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Create Custom Report</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <form id="addReportForm">
                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <label for="reportTitle" class="form-label">Report Title</label>
                                            <input type="text" class="form-control" id="reportTitle" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="reportContent" class="form-label">Report Content</label>
                                            <textarea class="form-control" id="reportContent" rows="5" required></textarea>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" class="btn btn-primary">Save Report</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Edit Product Modal -->
                    <div class="modal fade" id="editProductModal" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Edit Product</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <form id="editProductForm">
                                    <input type="hidden" id="editProductId">
                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <label for="editProductName" class="form-label">Product Name</label>
                                            <input type="text" class="form-control" id="editProductName" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="editProductCategory" class="form-label">Category</label>
                                            <select class="form-select" id="editProductCategory" required>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label for="editProductStock" class="form-label">Stock</label>
                                            <input type="number" class="form-control" id="editProductStock" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="editProductPrice" class="form-label">Price</label>
                                            <input type="number" class="form-control" id="editProductPrice" step="0.01" required>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" class="btn btn-primary">Save Changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Edit Category Modal -->
                    <div class="modal fade" id="editCategoryModal" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Edit Category</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <form id="editCategoryForm">
                                    <input type="hidden" id="editCategoryId">
                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <label for="editCategoryName" class="form-label">Category Name</label>
                                            <input type="text" class="form-control" id="editCategoryName" required>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" class="btn btn-primary">Save Changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Add Report Modal -->
                    <div class="modal fade" id="addReportModal" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Add New Report</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <form id="addReportForm">
                                        <div class="mb-3">
                                            <label for="reportTitle" class="form-label">Report Title</label>
                                            <input type="text" class="form-control" id="reportTitle" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="reportType" class="form-label">Report Type</label>
                                            <select class="form-control" id="reportType" required>
                                                <option value="inventory">Inventory Report</option>
                                                <option value="sales">Sales Report</option>
                                                <option value="suppliers">Suppliers Report</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label for="reportDescription" class="form-label">Description</label>
                                            <textarea class="form-control" id="reportDescription" rows="3" required></textarea>
                                        </div>
                                        <button type="submit" class="btn btn-primary">Save Report</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <!-- Add Product Modal -->
            <div class="modal fade" id="addProductModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Add New Product</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form id="addProductForm">
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="productName" class="form-label">Product Name</label>
                                    <input type="text" class="form-control" id="productName" name="name" required>
                                </div>
                                <div class="mb-3">
                                    <label for="productCategory" class="form-label">Category</label>
                                    <select class="form-select" id="productCategory" name="category_id" required>
                                        <option value="">Select Category</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="productStock" class="form-label">Initial Stock</label>
                                    <input type="number" class="form-control" id="productStock" name="stock" required>
                                </div>
                                <div class="mb-3">
                                    <label for="productPrice" class="form-label">Price</label>
                                    <input type="number" class="form-control" id="productPrice" name="price" step="0.01" required>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Edit Supplier Modal -->
<div class="modal fade" id="editSupplierModal" tabindex="-1" aria-labelledby="editSupplierModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editSupplierModalLabel">Edit Supplier</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="editSupplierForm">
                    <input type="hidden" id="editSupplierId">
                    <div class="mb-3">
                        <label for="editCompanyName" class="form-label">Company Name</label>
                        <input type="text" class="form-control" id="editCompanyName" required>
                    </div>
                    <div class="mb-3">
                        <label for="editContactPerson" class="form-label">Contact Person</label>
                        <input type="text" class="form-control" id="editContactPerson" required>
                    </div>
                    <div class="mb-3">
                        <label for="editEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="editEmail" required>
                    </div>
                    <div class="mb-3">
                        <label for="editPhone" class="form-label">Phone</label>
                        <input type="text" class="form-control" id="editPhone" required>
                    </div>
                    <div class="text-end">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<?php $this->endSection(); ?>
