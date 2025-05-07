<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class InitialDataSeeder extends Seeder
{
    public function run()
    {
        $sql = file_get_contents(ROOTPATH . 'app/Database/Seeds/ci4_ims_db.sql');
        
        // Split SQL by semicolon to execute multiple queries
        $queries = explode(';', $sql);
        
        foreach ($queries as $query) {
            if (trim($query) != '') {
                $this->db->query($query);
            }
        }
    }
}