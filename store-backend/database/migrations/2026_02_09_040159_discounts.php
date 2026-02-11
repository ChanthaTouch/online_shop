<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();                    // e.g., SUMMER50
            $table->enum('type', ['percentage', 'fixed']);       // % off or fixed amount
            $table->decimal('value', 10, 2);                     // 50.00 for 50% or $50 off
            $table->decimal('min_order_amount', 10, 2)->default(0); // Minimum total to apply
            $table->integer('max_uses')->nullable();             // null = unlimited
            $table->integer('uses')->default(0);                 // Current uses count
            $table->timestamp('expires_at')->nullable();         // null = never expires
            $table->boolean('active')->default(true);
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};
