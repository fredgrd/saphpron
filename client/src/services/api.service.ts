class ApiService {
  baseUrl: string = 'http://localhost:8000/api/';

  async fetch<T>(
    endpoint: string,
    options?: {
      body?: any;
      method?: string;
    }
  ): Promise<{ result?: T; error?: string }> {
    const { body, method } = options || {
      body: undefined,
      method: 'GET',
    };

    const token = localStorage.getItem('auth_token');

    try {
      const response = await fetch(this.baseUrl + endpoint, {
        method: method,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: body && JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        return { error };
      }

      const json = await response.json();

      return { result: json as T };
    } catch (error) {
      const typeError = error as TypeError;
      return { error: typeError.message };
    }
  }

  async simpleFetch(
    endpoint: string,
    options?: {
      body?: any;
      method?: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    const { body, method } = options || {
      body: undefined,
      method: 'GET',
    };

    const token = localStorage.getItem('auth_token');

    try {
      console.log("ADDRESS", this.baseUrl + endpoint)
      console.log("ADDRESS", method)
      const response = await fetch(this.baseUrl + endpoint, {
        method: method,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: body && JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error };
      } else {
        return { success: true };
      }
    } catch (error) {
      const typeError = error as TypeError;
      return { success: false, error: typeError.message };
    }
  }
}

export default ApiService;
