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
        console.log(response);
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
}

export default ApiService;
