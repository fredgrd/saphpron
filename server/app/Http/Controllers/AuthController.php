<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function fetch(Request $request)
    {
        $user_id = $request->user()->id;

        $user = User::find($user_id);

        if (!$user) {
            return response(['message' => 'User not found!'], 404);
        }

        return response($user, 200);
    }
    public function signup(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string'
        ]);

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => bcrypt($fields['password'])
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token,
        ];

        return response($response, 201);
    }

    public function signin(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        // Retrieve the user from email
        $user = User::where('email', $fields['email'])->first();

        if (!$user) {
            return response(['message' => 'Your credentials do not match!'], 401);
        }

        // Check for password match
        if (!Hash::check($fields['password'], $user->password)) {
            return response(['message' => 'Wrong password'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token,
        ];

        return response($response, 200);
    }

    public function signout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return [
            'message' => 'Logged out'
        ];
    }
}
