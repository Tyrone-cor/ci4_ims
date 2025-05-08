<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Inventory Management System</title>
    <!-- Use CDN links instead of local files to avoid server issues -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: #4361ee;
            --primary-dark: #3a56d4;
            --secondary-color: #6c757d;
            --light-color: #f8f9fa;
            --border-color: #e0e0e0;
            --text-color: #495057;
            --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            --input-shadow: 0 0 0 0.25rem rgba(67, 97, 238, 0.25);
            --button-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
            --standard-spacing: 1.5rem;
            --small-spacing: 0.75rem;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--standard-spacing);
        }
        
        .login-container {
            max-width: 420px;
            width: 100%;
            margin: 2rem auto;
        }
        
        .card {
            border-radius: 12px;
            box-shadow: var(--card-shadow);
            overflow: hidden;
            border: none;
        }
        
        .card-header {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
            color: white;
            text-align: center;
            padding: 2.5rem var(--standard-spacing);
            border-bottom: none;
        }
        
        .logo-area {
            margin-bottom: var(--standard-spacing);
        }
        
        .logo-circle {
            width: 80px;
            height: 80px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .card-body {
            padding: var(--standard-spacing);
        }
        
        .form-group {
            margin-bottom: var(--standard-spacing);
        }
        
        .form-label {
            font-weight: 500;
            color: var(--text-color);
            margin-bottom: var(--small-spacing);
            display: block;
        }
        
        .form-control {
            border-radius: 8px;
            padding: var(--small-spacing) var(--standard-spacing);
            border: 1px solid var(--border-color);
            background-color: var(--light-color);
            transition: all 0.3s ease;
            height: calc(3rem + 2px);
            font-size: 1rem;
        }
        
        .form-control:focus {
            border-color: var(--primary-color);
            background-color: #fff;
            box-shadow: var(--input-shadow);
        }
        
        .input-group {
            position: relative;
        }
        
        .input-group-text {
            background-color: var(--light-color);
            border-color: var(--border-color);
            color: var(--secondary-color);
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
            padding: 0 var(--standard-spacing);
        }
        
        .form-check {
            padding-left: 1.75rem;
            margin-top: var(--small-spacing);
        }
        
        .form-check-input {
            margin-top: 0.2rem;
            margin-left: -1.75rem;
            width: 1.1rem;
            height: 1.1rem;
        }
        
        .form-check-label {
            color: var(--text-color);
        }
        
        .btn-primary {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
            border-radius: 8px;
            padding: var(--small-spacing) var(--standard-spacing);
            font-weight: 500;
            transition: all 0.3s ease;
            height: 3.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
        }
        
        .btn-primary:hover {
            background-color: var(--primary-dark);
            border-color: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: var(--button-shadow);
        }
        
        .btn-primary:active {
            transform: translateY(0);
        }
        
        .alert {
            border-radius: 8px;
            margin-bottom: var(--standard-spacing);
            padding: var(--small-spacing) var(--standard-spacing);
        }
        
        .copyright {
            text-align: center;
            color: var(--secondary-color);
            font-size: 0.85rem;
            margin-top: var(--standard-spacing);
        }
        
        /* Responsive adjustments */
        @media (max-width: 576px) {
            :root {
                --standard-spacing: 1.25rem;
                --small-spacing: 0.625rem;
            }
            
            .logo-circle {
                width: 70px;
                height: 70px;
            }
            
            .card-header {
                padding: 2rem var(--standard-spacing);
            }
            
            .form-control {
                height: calc(2.75rem + 2px);
            }
            
            .btn-primary {
                height: 3rem;
            }
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="card">
            <div class="card-header">
                <div class="logo-area">
                    <div class="logo-circle">
                        <i class="bi bi-box-seam fs-1"></i>
                    </div>
                </div>
                <h4 class="fw-bold mb-2">Inventory Management System</h4>
                <p class="mb-0 opacity-75">Sign in to your account</p>
            </div>
            <div class="card-body">
                <?php if (session()->has('error')): ?>
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        <?= session('error') ?>
                    </div>
                <?php endif; ?>
                
                <?php if (session()->has('errors')): ?>
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        <ul class="mb-0 ps-3">
                            <?php foreach (session('errors') as $error): ?>
                                <li><?= $error ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>
                
                <form action="<?= site_url('auth/authenticate') ?>" method="post">
                    <?= csrf_field() ?>
                    
                    <div class="form-group">
                        <label for="username" class="form-label">Username</label>
                        <div class="input-group">
                            <span class="input-group-text">
                                <i class="bi bi-person"></i>
                            </span>
                            <input type="text" class="form-control" id="username" name="username" 
                                   value="<?= old('username') ?>" placeholder="Enter your username" required autofocus>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="password" class="form-label">Password</label>
                        <div class="input-group">
                            <span class="input-group-text">
                                <i class="bi bi-lock"></i>
                            </span>
                            <input type="password" class="form-control" id="password" name="password" 
                                   placeholder="Enter your password" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="remember" name="remember">
                            <label class="form-check-label" for="remember">
                                Remember me
                            </label>
                        </div>
                    </div>
                    
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <div class="copyright">
            &copy; <?= date('Y') ?> Inventory Management System. All rights reserved.
        </div>
    </div>
    
    <!-- Use CDN for Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>




