<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        $data = [
            'username' => 'admin',
            'password' => password_hash('admin123', PASSWORD_DEFAULT),
            'name'     => 'Administrator',
            'email'    => 'admin@example.com',
            'role'     => 'admin',
            'status'   => 'active',
        ];

        $this->db->table('users')->insert($data);
    }
}