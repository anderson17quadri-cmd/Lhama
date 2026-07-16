export interface JarvisInfo {
  ok: boolean;
  versao: string;
  os: string;
  plataforma: string;
  basePath: string;
  hostname: string;
  ips: string[];
  crossDevice: boolean;
  porta: number;
}

export interface JarvisExecLogEntry {
  ts: string;
  comando: string;
  cwd: string;
  status: string;
  motivo?: string;
  exit?: number | null;
  resultado?: string;
}

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

async function jarvisFetch(
  baseUrl: string,
  token: string,
  path: string,
): Promise<any> {
  const url = normalizeBaseUrl(baseUrl) + path;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['X-Jarvis-Token'] = token;
  }
  const res = await fetch(url, {method: 'GET', headers});
  const text = await res.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {raw: text};
  }
  if (!res.ok) {
    const message = (data && (data.erro || data.motivo)) || `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
}

// GET /info — SO detectado, pasta base, IPs locais do servidor Jarvis.
export async function fetchJarvisInfo(
  baseUrl: string,
  token: string,
): Promise<JarvisInfo> {
  return jarvisFetch(baseUrl, token, '/info');
}

// GET /exec-log?limit=N — últimas entradas do log de comandos do servidor Jarvis.
export async function fetchJarvisExecLog(
  baseUrl: string,
  token: string,
  limit = 30,
): Promise<JarvisExecLogEntry[]> {
  const data = await jarvisFetch(baseUrl, token, `/exec-log?limit=${limit}`);
  return Array.isArray(data.log) ? data.log : [];
}
