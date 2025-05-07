<?php

namespace App\Models;

use CodeIgniter\Model;

class CategoryModel extends Model
{
    protected $table = 'categories';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields = ['name'];
    protected $useTimestamps = true;
    
    public function getWithProductCount()
    {
        try {
            return $this->select('categories.*, COUNT(products.id) as product_count')
                        ->join('products', 'products.category_id = categories.id', 'left')
                        ->groupBy('categories.id')
                        ->findAll();
        } catch (\Exception $e) {
            log_message('error', '[CategoryModel::getWithProductCount] ' . $e->getMessage());
            return [];
        }
    }
}