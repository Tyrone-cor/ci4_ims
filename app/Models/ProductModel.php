<?php

namespace App\Models;

use CodeIgniter\Model;

class ProductModel extends Model
{
    protected $table = 'products';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields = ['name', 'category_id', 'stock', 'price'];
    protected $useTimestamps = true;

    protected $validationRules = [
        'name' => 'required|min_length[3]|max_length[255]',
        'category_id' => 'required|numeric',
        'stock' => 'required|numeric|greater_than_equal_to[0]',
        'price' => 'required|numeric|greater_than[0]'
    ];

    public function getWithCategories()
    {
        return $this->select('products.*, categories.name as category_name')
                    ->join('categories', 'categories.id = products.category_id')
                    ->findAll();
    }
}