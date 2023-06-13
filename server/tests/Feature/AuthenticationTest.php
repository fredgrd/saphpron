<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Models\User;

class AuthenticationTest extends TestCase
{
    // SIGNUP
    public function testRequiredFieldsForSignup()
    {
        $this->json('POST', 'api/signup', [], ['Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The name field is required. (and 2 more errors)',
                'errors' => [
                    'name' => ['The name field is required.'],
                    'email' => ['The email field is required.'],
                    'password' => ['The password field is required.'],
                ]
            ]);
    }

    public function testFieldIsNotValidEmail()
    {
        $userData = [
            'name' => 'Federico',
            'email' => 'federico',
            'password' => '123456'
        ];

        $this->json('POST', 'api/signup', $userData, ['Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The email field must be a valid email address.',
                'errors' => [
                    'email' => [
                        'The email field must be a valid email address.'
                    ]
                ]
            ]);
    }

    public function testRepeatEmail()
    {
        $user = parent::createUser()['user'];

        $userData = [
            'name' => 'Federico',
            'email' => $user['email'],
            'password' => '123456'
        ];

        $this->json('POST', 'api/signup', $userData, ['Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The email has already been taken.',
                'errors' => [
                    'email' => [
                        'The email has already been taken.'
                    ]
                ]
            ]);
    }

    public function testSuccessfulSignup()
    {
        $userData = [
            'name' => 'Test',
            'email' => 'test@mail.com',
            'password' => '123456'
        ];

        $this->json('POST', 'api/signup', $userData, ['Accept' => 'application/json'])
            ->assertStatus(201)
            ->assertJsonStructure([
                'user' => [
                    'name',
                    'email',
                    'id'
                ],
                'token'
            ]);
    }

    // SIGNIN
    public function testRequiredFieldsForSignin()
    {
        $this->json('POST', 'api/signin', [], ['Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The email field is required. (and 1 more error)',
                'errors' => [
                    'email' => ['The email field is required.'],
                    'password' => ['The password field is required.'],
                ]
            ]);
    }

    public function testCredentialsDoNotMatch()
    {
        $userData = [
            'email' => 'federico@mail.com',
            'password' => '12345646'
        ];

        $this->json('POST', 'api/signin', $userData, ['Accept' => 'application/json'])
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Your credentials do not match!',
            ]);
    }

    public function testSuccessfulSignin()
    {

        $user = parent::createUser()['user'];

        $this->json('POST', 'api/signin', ['email' => $user['email'], 'password' => '123456'], ['Accept' => 'application/json'])
            ->assertStatus(200)
            ->assertJsonStructure([
                'user' => [
                    'name',
                    'email',
                    'id'
                ],
                'token'
            ]);
    }

    public function testUnauthenticatedSignout()
    {
        $this->json('POST', 'api/signout', [], ['Accept' => 'application/json'])
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.'
            ]);
    }

    public function testSuccessfulSignout()
    {
        $token = parent::createUser()['token'];

        $this
            ->json('post', '/api/signout', [], ['Authorization' => 'Bearer ' . $token])
            ->assertStatus(200)
            ->assertJson([
                'message' => 'Logged out'
            ]);
    }
}
