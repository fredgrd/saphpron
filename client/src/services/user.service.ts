import ApiService from './api.service';
import { User } from '../models/user.model';

interface AuthResult {
  user: User;
  token: string;
}

class UserService extends ApiService {
  async user(): Promise<{ user?: User; error?: string }> {
    const { result, error } = await this.fetch<User>('user', {
      method: 'GET',
    });

    if (error) {
      return { error };
    }

    if (!result) {
      return { error: 'No result from the server' };
    }

    return { user: result };
  }

  async signin(
    email: string,
    password: string
  ): Promise<{ user?: User; error?: string }> {
    const { result, error } = await this.fetch<AuthResult>('signin', {
      method: 'POST',
      body: {
        email,
        password,
      },
    });

    if (error) {
      return { error };
    }

    if (!result) {
      return { error: 'No result from the server' };
    }

    // Save token to local storage
    localStorage.setItem('auth_token', result.token);

    return { user: result.user };
  }

  async signup(
    name: string,
    email: string,
    password: string
  ): Promise<{ user?: User; error?: string }> {
    const { result, error } = await this.fetch<AuthResult>('signup', {
      method: 'POST',
      body: {
        name,
        email,
        password,
      },
    });

    if (error) {
      return { error };
    }

    if (!result) {
      return { error: 'No result from the server' };
    }

    // Save token to local storage
    localStorage.setItem('auth_token', result.token);

    return { user: result.user };
  }

  async signout(): Promise<{ success: boolean; error?: string }> {
    const { result, error } = await this.fetch<AuthResult>('signout', {
      method: 'POST',
    });

    if (error) {
      return { success: false, error };
    }

    if (!result) {
      return { success: false, error: 'No result from the server' };
    }

    // Save token to local storage
    localStorage.removeItem('auth_token');

    return { success: true };
  }
}

export default UserService;
