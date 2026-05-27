import { NextResponse } from 'next/server';
import { getIntegrationValue } from '@/lib/server/credentials';

export const runtime = 'nodejs';

const measurementIdPattern = /^G-[A-Z0-9]+$/;

function normalizeMeasurementId(value: string) {
  const normalized = value.trim().toUpperCase();
  return measurementIdPattern.test(normalized) ? normalized : '';
}

export async function GET() {
  const fromDb = await getIntegrationValue('GA4', 'measurement_id').catch(() => '');
  const measurementId = normalizeMeasurementId(
    fromDb || process.env.GA4_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID || '',
  );

  return NextResponse.json(
    { measurementId },
    {
      headers: {
        'Cache-Control': 'private, max-age=300',
      },
    },
  );
}
