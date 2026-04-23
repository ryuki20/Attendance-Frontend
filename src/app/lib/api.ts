const BASE_URL = "http://localhost:8080/api/v1";

function getToken(): string {
  return sessionStorage.getItem("token") ?? "";
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
}
