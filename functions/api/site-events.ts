import { SITE_ORIGIN, validEvent } from '../_shared/site-events.ts';

const MAX_BYTES = 512;
function response(status: number) {
  return new Response(null, { status, headers: { 'Cache-Control': 'no-store, private', 'X-Content-Type-Options': 'nosniff' } });
}
export async function handleSiteEvent(request: Request, env: Partial<SiteEventsEnv>): Promise<Response> {
  if (request.method !== 'POST') return response(405);
  if (new URL(request.url).origin !== SITE_ORIGIN || request.headers.get('Origin') !== SITE_ORIGIN) return response(403);
  if (request.headers.get('DNT') === '1' || request.headers.get('Sec-GPC') === '1') return response(204);
  if (env.SITE_EVENTS_ENABLED !== 'true' || !env.SITE_EVENTS) return response(503);
  if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') return response(415);
  const length = request.headers.get('Content-Length');
  if (length && (!/^\d+$/.test(length) || Number(length) > MAX_BYTES)) return response(413);
  if (!request.body) return response(400);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BYTES) { await reader.cancel(); return response(413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const event: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true, ignoreBOM: false }).decode(bytes));
    if (!validEvent(event)) return response(400);
    // Fixed low-cardinality values only. The platform adds a timestamp.
    try {
      env.SITE_EVENTS.writeDataPoint({
        blobs: [event.event, event.page, event.target, event.source], doubles: [1],
      });
    } catch { return response(503); }
    return response(204);
  } catch {
    // Do not log request headers, body, full URL, or error details.
    return response(400);
  } finally { reader.releaseLock(); }
}
export const onRequest: PagesFunction<SiteEventsEnv> = ({ request, env }) =>
  handleSiteEvent(request, env);
