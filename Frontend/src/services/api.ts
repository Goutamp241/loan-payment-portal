/**
 * Base HTTP client for the Express backend (Railway / Render).
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError('Backend API URL is not configured. Set VITE_API_BASE_URL in .env', 0, 'NO_API_URL');
  }

  const { token, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const code = data.code as string | undefined;
    if (response.status === 401 && (code === 'SESSION_EXPIRED' || code === 'INVALID_TOKEN')) {
      window.dispatchEvent(new CustomEvent('repayment:session-expired'));
    }
    throw new ApiError(
      data.message ?? `Request failed with status ${response.status}`,
      response.status,
      data.code,
    );
  }

  return data as T;
}
