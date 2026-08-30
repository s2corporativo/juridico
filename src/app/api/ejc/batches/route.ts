import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const lotes = await db.ingestBatch.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({
      lotes: lotes.map((l) => ({
        ...l,
        fontesConsultadas: l.fontesConsultadas ? JSON.parse(l.fontesConsultadas) : [],
        relatorio: l.relatorio ? JSON.parse(l.relatorio) : null,
      })),
    });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao listar lotes', detalhe: String(e) }, { status: 500 });
  }
}
