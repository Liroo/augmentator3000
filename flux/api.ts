export const fetcher = async (endpoint: string, opts: any = {}) => {
  const isOwnApi = !opts.api;
  const body = JSON.stringify(opts.body || undefined);
  const method = opts.method || 'GET';
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...opts.headers,
  };

  const url = isOwnApi ? `${endpoint}` : `${opts.api}${endpoint}`;

  const res = await fetch(url, {
    method: method || 'GET',
    body,
    headers,
  });

  let json: any;
  try {
    json = await res.json();
  } catch (_) {
    json = {};
  }

  if (res.status < 200 || res.status >= 300) {
    throw new Error(res.status.toString());
  }

  return json;
};

export function getApi(endpoint: string, opts: any = {}) {
  return fetcher(endpoint, opts);
}

export function postApi(endpoint: string, body: any = {}, opts: any = {}) {
  return fetcher(endpoint, {
    ...opts,
    body,
    method: 'POST',
  });
}

export function putApi(endpoint: string, body: any = {}, opts: any = {}) {
  return fetcher(endpoint, {
    ...opts,
    body,
    method: 'PUT',
  });
}

export function patchApi(endpoint: string, body: any = {}, opts: any = {}) {
  return fetcher(endpoint, {
    ...opts,
    body,
    method: 'PATCH',
  });
}

export function deleteApi(endpoint: string, body: any = {}, opts: any = {}) {
  return fetcher(endpoint, {
    ...opts,
    body,
    method: 'DELETE',
  });
}
