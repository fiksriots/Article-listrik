import {handlers, googleAuthConfigured} from '@/auth';
import type {NextRequest} from 'next/server';
export const dynamic = 'force-dynamic';
function unavailable() {return Response.json({error: 'Login Google belum dikonfigurasi.'}, {status: 503});}
export async function GET(request: NextRequest) {
  if (!googleAuthConfigured()) {
    if (request.nextUrl.pathname.endsWith('/session')) return Response.json(null);
    return unavailable();
  }
  return handlers.GET(request);
}
export async function POST(request: NextRequest) {
  if (!googleAuthConfigured()) return unavailable();
  return handlers.POST(request);
}
