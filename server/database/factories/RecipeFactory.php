<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Recipe>
 */
class RecipeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->text(),
            'description' => fake()->text(),
            'prep_time' => fake()->numberBetween(0, 100),
            'is_favourite' => fake()->boolean(),
            'user_id' => fake()->numberBetween(0, 100),
            'media_url' => 'https://res.cloudinary.com/degzh4mwt/image/upload/v1686591518/olamn1i2p9wchhwopwyz.png'
        ];
    }
}
