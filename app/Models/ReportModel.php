<?php

namespace App\Models;

use CodeIgniter\Model;

class ReportModel extends Model
{
    protected $table = 'reports';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields = ['type', 'title', 'data'];
    protected $useTimestamps = true;

    public function generateStockReport()
    {
        $db = \Config\Database::connect();
        
        $query = $db->query("
            SELECT 
                p.name as product_name,
                c.name as category_name,
                p.stock,
                p.price,
                (p.stock * p.price) as total_value
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.stock DESC
        ");

        return [
            'title' => 'Stock Report - ' . date('Y-m-d'),
            'type' => 'stock',
            'data' => json_encode([
                'generated_at' => date('Y-m-d H:i:s'),
                'items' => $query->getResultArray()
            ])
        ];
    }

    public function generateSalesReport()
    {
        // This is a placeholder since we don't have sales data yet
        // You would typically join with a sales/transactions table
        return [
            'title' => 'Sales Report - ' . date('Y-m-d'),
            'type' => 'sales',
            'data' => json_encode([
                'generated_at' => date('Y-m-d H:i:s'),
                'summary' => [
                    'total_sales' => 0,
                    'total_items' => 0
                ]
            ])
        ];
    }
}