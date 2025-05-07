<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Suppliers extends ResourceController
{
    protected $modelName = 'App\Models\SupplierModel';
    protected $format    = 'json';

    public function index()
    {
        try {
            $suppliers = $this->model->findAll();
            return $this->respond([
                'status' => 'success',
                'data' => $suppliers
            ]);
        } catch (\Exception $e) {
            log_message('error', '[Suppliers::index] ' . $e->getMessage());
            return $this->failServerError('Failed to fetch suppliers');
        }
    }

    public function create()
    {
        try {
            $input = $this->request->getJSON(true);
            
            // Validate required fields
            $required = ['company_name', 'contact_person', 'email', 'phone'];
            foreach ($required as $field) {
                if (empty($input[$field])) {
                    return $this->fail("$field is required");
                }
            }

            $supplierId = $this->model->insert($input);

            if (!$supplierId) {
                return $this->fail($this->model->errors());
            }

            return $this->respondCreated([
                'status' => 'success',
                'message' => 'Supplier added successfully',
                'id' => $supplierId
            ]);

        } catch (\Exception $e) {
            log_message('error', '[Suppliers::create] ' . $e->getMessage());
            return $this->failServerError('Failed to create supplier');
        }
    }

    public function show($id = null)
    {
        try {
            $supplier = $this->model->find($id);
            
            if (!$supplier) {
                return $this->failNotFound('Supplier not found');
            }

            return $this->respond([
                'status' => 'success',
                'data' => $supplier
            ]);

        } catch (\Exception $e) {
            log_message('error', '[Suppliers::show] ' . $e->getMessage());
            return $this->failServerError('Failed to fetch supplier');
        }
    }

    public function update($id = null)
    {
        try {
            $input = $this->request->getJSON(true);
            
            if (empty($input)) {
                return $this->fail('No data received');
            }

            // Validate required fields
            $required = ['company_name', 'contact_person', 'email', 'phone'];
            foreach ($required as $field) {
                if (empty($input[$field])) {
                    return $this->fail("$field is required");
                }
            }

            if (!$this->model->update($id, $input)) {
                return $this->fail($this->model->errors());
            }

            return $this->respond([
                'status' => 'success',
                'message' => 'Supplier updated successfully'
            ]);

        } catch (\Exception $e) {
            log_message('error', '[Suppliers::update] ' . $e->getMessage());
            return $this->failServerError('Failed to update supplier');
        }
    }

    public function delete($id = null)
    {
        try {
            if (!$this->model->delete($id)) {
                return $this->fail('Failed to delete supplier');
            }

            return $this->respondDeleted(['status' => 'success', 'message' => 'Supplier deleted successfully']);
        } catch (\Exception $e) {
            log_message('error', '[Suppliers::delete] ' . $e->getMessage());
            return $this->failServerError('Failed to delete supplier');
        }
    }
}
