import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { schema } from '@/resources';

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Parse data from the incoming request body
    const { email, name, message } = await request.json();

    const { data, error } = await resend.emails.send({
      // Until you verify a domain, use this 'from' address
      from: 'onboarding@resend.dev',
      to: [schema.email], // The recipient's email
      subject: `New Message from ${name}`,
      html: `<p>You received a new message from your contact form:</p>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>`,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({
        success: true,
        data
    });
  } catch (error) {
    return NextResponse.json({
        error: 'Failed to send email'
    }, { status: 500 });
  }
}
