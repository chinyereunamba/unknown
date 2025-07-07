interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(options: EmailOptions) {
  // For now, just log the email (you can integrate with your email service later)
  // console.log("Email would be sent:", {
  //   to: options.to,
  //   subject: options.subject,
  //   text: options.text,
  // });

  // TODO: Integrate with your email service (Resend, SendGrid, etc.)
  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'noreply@yourapp.com',
  //   to: options.to,
  //   subject: options.subject,
  //   text: options.text,
  //   html: options.html,
  // });
}
