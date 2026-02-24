<?php

namespace Database\Seeders;

use App\Models\Discount;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DiscountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default special offers (use firstOrCreate to avoid duplicates)
        Discount::firstOrCreate(
            ['code' => 'SUMMER50'],
            [
                'type' => 'percentage',
                'value' => 50,
                'title' => 'Summer Collection',
                'description' => 'Get up to 50% off on our summer collection',
                'link' => '/products',
                'min_order_amount' => 0,
                'max_uses' => null,
                'expires_at' => Carbon::now()->addMonths(3),
                'active' => true,
            ]
        );

        Discount::firstOrCreate(
            ['code' => 'SAVE30'],
            [
                'type' => 'percentage',
                'value' => 30,
                'title' => 'Special 30% Off',
                'description' => 'Save 30% on selected items',
                'link' => '/products',
                'min_order_amount' => 0,
                'max_uses' => null,
                'expires_at' => Carbon::now()->addMonths(3),
                'active' => true,
            ]
        );

        Discount::firstOrCreate(
            ['code' => 'EXTRA25'],
            [
                'type' => 'percentage',
                'value' => 25,
                'title' => 'Extra 25% Discount',
                'description' => 'Enjoy 25% discount on our entire catalog',
                'link' => '/products',
                'min_order_amount' => 0,
                'max_uses' => null,
                'expires_at' => Carbon::now()->addMonths(3),
                'active' => true,
            ]
        );
    }
}
