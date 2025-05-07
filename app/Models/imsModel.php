<?php

namespace App\Models;
use CodeIgniter\Model;

class UsersModel extends Model
{
    protected $table = 'users'; // Table name
    protected $primaryKey = 'id'; // Primary key column

    protected $allowedFields = [
        'username', 
        'password', 
        'access'
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    protected $useSoftDeletes = true;
}


class ProductsModel extends Model
{
    protected $table = 'products'; // Table name
    protected $primaryKey = 'product_id'; // Primary key column

    protected $allowedFields = [
        'product_name', 
        'product_price', 
        'product_qty'
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    protected $useSoftDeletes = true;
}

class OrdersModel extends Model
{
    protected $table = 'categories'; // Table name
    protected $primaryKey = 'id'; // Primary key column

    protected $allowedFields = [
        'id',
        'category'
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    protected $useSoftDeletes = true;
}