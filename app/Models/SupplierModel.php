<?php

namespace App\Models;

use CodeIgniter\Model;

class SupplierModel extends Model
{
    protected $table = 'suppliers';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields = ['company_name', 'contact_person', 'email', 'phone'];
    protected $useTimestamps = true;

    protected $validationRules = [
        'company_name' => 'required|min_length[3]|max_length[255]',
        'contact_person' => 'required|min_length[3]|max_length[255]',
        'email' => 'required|valid_email|max_length[255]',
        'phone' => 'required|min_length[6]|max_length[50]'
    ];
}