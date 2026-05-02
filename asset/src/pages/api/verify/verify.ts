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

    // Check if the response itself was not okay (e.g., 4xx or 5xx from Didit)
    if (!response.ok) {
      const errorData = await response.json(); // Try to parse error details
      console.error("Didit API error response:", response.status, errorData);
      return NextResponse.json(
        { error: `Didit API failed: ${errorData.message || 'Unknown error'}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ url: data.url });
  } catch (caughtError) { // Renamed 'error' to 'caughtError' to mark it as used
    console.error('Error creating Didit session:', caughtError); // Now 'caughtError' is used
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}