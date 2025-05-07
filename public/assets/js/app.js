// Add this helper function at the top of the file
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Base URL configuration
function getBaseUrl() {
    return '/ci4_ims/api';
}

// Content management
function showContent(section) {
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(el => {
        el.style.display = 'none';
    });
    
    const contentSection = document.getElementById(section + 'Content');
    if (contentSection) {
        contentSection.style.display = 'block';
        
        // Load section-specific content
        switch(section) {
            case 'dashboard':
                loadDashboardData();
                updateTopStats(); // Refresh top stats when showing dashboard
                break;
            case 'products':
                loadProducts();
                updateTopStats(); // Refresh top stats when showing products
                break;
            case 'categories':
                loadCategoriesDisplay();
                break;
            case 'suppliers':
                loadSuppliers();
                break;
            case 'reports':
                loadReports();
                break;
        }
    }

    // Update active navigation item
    document.querySelectorAll('[data-section]').forEach(button => {
        button.classList.remove('active');
        if (button.dataset.section === section) {
            button.classList.add('active');
        }
    });
}

// Product functions
async function loadProducts() {
    try {
        const response = await fetch(`${getBaseUrl()}/products`, {
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        
        const tbody = document.querySelector('#productsContent table tbody');
        tbody.innerHTML = '';
        
        data.data.forEach(product => {
            tbody.innerHTML += `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.category_name || ''}</td>
                    <td>${product.stock}</td>
                    <td>₱${parseFloat(product.price).toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="editProduct(${product.id})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error loading products:', error);
        alert('Failed to load products');
    }
}

async function editProduct(id) {
    try {
        const response = await fetch(`${getBaseUrl()}/products/${id}`, {
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }

        const result = await response.json();
        const product = result.data;

        // Populate edit form
        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editProductStock').value = product.stock;
        document.getElementById('editProductPrice').value = product.price;

        // Load categories and set selected category
        await loadCategories('editProductCategory', product.category_id);

        // Show modal
        const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
        editModal.show();

    } catch (error) {
        console.error('Error loading product:', error);
        alert('Failed to load product details');
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const response = await fetch(`${getBaseUrl()}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete product');
        }

        await loadProducts();

    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
    }
}

// Category functions
async function loadCategories(selectId = 'productCategory', selectedId = null) {
    try {
        const select = document.getElementById(selectId);
        if (!select) {
            throw new Error(`Select element with id '${selectId}' not found`);
        }

        const response = await fetch(`${getBaseUrl()}/categories`, {
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load categories');
        }

        const result = await response.json();
        
        if (!result.data || !Array.isArray(result.data)) {
            throw new Error('Invalid data format received');
        }

        select.innerHTML = '<option value="">Select Category</option>';
        
        result.data.forEach(category => {
            select.innerHTML += `
                <option value="${category.id}" ${selectedId == category.id ? 'selected' : ''}>
                    ${category.name}
                </option>
            `;
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        throw error;
    }
}

async function loadCategoriesDisplay() {
    try {
        const response = await fetch(`${getBaseUrl()}/categories`, {
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        
        const categoryContainer = document.querySelector('#categoriesContent .row');
        categoryContainer.innerHTML = '';
        
        data.data.forEach(category => {
            categoryContainer.innerHTML += `
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${category.name}</h5>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-info" onclick="editCategory(${category.id})">Edit</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteCategory(${category.id})">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        alert('Failed to load categories');
    }
}

async function editCategory(id) {
    try {
        const response = await fetch(`${getBaseUrl()}/categories/${id}`, {
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch category');
        }

        const result = await response.json();
        const category = result.data;

        // Populate edit form
        document.getElementById('editCategoryId').value = category.id;
        document.getElementById('editCategoryName').value = category.name;

        // Show modal
        const editModal = new bootstrap.Modal(document.getElementById('editCategoryModal'));
        editModal.show();

    } catch (error) {
        console.error('Error loading category:', error);
        alert('Failed to load category details');
    }
}

async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
        const response = await fetch(`${getBaseUrl()}/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete category');
        }

        await loadCategoriesDisplay();

    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
    }
}

// Supplier functions
async function loadSuppliers() {
    try {
        const response = await fetch(`${getBaseUrl()}/suppliers`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        
        if (!result.data) {
            throw new Error('Invalid data format received');
        }

        const suppliers = result.data;
        const suppliersList = document.getElementById('suppliersList');
        
        if (suppliersList) {
            if (suppliers.length === 0) {
                suppliersList.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center">No suppliers found</td>
                    </tr>
                `;
                return;
            }

            suppliersList.innerHTML = suppliers.map(supplier => `
                <tr>
                    <td>${escapeHtml(supplier.company_name || '')}</td>
                    <td>${escapeHtml(supplier.contact_person || '')}</td>
                    <td>${escapeHtml(supplier.email || '')}</td>
                    <td>${escapeHtml(supplier.phone || '')}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-supplier" data-id="${supplier.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-supplier" data-id="${supplier.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

            // Re-attach event listeners
            document.querySelectorAll('.edit-supplier').forEach(button => {
                button.addEventListener('click', () => editSupplier(button.dataset.id));
            });

            document.querySelectorAll('.delete-supplier').forEach(button => {
                button.addEventListener('click', () => deleteSupplier(button.dataset.id));
            });
        }
    } catch (error) {
        console.error('Error loading suppliers:', error);
        showAlert('Failed to load suppliers. Please try again.', 'danger');
    }
}

// Add the missing editSupplier function
async function editSupplier(id) {
    try {
        const response = await fetch(`${getBaseUrl()}/suppliers/${id}`, {
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch supplier');
        }

        const result = await response.json();
        const supplier = result.data;

        // Check if form elements exist before trying to populate them
        const editSupplierId = document.getElementById('editSupplierId');
        const editCompanyName = document.getElementById('editCompanyName');
        const editContactPerson = document.getElementById('editContactPerson');
        const editEmail = document.getElementById('editEmail');
        const editPhone = document.getElementById('editPhone');
        
        if (!editSupplierId || !editCompanyName || !editContactPerson || !editEmail || !editPhone) {
            console.error('Edit supplier form elements not found');
            showAlert('Error: Edit form not properly loaded. Please refresh the page.', 'danger');
            return;
        }

        // Populate edit form
        editSupplierId.value = supplier.id;
        editCompanyName.value = supplier.company_name || '';
        editContactPerson.value = supplier.contact_person || '';
        editEmail.value = supplier.email || '';
        editPhone.value = supplier.phone || '';

        // Show modal
        const editModal = new bootstrap.Modal(document.getElementById('editSupplierModal'));
        editModal.show();

    } catch (error) {
        console.error('Error loading supplier:', error);
        showAlert('Failed to load supplier details', 'danger');
    }
}

// Add the missing deleteSupplier function
async function deleteSupplier(id) {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
        const response = await fetch(`${getBaseUrl()}/suppliers/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete supplier');
        }

        showAlert('Supplier deleted successfully', 'success');
        await loadSuppliers();

    } catch (error) {
        console.error('Error deleting supplier:', error);
        showAlert('Failed to delete supplier', 'danger');
    }
}

// Add this to ensure suppliers are loaded when switching to the suppliers tab
document.querySelector('[data-section="suppliers"]').addEventListener('click', function() {
    showContent('suppliers');
    loadSuppliers();
});

// Helper function to show alerts
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) {
        // Create alert container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'alertContainer';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }
    
    const alertId = 'alert-' + Date.now();
    const alertHtml = `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    document.getElementById('alertContainer').innerHTML += alertHtml;
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const alertElement = document.getElementById(alertId);
        if (alertElement) {
            const bsAlert = new bootstrap.Alert(alertElement);
            bsAlert.close();
        }
    }, 5000);
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Report functions
async function loadReports() {
    try {
        const response = await fetch(`${getBaseUrl()}/reports`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        
        if (!result.data) {
            throw new Error('Invalid data format received');
        }

        const reports = result.data;
        const reportsList = document.getElementById('reportsList');
        
        if (reportsList) {
            if (reports.length === 0) {
                reportsList.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center">No reports found</td>
                    </tr>
                `;
                return;
            }

            reportsList.innerHTML = reports.map(report => {
                const createdAt = new Date(report.created_at).toLocaleString();
                return `
                    <tr>
                        <td>${escapeHtml(report.title || '')}</td>
                        <td>${escapeHtml(report.type || 'custom')}</td>
                        <td>${createdAt}</td>
                        <td>
                            <button class="btn btn-sm btn-primary view-report" data-id="${report.id}">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-danger delete-report" data-id="${report.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');

            // Re-attach event listeners
            document.querySelectorAll('.view-report').forEach(button => {
                button.addEventListener('click', () => viewReport(button.dataset.id));
            });

            document.querySelectorAll('.delete-report').forEach(button => {
                button.addEventListener('click', () => deleteReport(button.dataset.id));
            });
            
            // Add event listeners to generate report buttons
            document.querySelectorAll('.generate-report').forEach(button => {
                button.addEventListener('click', () => generateReport(button.dataset.type));
            });
        }
    } catch (error) {
        console.error('Error loading reports:', error);
        showAlert('Failed to load reports. Please try again.', 'danger');
    }
}

// View report function
async function viewReport(id) {
    try {
        const response = await fetch(`${getBaseUrl()}/reports/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load report');
        }

        const result = await response.json();
        const report = result.data;
        
        // Parse the JSON data if it's stored as a string
        let reportData = {};
        try {
            if (typeof report.data === 'string') {
                reportData = JSON.parse(report.data);
            } else {
                reportData = report.data;
            }
        } catch (e) {
            reportData = { content: 'Error parsing report data' };
        }

        // Display the report content
        const reportContent = document.querySelector('#reportData');
        if (reportContent) {
            let reportHtml = '';
            
            // Check report type to determine display format
            switch(report.type) {
                case 'inventory':
                    // If we have an array of products in the content
                    if (Array.isArray(reportData.content) || (reportData.content && typeof reportData.content === 'string' && reportData.content.startsWith('['))) {
                        let products = Array.isArray(reportData.content) ? reportData.content : JSON.parse(reportData.content);
                        
                        // Calculate summary statistics
                        const totalProducts = products.length;
                        const totalItems = products.reduce((sum, product) => sum + parseInt(product.stock || 0), 0);
                        const totalValue = products.reduce((sum, product) => 
                            sum + (parseFloat(product.price || 0) * parseInt(product.stock || 0)), 0);
                        
                        // Group by category
                        const categories = {};
                        products.forEach(product => {
                            const catName = product.category_name || 'Uncategorized';
                            if (!categories[catName]) {
                                categories[catName] = {
                                    count: 0,
                                    value: 0,
                                    items: 0
                                };
                            }
                            categories[catName].count++;
                            categories[catName].items += parseInt(product.stock || 0);
                            categories[catName].value += parseFloat(product.price || 0) * parseInt(product.stock || 0);
                        });
                        
                        reportHtml = `
                            <div class="card mb-4">
                                <div class="card-body">
                                    <h5 class="card-title">${escapeHtml(report.title)}</h5>
                                    <h6 class="card-subtitle mb-3 text-muted">Type: ${escapeHtml(report.type)}</h6>
                                    <p class="text-muted">Created: ${new Date(report.created_at).toLocaleString()}</p>
                                    
                                    <div class="row mb-4">
                                        <div class="col-md-4">
                                            <div class="card bg-light">
                                                <div class="card-body text-center">
                                                    <h6 class="card-title">Total Products</h6>
                                                    <h3>${totalProducts}</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="card bg-light">
                                                <div class="card-body text-center">
                                                    <h6 class="card-title">Total Items in Stock</h6>
                                                    <h3>${totalItems.toLocaleString()}</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="card bg-light">
                                                <div class="card-body text-center">
                                                    <h6 class="card-title">Total Inventory Value</h6>
                                                    <h3>₱${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <h6 class="mt-4 mb-3">Category Breakdown</h6>
                                    <div class="table-responsive mb-4">
                                        <table class="table table-sm table-bordered">
                                            <thead class="table-light">
                                                <tr>
                                                    <th>Category</th>
                                                    <th>Products</th>
                                                    <th>Items in Stock</th>
                                                    <th>Total Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${Object.entries(categories).map(([category, data]) => `
                                                    <tr>
                                                        <td>${escapeHtml(category)}</td>
                                                        <td>${data.count}</td>
                                                        <td>${data.items.toLocaleString()}</td>
                                                        <td>₱${data.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    <h6 class="mt-4 mb-3">Product Details</h6>
                                    <div class="table-responsive">
                                        <table class="table table-striped table-hover">
                                            <thead class="table-primary">
                                                <tr>
                                                    <th>Product Name</th>
                                                    <th>Category</th>
                                                    <th>Stock</th>
                                                    <th>Price</th>
                                                    <th>Total Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${products.map(product => `
                                                    <tr>
                                                        <td>${escapeHtml(product.name || '')}</td>
                                                        <td>${escapeHtml(product.category_name || 'Uncategorized')}</td>
                                                        <td>
                                                            <span class="badge bg-${parseInt(product.stock || 0) > 10 ? 'success' : parseInt(product.stock || 0) > 0 ? 'warning' : 'danger'}">
                                                                ${parseInt(product.stock || 0).toLocaleString()}
                                                            </span>
                                                        </td>
                                                        <td>₱${parseFloat(product.price || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                                        <td>₱${(parseFloat(product.price || 0) * parseInt(product.stock || 0)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    <button class="btn btn-primary mt-4" id="printSavedReport">
                                        <i class="bi bi-printer"></i> Print Report
                                    </button>
                                </div>
                            </div>
                        `;
                    } else {
                        // Fallback for simple content
                        reportHtml = createSimpleReportView(report, reportData);
                    }
                    break;
                    
                case 'suppliers':
                    // If we have an array of suppliers in the content
                    if (Array.isArray(reportData.content) || (reportData.content && typeof reportData.content === 'string' && reportData.content.startsWith('['))) {
                        let suppliers = Array.isArray(reportData.content) ? reportData.content : JSON.parse(reportData.content);
                        
                        reportHtml = `
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">${escapeHtml(report.title)}</h5>
                                    <h6 class="card-subtitle mb-3 text-muted">Type: ${escapeHtml(report.type)}</h6>
                                    <p class="text-muted">Created: ${new Date(report.created_at).toLocaleString()}</p>
                                    
                                    <div class="row mb-4">
                                        <div class="col-md-4">
                                            <div class="card bg-light">
                                                <div class="card-body text-center">
                                                    <h6 class="card-title">Total Suppliers</h6>
                                                    <h3>${suppliers.length}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <h6 class="mt-4 mb-3">Supplier Details</h6>
                                    <div class="table-responsive">
                                        <table class="table table-striped table-hover">
                                            <thead class="table-primary">
                                                <tr>
                                                    <th>Supplier Name</th>
                                                    <th>Contact Person</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>Address</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${suppliers.map(supplier => `
                                                    <tr>
                                                        <td>${escapeHtml(supplier.name || '')}</td>
                                                        <td>${escapeHtml(supplier.contact_person || '')}</td>
                                                        <td>${escapeHtml(supplier.email || '')}</td>
                                                        <td>${escapeHtml(supplier.phone || '')}</td>
                                                        <td>${escapeHtml(supplier.address || '')}</td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    <button class="btn btn-primary mt-4" id="printSavedReport">
                                        <i class="bi bi-printer"></i> Print Report
                                    </button>
                                </div>
                            </div>
                        `;
                    } else {
                        // Fallback for simple content
                        reportHtml = createSimpleReportView(report, reportData);
                    }
                    break;
                    
                case 'sales':
                    // Check if we have structured sales data
                    let salesData = {};
                    
                    try {
                        if (reportData.content && typeof reportData.content === 'string' && 
                            (reportData.content.startsWith('{') || reportData.content.startsWith('['))) {
                            salesData = JSON.parse(reportData.content);
                        } else if (reportData.content) {
                            salesData = reportData.content;
                        } else {
                            salesData = reportData;
                        }
                    } catch (e) {
                        salesData = reportData;
                    }
                    
                    // Create a nicely formatted sales report view
                    reportHtml = `
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${escapeHtml(report.title)}</h5>
                                <h6 class="card-subtitle mb-3 text-muted">Type: ${escapeHtml(report.type)}</h6>
                                <p class="text-muted">Created: ${new Date(report.created_at).toLocaleString()}</p>
                                
                                <div class="row mb-4 mt-4">
                                    <div class="col-md-6">
                                        <div class="card bg-light">
                                            <div class="card-body text-center">
                                                <h6 class="card-title">Total Sales</h6>
                                                <h3>₱${formatNumber(getSalesValue(salesData, 'total_sales'))}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card bg-light">
                                            <div class="card-body text-center">
                                                <h6 class="card-title">Items Sold</h6>
                                                <h3>${formatNumber(getSalesValue(salesData, 'total_items'))}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                ${getSalesTransactions(salesData)}
                                
                                <div class="alert alert-info mt-4">
                                    <i class="bi bi-info-circle"></i> Detailed sales analytics will be available in future updates.
                                </div>
                                
                                <button class="btn btn-primary mt-4" id="printSavedReport">
                                    <i class="bi bi-printer"></i> Print Report
                                </button>
                            </div>
                        </div>
                    `;
                    break;
                    
                case 'custom':
                default:
                    // Simple view for custom reports
                    reportHtml = createSimpleReportView(report, reportData);
                    break;
            }
            
            reportContent.innerHTML = reportHtml;
            
            // Add event listener for print button
            const printButton = document.getElementById('printSavedReport');
            if (printButton) {
                printButton.addEventListener('click', () => {
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(`
                        <html>
                            <head>
                                <title>${report.title}</title>
                                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                                <style>
                                    body { padding: 20px; }
                                    @media print {
                                        .no-print { display: none; }
                                        .card { border: none !important; }
                                    }
                                </style>
                            </head>
                            <body>
                                ${reportContent.innerHTML.replace('id="printSavedReport"', 'class="no-print"')}
                                <script>
                                    window.onload = function() { window.print(); }
                                </script>
                            </body>
                        </html>
                    `);
                    printWindow.document.close();
                });
            }
        }

    } catch (error) {
        console.error('Error viewing report:', error);
        showAlert('Failed to view report', 'danger');
    }
}

// Add report form handler
const addReportForm = document.getElementById('addReportForm');
if (addReportForm) {
    addReportForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('reportTitle').value.trim(),
            type: document.getElementById('reportType').value,
            description: document.getElementById('reportDescription').value.trim()
        };

        try {
            const response = await fetch(`${getBaseUrl()}/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Failed to create report');
            }

            // Clear form and hide modal
            addReportForm.reset();
            bootstrap.Modal.getInstance(document.getElementById('addReportModal')).hide();
            
            // Show success message
            showAlert('Report created successfully', 'success');
            
            // Refresh reports list
            await loadReports();

        } catch (error) {
            console.error('Error details:', error);
            showAlert(error.message || 'Error creating report', 'danger');
        }
    });
}

// Delete report function
async function deleteReport(id) {
    if (!confirm('Are you sure you want to delete this report?')) return;
    
    try {
        const response = await fetch(`${getBaseUrl()}/reports/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete report');
        }

        showAlert('Report deleted successfully', 'success');
        await loadReports();

    } catch (error) {
        console.error('Error deleting report:', error);
        showAlert('Failed to delete report', 'danger');
    }
}

// Add this to ensure reports are loaded when switching to the reports tab
document.querySelector('[data-section="reports"]').addEventListener('click', function() {
    showContent('reports');
    loadReports();
});

// Generate report function
async function generateReport(type) {
    try {
        const response = await fetch(`${getBaseUrl()}/reports/generate/${type}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to generate report');
        }

        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || 'Failed to generate report');
        }

        // Display the generated report
        const reportContent = document.querySelector('#reportData');
        if (reportContent) {
            let reportTitle = '';
            let reportHtml = '';
            
            switch(type) {
                case 'inventory':
                    reportTitle = 'Inventory Report';
                    
                    // Calculate summary statistics
                    const products = result.data;
                    const totalProducts = products.length;
                    const totalItems = products.reduce((sum, product) => sum + parseInt(product.stock), 0);
                    const totalValue = products.reduce((sum, product) => 
                        sum + (parseFloat(product.price) * parseInt(product.stock)), 0);
                    
                    // Group by category
                    const categories = {};
                    products.forEach(product => {
                        const catName = product.category_name || 'Uncategorized';
                        if (!categories[catName]) {
                            categories[catName] = {
                                count: 0,
                                value: 0,
                                items: 0
                            };
                        }
                        categories[catName].count++;
                        categories[catName].items += parseInt(product.stock);
                        categories[catName].value += parseFloat(product.price) * parseInt(product.stock);
                    });
                    
                    // Create HTML for inventory report
                    reportHtml = `
                        <div class="card mb-4">
                            <div class="card-body">
                                <h5 class="card-title">${reportTitle}</h5>
                                <h6 class="card-subtitle mb-3 text-muted">Generated on: ${new Date().toLocaleString()}</h6>
                                
                                <div class="row mb-4">
                                    <div class="col-md-4">
                                        <div class="card bg-light">
                                            <div class="card-body text-center">
                                                <h6 class="card-title">Total Products</h6>
                                                <h3>${totalProducts}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card bg-light">
                                            <div class="card-body text-center">
                                                <h6 class="card-title">Total Items in Stock</h6>
                                                <h3>${totalItems.toLocaleString()}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card bg-light">
                                            <div class="card-body text-center">
                                                <h6 class="card-title">Total Inventory Value</h6>
                                                <h3>₱${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <h6 class="mt-4 mb-3">Category Breakdown</h6>
                                <div class="table-responsive mb-4">
                                    <table class="table table-sm table-bordered">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Category</th>
                                                <th>Products</th>
                                                <th>Items in Stock</th>
                                                <th>Total Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${Object.entries(categories).map(([category, data]) => `
                                                <tr>
                                                    <td>${escapeHtml(category)}</td>
                                                    <td>${data.count}</td>
                                                    <td>${data.items.toLocaleString()}</td>
                                                    <td>₱${data.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <h6 class="mt-4 mb-3">Product Details</h6>
                                <div class="table-responsive">
                                    <table class="table table-striped table-hover">
                                        <thead class="table-primary">
                                            <tr>
                                                <th>Product Name</th>
                                                <th>Category</th>
                                                <th>Stock</th>
                                                <th>Price</th>
                                                <th>Total Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${products.map(product => `
                                                <tr>
                                                    <td>${escapeHtml(product.name)}</td>
                                                    <td>${escapeHtml(product.category_name || 'Uncategorized')}</td>
                                                    <td>
                                                        <span class="badge bg-${parseInt(product.stock) > 10 ? 'success' : parseInt(product.stock) > 0 ? 'warning' : 'danger'}">
                                                            ${parseInt(product.stock).toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td>₱${parseFloat(product.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                                    <td>₱${(parseFloat(product.price) * parseInt(product.stock)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <button class="btn btn-success mt-4" id="saveGeneratedReport">
                                    <i class="bi bi-save"></i> Save This Report
                                </button>
                                <button class="btn btn-primary mt-4 ms-2" id="printReport">
                                    <i class="bi bi-printer"></i> Print Report
                                </button>
                            </div>
                        </div>
                    `;
                    break;
                    
                case 'sales':
                    reportTitle = 'Sales Report';
                    
                    // Create a more detailed placeholder for sales report
                    const currentDate = new Date();
                    const formattedDate = currentDate.toISOString().split('T')[0];
                    
                    reportHtml = `
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${reportTitle}</h5>
                                <h6 class="card-subtitle mb-3 text-muted">Generated on: ${currentDate.toLocaleString()}</h6>
                                
                                <div class="row mb-4 mt-4">
                                    <div class="col-md-6">
                                        <div class="card bg-light">
                                            <div class="card-body text-center">
                                                <h6 class="card-title">Total Sales</h6>
                                                <h3>₱0.00</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card bg-light">
                                            <div class="card-body text-center">
                                                <h6 class="card-title">Items Sold</h6>
                                                <h3>0</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="alert alert-info mt-4">
                                    <i class="bi bi-info-circle"></i> Sales reporting functionality is coming soon. This is a placeholder report.
                                </div>
                                
                                <div class="row mt-4">
                                    <div class="col-md-12">
                                        <div class="card bg-light">
                                            <div class="card-body">
                                                <h6 class="card-title">Report Details</h6>
                                                <p class="card-text">Generated at: ${currentDate.toLocaleString()}</p>
                                                <p class="card-text">This is a placeholder sales report. Actual sales data will be available in future updates.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <button class="btn btn-success mt-4" id="saveGeneratedReport" data-report-data='{"generated_at":"${formattedDate} ${currentDate.toTimeString().split(' ')[0]}","summary":{"total_sales":0,"total_items":0}}'>
                                    <i class="bi bi-save"></i> Save This Report
                                </button>
                                <button class="btn btn-primary mt-4 ms-2" id="printReport">
                                    <i class="bi bi-printer"></i> Print Report
                                </button>
                            </div>
                        </div>
                    `;
                    break;
                    
                case 'suppliers':
                    reportTitle = 'Suppliers Report';
                    const suppliers = result.data;
                    
                    reportHtml = `
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${reportTitle}</h5>
                                <h6 class="card-subtitle mb-3 text-muted">Generated on: ${new Date().toLocaleString()}</h6>
                                
                                <div class="row mb-4">
                                    <div class="col-md-4">
                                        <div class="card bg-light">
                                            <div class="card-body text-center">
                                                <h6 class="card-title">Total Suppliers</h6>
                                                <h3>${suppliers.length}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <h6 class="mt-4 mb-3">Supplier Details</h6>
                                <div class="table-responsive">
                                    <table class="table table-striped table-hover">
                                        <thead class="table-primary">
                                            <tr>
                                                <th>Supplier Name</th>
                                                <th>Contact Person</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Address</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${suppliers.map(supplier => `
                                                <tr>
                                                    <td>${escapeHtml(supplier.name || '')}</td>
                                                    <td>${escapeHtml(supplier.contact_person || '')}</td>
                                                    <td>${escapeHtml(supplier.email || '')}</td>
                                                    <td>${escapeHtml(supplier.phone || '')}</td>
                                                    <td>${escapeHtml(supplier.address || '')}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <button class="btn btn-success mt-4" id="saveGeneratedReport">
                                    <i class="bi bi-save"></i> Save This Report
                                </button>
                                <button class="btn btn-primary mt-4 ms-2" id="printReport">
                                    <i class="bi bi-printer"></i> Print Report
                                </button>
                            </div>
                        </div>
                    `;
                    break;
                    
                default:
                    reportTitle = 'Generated Report';
                    reportHtml = `
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${reportTitle}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">Generated on: ${new Date().toLocaleString()}</h6>
                                <div class="mt-3">
                                    <pre class="bg-light p-3 rounded">${escapeHtml(JSON.stringify(result.data, null, 2))}</pre>
                                </div>
                                <button class="btn btn-success mt-3" id="saveGeneratedReport">
                                    <i class="bi bi-save"></i> Save This Report
                                </button>
                            </div>
                        </div>
                    `;
            }
            
            reportContent.innerHTML = reportHtml;
            
            // Add event listener to save the generated report
            document.getElementById('saveGeneratedReport').addEventListener('click', (event) => {
                // Check if we have custom report data in the data attribute
                const reportDataAttr = event.currentTarget.getAttribute('data-report-data');
                if (reportDataAttr) {
                    try {
                        const customData = JSON.parse(reportDataAttr);
                        saveGeneratedReport(reportTitle, type, customData);
                    } catch (e) {
                        saveGeneratedReport(reportTitle, type, result.data);
                    }
                } else {
                    saveGeneratedReport(reportTitle, type, result.data);
                }
            });
            
            // Add event listener for print button if it exists
            const printButton = document.getElementById('printReport');
            if (printButton) {
                printButton.addEventListener('click', () => {
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(`
                        <html>
                            <head>
                                <title>${reportTitle}</title>
                                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                                <style>
                                    body { padding: 20px; }
                                    @media print {
                                        .no-print { display: none; }
                                        .card { border: none !important; }
                                    }
                                </style>
                            </head>
                            <body>
                                ${reportContent.innerHTML.replace('id="saveGeneratedReport"', 'class="no-print"').replace('id="printReport"', 'class="no-print"')}
                                <script>
                                    window.onload = function() { window.print(); }
                                </script>
                            </body>
                        </html>
                    `);
                    printWindow.document.close();
                });
            }
        }

    } catch (error) {
        console.error('Error generating report:', error);
        showAlert('Failed to generate report: ' + error.message, 'danger');
    }
}

// Save generated report function
async function saveGeneratedReport(title, type, data) {
    try {
        const formData = {
            title: title + ' - ' + new Date().toLocaleDateString(),
            type: type,
            description: JSON.stringify(data)
        };

        const response = await fetch(`${getBaseUrl()}/reports`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message || 'Failed to save report');
        }

        showAlert('Report saved successfully', 'success');
        await loadReports();

    } catch (error) {
        console.error('Error saving report:', error);
        showAlert('Failed to save report: ' + error.message, 'danger');
    }
}

// Dashboard functions
async function loadDashboardData() {
    try {
        // Fetch products data
        const productsResponse = await fetch(`${getBaseUrl()}/products`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (!productsResponse.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const productsData = await productsResponse.json();
        const products = productsData.data || [];

        // Fetch categories
        const categoriesResponse = await fetch(`${getBaseUrl()}/categories`);
        const categoriesData = await categoriesResponse.json();
        const categories = categoriesData.data || [];

        // Fetch suppliers
        const suppliersResponse = await fetch(`${getBaseUrl()}/suppliers`);
        const suppliersData = await suppliersResponse.json();
        const suppliers = suppliersData.data || [];

        // Calculate summaries
        const totalProducts = products.length;
        const totalCategories = categories.length;
        const totalSuppliers = suppliers.length;
        const totalStockValue = products.reduce((sum, product) => 
            sum + (product.stock * product.price), 0);

        // Calculate stock status
        const inStock = products.filter(p => p.stock > 10).length;
        const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
        const outOfStock = products.filter(p => p.stock === 0).length;

        // Update summary cards
        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('totalCategories').textContent = totalCategories;
        document.getElementById('totalSuppliers').textContent = totalSuppliers;
        document.getElementById('totalStockValue').textContent = 
            '₱' + totalStockValue.toFixed(2);

        // Update stock status in the dashboard card
        const dashboardInStockCount = document.querySelector('#dashboardContent .card:nth-of-type(2) #inStockCount');
        const dashboardLowStockCount = document.querySelector('#dashboardContent .card:nth-of-type(2) #lowStockCount');
        const dashboardOutOfStockCount = document.querySelector('#dashboardContent .card:nth-of-type(2) #outOfStockCount');
        
        if (dashboardInStockCount) dashboardInStockCount.textContent = inStock;
        if (dashboardLowStockCount) dashboardLowStockCount.textContent = lowStock;
        if (dashboardOutOfStockCount) dashboardOutOfStockCount.textContent = outOfStock;

        // Update recent products table
        const recentProducts = document.getElementById('recentProducts');
        if (recentProducts) {
            recentProducts.innerHTML = '';
            
            if (products.length === 0) {
                recentProducts.innerHTML = '<tr><td colspan="4" class="text-center">No products found</td></tr>';
            } else {
                products.slice(0, 5).forEach(product => {
                    recentProducts.innerHTML += `
                        <tr>
                            <td>${escapeHtml(product.name)}</td>
                            <td>${escapeHtml(product.category_name || '')}</td>
                            <td>
                                <span class="badge bg-${product.stock > 10 ? 'success' : 
                                    product.stock > 0 ? 'warning' : 'danger'}">${product.stock}</span>
                            </td>
                            <td>₱${parseFloat(product.price).toFixed(2)}</td>
                        </tr>
                    `;
                });
            }
        }

    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sections and event listeners
    document.querySelectorAll('[data-section]').forEach(button => {
        button.addEventListener('click', function() {
            showContent(this.dataset.section);
        });
    });

    // Initialize modals and their listeners
    const addProductModal = document.getElementById('addProductModal');
    if (addProductModal) {
        addProductModal.addEventListener('show.bs.modal', async () => {
            try {
                await loadCategories('productCategory');
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        });
    }

    // Initialize add category form
    const addCategoryForm = document.getElementById('addCategoryForm');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('categoryName').value.trim()
            };

            try {
                const response = await fetch(`${getBaseUrl()}/categories`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    const result = await response.json();
                    throw new Error(result.message || 'Failed to add category');
                }

                // Clear form and hide modal
                addCategoryForm.reset();
                bootstrap.Modal.getInstance(document.getElementById('addCategoryModal')).hide();
                
                // Refresh categories display
                await loadCategoriesDisplay();

            } catch (error) {
                console.error('Error details:', error);
                alert(error.message || 'Error adding category');
            }
        });
    }

    // Initialize forms and their listeners
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('productName').value.trim(),
                category_id: document.getElementById('productCategory').value,
                stock: document.getElementById('productStock').value,
                price: document.getElementById('productPrice').value
            };

            try {
                const response = await fetch(`${getBaseUrl()}/products`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    const result = await response.json();
                    throw new Error(result.message || 'Failed to add product');
                }

                // Clear form and hide modal
                addProductForm.reset();
                bootstrap.Modal.getInstance(addProductModal).hide();
                
                // Refresh products display
                await loadProducts();

            } catch (error) {
                console.error('Error details:', error);
                alert(error.message || 'Error adding product');
            }
        });
    }

    // Initialize add supplier form
    const addSupplierForm = document.getElementById('addSupplierForm');
    if (addSupplierForm) {
        addSupplierForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                company_name: document.getElementById('companyName').value.trim(),
                contact_person: document.getElementById('contactPerson').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim()
            };

            try {
                const response = await fetch(`${getBaseUrl()}/suppliers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    const result = await response.json();
                    throw new Error(result.message || 'Failed to add supplier');
                }

                // Clear form and hide modal
                addSupplierForm.reset();
                const modal = bootstrap.Modal.getInstance(document.getElementById('addSupplierModal'));
                if (modal) {
                    modal.hide();
                }
                
                // Show success message
                showAlert('Supplier added successfully', 'success');
                
                // Immediate refresh of suppliers list
                await loadSuppliers();
                
                // Force re-render of suppliers section
                showContent('suppliers');

            } catch (error) {
                console.error('Error details:', error);
                showAlert(error.message || 'Error adding supplier', 'danger');
            }
        });
    }

    // Initialize add report form
    const addReportForm = document.getElementById('addReportForm');
    if (addReportForm) {
        addReportForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                title: document.getElementById('reportTitle').value.trim(),
                content: document.getElementById('reportContent').value.trim()
            };

            try {
                const response = await fetch(`${getBaseUrl()}/reports`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    const result = await response.json();
                    throw new Error(result.message || 'Failed to create report');
                }

                // Clear form and hide modal
                addReportForm.reset();
                bootstrap.Modal.getInstance(document.getElementById('addReportModal')).hide();
                
                // Refresh reports list
                await loadReports();

            } catch (error) {
                console.error('Error details:', error);
                alert(error.message || 'Error creating report');
            }
        });
    }

    // Sidebar toggle functionality
    const sidebar = document.querySelector('.sidebar');
    const sidebarBackdrop = document.querySelector('.sidebar-backdrop');
    const sidebarToggle = document.getElementById('sidebarToggle');

    function toggleSidebar() {
        sidebar.classList.toggle('show');
        sidebarBackdrop.classList.toggle('show');
        document.body.classList.toggle('overflow-hidden');
    }

    // Initialize sidebar state based on screen size
    function initSidebar() {
        if (window.innerWidth <= 991.98) {
            sidebar.classList.remove('show');
            sidebarBackdrop.classList.remove('show');
            document.body.classList.remove('overflow-hidden');
        }
    }

    // Event listeners
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSidebar();
        });
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', toggleSidebar);
    }

    // Close sidebar when clicking on a nav item on mobile
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 991.98) {
                toggleSidebar();
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        initSidebar();
    });

    // Initialize sidebar on page load
    document.addEventListener('DOMContentLoaded', () => {
        initSidebar();
    });

    // Close sidebar on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('show')) {
            toggleSidebar();
        }
    });

    // Show initial content
    showContent('dashboard');
});

// Form event listeners for edit forms
document.getElementById('editProductForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const productId = document.getElementById('editProductId').value;
    const formData = {
        name: document.getElementById('editProductName').value.trim(),
        category_id: document.getElementById('editProductCategory').value,
        stock: document.getElementById('editProductStock').value,
        price: document.getElementById('editProductPrice').value
    };

    try {
        const response = await fetch(`${getBaseUrl()}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to update product');
        }

        // Hide modal and refresh products list
        bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
        await loadProducts();

    } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product');
    }
});

document.getElementById('editCategoryForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const categoryId = document.getElementById('editCategoryId').value;
    const formData = {
        name: document.getElementById('editCategoryName').value.trim()
    };

    try {
        const response = await fetch(`${getBaseUrl()}/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        throw new Error('Failed to update category');
    }

    // Hide modal and refresh categories list
    bootstrap.Modal.getInstance(document.getElementById('editCategoryModal')).hide();
    await loadCategoriesDisplay();

    } catch (error) {
        console.error('Error updating category:', error);
        alert('Failed to update category');
    }
});

// Add report form submission handler
document.getElementById('addReportForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('reportTitle').value.trim(),
        type: document.getElementById('reportType').value,
        description: document.getElementById('reportDescription').value.trim()
    };

    try {
        const response = await fetch(`${getBaseUrl()}/reports`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to create report');
        }

        // Clear form and close modal
        this.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('addReportModal'));
        modal.hide();

        // Show success message and reload reports
        showAlert('Report created successfully', 'success');
        await loadReports();

    } catch (error) {
        console.error('Error details:', error);
        showAlert(error.message || 'Error creating report', 'danger');
    }
});

// Add edit supplier form submission handler
document.addEventListener('DOMContentLoaded', function() {
    // Add other event listeners...
    
    // Edit supplier form
    const editSupplierForm = document.getElementById('editSupplierForm');
    if (editSupplierForm) {
        editSupplierForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const supplierId = document.getElementById('editSupplierId').value;
            const formData = {
                company_name: document.getElementById('editCompanyName').value.trim(),
                contact_person: document.getElementById('editContactPerson').value.trim(),
                email: document.getElementById('editEmail').value.trim(),
                phone: document.getElementById('editPhone').value.trim()
            };

            try {
                const response = await fetch(`${getBaseUrl()}/suppliers/${supplierId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    const result = await response.json();
                    throw new Error(result.message || 'Failed to update supplier');
                }

                // Clear form and hide modal
                editSupplierForm.reset();
                const modal = bootstrap.Modal.getInstance(document.getElementById('editSupplierModal'));
                if (modal) {
                    modal.hide();
                }
                
                // Show success message
                showAlert('Supplier updated successfully', 'success');
                
                // Refresh suppliers list
                await loadSuppliers();

            } catch (error) {
                console.error('Error details:', error);
                showAlert(error.message || 'Error updating supplier', 'danger');
            }
        });
    }
});

// Helper function to create a simple report view for text content
function createSimpleReportView(report, reportData) {
    let content = '';
    
    // Handle different data formats
    if (reportData.content) {
        content = reportData.content;
    } else if (typeof reportData === 'string') {
        content = reportData;
    } else {
        content = JSON.stringify(reportData, null, 2);
    }
    
    return `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${escapeHtml(report.title)}</h5>
                <h6 class="card-subtitle mb-3 text-muted">Type: ${escapeHtml(report.type)}</h6>
                <p class="text-muted">Created: ${new Date(report.created_at).toLocaleString()}</p>
                
                <div class="mt-4 p-3 bg-light rounded">
                    ${typeof content === 'string' && !content.startsWith('{') && !content.startsWith('[')
                        ? `<p class="mb-0">${escapeHtml(content)}</p>`
                        : `<pre class="mb-0">${escapeHtml(typeof content === 'string' ? content : JSON.stringify(content, null, 2))}</pre>`
                    }
                </div>
                
                <button class="btn btn-primary mt-4" id="printSavedReport">
                    <i class="bi bi-printer"></i> Print Report
                </button>
            </div>
        </div>
    `;
}

// Helper function to safely get sales data values
function getSalesValue(data, key) {
    if (!data) return 0;
    
    // Check if the data has a summary object
    if (data.summary && data.summary[key] !== undefined) {
        return data.summary[key];
    }
    
    // Check if the key exists directly in the data
    if (data[key] !== undefined) {
        return data[key];
    }
    
    // Default value
    return 0;
}

// Helper function to format numbers with commas
function formatNumber(num) {
    return parseFloat(num || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Helper function to generate sales transactions table if available
function getSalesTransactions(data) {
    // Check if we have transactions data
    if (data.transactions && Array.isArray(data.transactions) && data.transactions.length > 0) {
        return `
            <h6 class="mt-4 mb-3">Recent Transactions</h6>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-primary">
                        <tr>
                            <th>Transaction ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.transactions.map(transaction => `
                            <tr>
                                <td>${escapeHtml(transaction.id || '')}</td>
                                <td>${transaction.date ? new Date(transaction.date).toLocaleString() : ''}</td>
                                <td>${escapeHtml(transaction.customer || '')}</td>
                                <td>${transaction.items || 0}</td>
                                <td>₱${formatNumber(transaction.total || 0)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    // If we have a period breakdown (e.g., daily, monthly)
    if (data.period_breakdown && Object.keys(data.period_breakdown).length > 0) {
        return `
            <h6 class="mt-4 mb-3">Sales Breakdown</h6>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-primary">
                        <tr>
                            <th>Period</th>
                            <th>Items Sold</th>
                            <th>Total Sales</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(data.period_breakdown).map(([period, stats]) => `
                            <tr>
                                <td>${escapeHtml(period)}</td>
                                <td>${stats.items || 0}</td>
                                <td>₱${formatNumber(stats.sales || 0)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    // If no detailed data is available
    return `
        <div class="row mt-4">
            <div class="col-md-12">
                <div class="card bg-light">
                    <div class="card-body">
                        <h6 class="card-title">Report Details</h6>
                        <p class="card-text">Generated at: ${data.generated_at || new Date().toLocaleString()}</p>
                        <p class="card-text">This is a summary sales report. No detailed transaction data is available for this period.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Add this function to update dashboard stats
async function updateDashboardStats() {
    try {
        // Fetch products count
        const productsResponse = await fetch(`${getBaseUrl()}/products`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (productsResponse.ok) {
            const productsData = await productsResponse.json();
            if (productsData.success && productsData.data) {
                const products = productsData.data;
                
                // Update products count
                const totalProductsElement = document.getElementById('totalProductsCount');
                if (totalProductsElement) {
                    animateCounter(totalProductsElement, 0, products.length);
                }
                
                // Calculate inventory value
                const inventoryValue = products.reduce((total, product) => {
                    return total + (parseFloat(product.price || 0) * parseInt(product.stock || 0));
                }, 0);
                
                const inventoryValueElement = document.getElementById('inventoryValue');
                if (inventoryValueElement) {
                    animateCounter(inventoryValueElement, 0, inventoryValue, '₱');
                }
            }
        }
        
        // Fetch categories count
        const categoriesResponse = await fetch(`${getBaseUrl()}/categories`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            if (categoriesData.success && categoriesData.data) {
                const totalCategoriesElement = document.getElementById('totalCategoriesCount');
                if (totalCategoriesElement) {
                    animateCounter(totalCategoriesElement, 0, categoriesData.data.length);
                }
            }
        }
        
        // Fetch suppliers count
        const suppliersResponse = await fetch(`${getBaseUrl()}/suppliers`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (suppliersResponse.ok) {
            const suppliersData = await suppliersResponse.json();
            if (suppliersData.success && suppliersData.data) {
                const totalSuppliersElement = document.getElementById('totalSuppliersCount');
                if (totalSuppliersElement) {
                    animateCounter(totalSuppliersElement, 0, suppliersData.data.length);
                }
            }
        }
        
    } catch (error) {
        console.error('Error updating dashboard stats:', error);
    }
}

// Function to animate counter
function animateCounter(element, start, end, prefix = '', suffix = '') {
    let current = start;
    const increment = (end - start) / 30; // Divide animation into 30 steps
    const duration = 1500; // Animation duration in milliseconds
    const stepTime = duration / 30;
    
    // Format the number based on whether it's a currency value
    const formatNumber = (num) => {
        if (prefix === '₱') {
            return num.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        return Math.round(num).toLocaleString();
    };
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            clearInterval(timer);
            current = end;
        }
        element.textContent = `${prefix}${formatNumber(current)}${suffix}`;
    }, stepTime);
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update dashboard stats when the page loads
    updateDashboardStats();
    
    // Show dashboard content by default
    showContent('dashboard');
    
    // Initialize any other required functionality
    initializeApp();
});

// Function to initialize the application
function initializeApp() {
    // Set up event listeners and other initialization tasks
    setupNavigation();
    setupFormHandlers();
}

// Function to set up navigation
function setupNavigation() {
    // Set up navigation buttons - this is already handled in the existing code
    // The existing code already has event listeners for [data-section] elements
    
    // Set up mobile sidebar toggle if it exists
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('show-sidebar');
        });
    }
}

// Only define setupFormHandlers if it's not already defined
function setupFormHandlers() {
    // This function can be empty if the form handlers are already set up elsewhere
    // or we can add specific form initialization code here if needed
    console.log('Form handlers initialized');
}

// Function to update the top stats cards
async function updateTopStats() {
    try {
        // Fetch products data
        const response = await fetch(`${getBaseUrl()}/products`, {
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const result = await response.json();
        const products = result.data || [];
        
        // Calculate stats
        const totalProducts = products.length;
        const inStock = products.filter(p => p.stock > 10).length;
        const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
        const outOfStock = products.filter(p => p.stock == 0).length;
        
        // Calculate percentages
        const inStockPercentage = totalProducts > 0 ? ((inStock / totalProducts) * 100).toFixed(1) : 0;
        const lowStockPercentage = totalProducts > 0 ? ((lowStock / totalProducts) * 100).toFixed(1) : 0;
        const outOfStockPercentage = totalProducts > 0 ? ((outOfStock / totalProducts) * 100).toFixed(1) : 0;
        
        // Update the UI
        document.getElementById('totalProductsCount').textContent = totalProducts;
        document.getElementById('inStockCount').textContent = inStock;
        document.getElementById('lowStockCount').textContent = lowStock;
        document.getElementById('outOfStockCount').textContent = outOfStock;
        
        // Update percentage texts
        document.getElementById('inStockPercentage').textContent = `${inStockPercentage}% of total`;
        document.getElementById('lowStockChangeText').textContent = `${lowStockPercentage}% of total`;
        document.getElementById('outOfStockChangeText').textContent = `${outOfStockPercentage}% of total`;
        
        // Update change indicators based on stock status
        document.getElementById('productsChangeText').textContent = 
            `${totalProducts} total products`;
            
        // Set appropriate icons for indicators
        if (lowStock > 0) {
            document.getElementById('lowStockChangeIndicator').innerHTML = 
                `<i class="bi bi-exclamation-circle"></i> <span id="lowStockChangeText">${lowStockPercentage}% of total</span>`;
        } else {
            document.getElementById('lowStockChangeIndicator').innerHTML = 
                `<i class="bi bi-check-circle"></i> <span id="lowStockChangeText">No low stock items</span>`;
        }
        
        if (outOfStock > 0) {
            document.getElementById('outOfStockChangeIndicator').innerHTML = 
                `<i class="bi bi-exclamation-triangle"></i> <span id="outOfStockChangeText">${outOfStockPercentage}% of total</span>`;
        } else {
            document.getElementById('outOfStockChangeIndicator').innerHTML = 
                `<i class="bi bi-check-circle"></i> <span id="outOfStockChangeText">No out of stock items</span>`;
        }
        
    } catch (error) {
        console.error('Error updating top stats:', error);
        // Don't show an alert for this error to avoid disrupting the UI
    }
}

// Call updateTopStats when the page loads
document.addEventListener('DOMContentLoaded', function() {
    updateTopStats();
    
    // Refresh stats every 5 minutes
    setInterval(updateTopStats, 300000);
});
