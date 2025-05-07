<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Products extends ResourceController
{
    protected $modelName = 'App\Models\ProductModel';
    protected $format    = 'json';

    public function index()
    {
        try {
            $products = $this->model->getWithCategories();
            return $this->respond([
                'status' => 'success',
                'data' => $products
            ]);
        } catch (\Exception $e) {
            log_message('error', '[Products::index] ' . $e->getMessage());
            return $this->failServerError('Failed to fetch products');
        }
    }

    public function create()
    {
        try {
            $input = $this->request->getJSON(true);

            if (empty($input['name']) || empty($input['category_id']) || 
                !isset($input['stock']) || !isset($input['price'])) {
                return $this->fail('All fields are required');
            }

            $productId = $this->model->insert([
                'name' => $input['name'],
                'category_id' => $input['category_id'],
                'stock' => $input['stock'],
                'price' => $input['price']
            ]);

            if (!$productId) {
                return $this->fail($this->model->errors());
            }

            return $this->respondCreated([
                'status' => 'success',
                'message' => 'Product added successfully',
                'id' => $productId
            ]);

        } catch (\Exception $e) {
            log_message('error', '[Products::create] ' . $e->getMessage());
            return $this->failServerError('Failed to create product');
        }
    }

    public function update($id = null)
    {
        try {
            $input = $this->request->getJSON(true);
            
            if (empty($input)) {
                return $this->fail('No data received');
            }

            if (!$this->model->update($id, $input)) {
                return $this->fail($this->model->errors());
            }

            return $this->respond([
                'status' => 'success',
                'message' => 'Product updated successfully'
            ]);

        } catch (\Exception $e) {
            log_message('error', '[Products::update] ' . $e->getMessage());
            return $this->failServerError('Failed to update product');
        }
    }

    public function show($id = null)
    {
        try {
            $product = $this->model->find($id);
            
            if (!$product) {
                return $this->failNotFound('Product not found');
            }

            return $this->respond([
                'status' => 'success',
                'data' => $product
            ]);

        } catch (\Exception $e) {
            log_message('error', '[Products::show] ' . $e->getMessage());
            return $this->failServerError('Failed to fetch product');
        }
    }

    public function delete($id = null)
    {
        try {
            if (!$this->model->delete($id)) {
                return $this->fail('Failed to delete product');
            }

            return $this->respondDeleted([
                'status' => 'success',
                'message' => 'Product deleted successfully'
            ]);

        } catch (\Exception $e) {
            log_message('error', '[Products::delete] ' . $e->getMessage());
            return $this->failServerError('Failed to delete product');
        }
    }
}