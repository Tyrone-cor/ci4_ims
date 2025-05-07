<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Categories extends ResourceController
{
    protected $modelName = 'App\Models\CategoryModel';
    protected $format    = 'json';

    public function __construct()
    {
        // Enable CSRF protection for this controller
        helper('form');
    }

    public function index()
    {
        try {
            $categories = $this->model->findAll();
            return $this->respond([
                'status' => 'success',
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            log_message('error', '[Categories::index] ' . $e->getMessage());
            return $this->failServerError('Failed to fetch categories');
        }
    }

    public function create()
    {
        try {
            $input = $this->request->getJSON(true);
            
            if (empty($input['name'])) {
                return $this->fail('Category name is required');
            }

            $categoryId = $this->model->insert($input);

            if (!$categoryId) {
                return $this->fail($this->model->errors());
            }

            return $this->respondCreated([
                'status' => 'success',
                'message' => 'Category added successfully',
                'id' => $categoryId
            ]);

        } catch (\Exception $e) {
            log_message('error', '[Categories::create] ' . $e->getMessage());
            return $this->failServerError('Failed to create category');
        }
    }

    public function delete($id = null)
    {
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['message' => 'Category deleted successfully']);
        }

        return $this->fail('Error deleting category');
    }

    public function show($id = null)
    {
        try {
            $category = $this->model->find($id);
            
            if (!$category) {
                return $this->failNotFound('Category not found');
            }

            return $this->respond([
                'status' => 'success',
                'data' => $category
            ]);

        } catch (\Exception $e) {
            log_message('error', '[Categories::show] ' . $e->getMessage());
            return $this->failServerError('Failed to fetch category');
        }
    }

    public function update($id = null)
    {
        try {
            $input = $this->request->getJSON(true);
            
            if (empty($input['name'])) {
                return $this->fail('Category name is required');
            }

            if (!$this->model->update($id, $input)) {
                return $this->fail($this->model->errors());
            }

            return $this->respond([
                'status' => 'success',
                'message' => 'Category updated successfully'
            ]);

        } catch (\Exception $e) {
            log_message('error', '[Categories::update] ' . $e->getMessage());
            return $this->failServerError('Failed to update category');
        }
    }
}