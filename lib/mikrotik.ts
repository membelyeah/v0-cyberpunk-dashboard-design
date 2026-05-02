export async function fetchMikroTik(path: string, options: RequestInit = {}) {
  const host = process.env.MIKROTIK_HOST;
  const port = process.env.MIKROTIK_PORT;
  const user = process.env.MIKROTIK_USER;
  const pass = process.env.MIKROTIK_PASS;
  const useHttp = process.env.MIKROTIK_USE_HTTP === "true";

  const protocol = useHttp ? "http" : "https";
  const baseUrl = `${protocol}://${host}:${port}/rest`;

  const auth = Buffer.from(`${user}:${pass}`).toString("base64");

  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`MikroTik API Error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}
