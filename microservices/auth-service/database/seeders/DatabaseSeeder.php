<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@gov.portal',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
        User::create([
            'name' => 'Gov Officer',
            'email' => 'officer@gov.portal',
            'password' => Hash::make('password'),
            'role' => 'officer',
        ]);
        User::create([
            'name' => 'John Citizen',
            'email' => 'citizen@gov.portal',
            'password' => Hash::make('password'),
            'role' => 'citizen',
            'national_id' => 'NID-001-2024',
        ]);
    }
}
