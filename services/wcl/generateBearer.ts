export async function generateWCLBearerToken(
  clientId: string,
  clientSecret: string,
): Promise<string> {
  const res = await fetch('https://www.warcraftlogs.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
    }),
  });

  if (!res.ok) throw new Error(`${res.status}`);

  const data = await res.json();

  return data.access_token;
}
