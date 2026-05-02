// app/api/verify/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = await fetch('https://api.didit.me/v1/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIDIT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflowId: process.env.NEXT_PUBLIC_DIDIT_WORKFLOW_ID,
        features: ['liveness', 'face-match'], // Adjust based on your workflow
      }),
    });

    const data = await response.json();
    return NextResponse.json({ url: data.url });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}