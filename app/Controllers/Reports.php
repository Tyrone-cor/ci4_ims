<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Reports extends BaseController
{
    protected $reportsModel;

    public function __construct()
    {
        $this->reportsModel = new \App\Models\ReportsModel();
    }

    public function index()
    {
        try {
            $reports = $this->reportsModel->findAll();
            return $this->response->setJSON([
                'success' => true,
                'data' => $reports
            ]);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Failed to load reports'
                ]);
        }
    }

    public function create()
    {
        try {
            $json = $this->request->getJSON();
            
            // Check if all required fields are present
            if (isset($json->title) && isset($json->type) && isset($json->description)) {
                $data = [
                    'title' => $json->title,
                    'type' => $json->type,
                    'data' => json_encode(['content' => $json->description]), // JSON encode the data
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ];
            } elseif (isset($json->title) && isset($json->reportContent)) {
                // Handle form with reportContent field
                $data = [
                    'title' => $json->title,
                    'type' => 'custom',
                    'data' => json_encode(['content' => $json->reportContent]), // JSON encode the data
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ];
            } elseif (isset($json->title) && isset($json->content)) {
                // Handle the older form format with content field
                $data = [
                    'title' => $json->title,
                    'type' => 'custom',
                    'data' => json_encode(['content' => $json->content]), // JSON encode the data
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ];
            } else {
                throw new \Exception('Missing required fields: ' . json_encode($json));
            }

            $insertResult = $this->reportsModel->insert($data);
            if (!$insertResult) {
                throw new \Exception('Validation failed: ' . json_encode($this->reportsModel->errors()));
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Report created successfully'
            ]);

        } catch (\Exception $e) {
            log_message('error', '[Reports::create] ' . $e->getMessage());
            return $this->response->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => $e->getMessage()
                ]);
        }
    }

    public function generateReport($type)
    {
        try {
            $data = [];
            switch ($type) {
                case 'inventory':
                    $db = \Config\Database::connect();
                    $data = $db->table('products')
                        ->select('products.*, categories.name as category_name')
                        ->join('categories', 'categories.id = products.category_id', 'left')
                        ->get()
                        ->getResultArray();
                    break;
                    
                case 'sales':
                    $data = ['message' => 'Sales report coming soon'];
                    break;
                    
                case 'suppliers':
                    $db = \Config\Database::connect();
                    $data = $db->table('suppliers')
                        ->get()
                        ->getResultArray();
                    break;
                    
                default:
                    return $this->response->setStatusCode(400)
                        ->setJSON([
                            'success' => false,
                            'message' => 'Invalid report type'
                        ]);
            }

            return $this->response->setJSON([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Failed to generate report: ' . $e->getMessage()
                ]);
        }
    }

    public function show($id = null)
    {
        try {
            $report = $this->reportsModel->find($id);
            
            if (!$report) {
                return $this->response->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Report not found'
                    ]);
            }
            
            return $this->response->setJSON([
                'success' => true,
                'data' => $report
            ]);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Failed to retrieve report'
                ]);
        }
    }

    public function delete($id = null)
    {
        try {
            $report = $this->reportsModel->find($id);
            
            if (!$report) {
                return $this->response->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Report not found'
                    ]);
            }
            
            if ($this->reportsModel->delete($id)) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Report deleted successfully'
                ]);
            }
            
            throw new \Exception('Failed to delete report');
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => $e->getMessage()
                ]);
        }
    }
}
