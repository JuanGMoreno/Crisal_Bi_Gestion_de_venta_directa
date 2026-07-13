import nodemailer from 'nodemailer';

let transporter;

function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_FROM);
}

function getTransporter() {
  if (!isSmtpConfigured()) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS
            }
          : undefined
    });
  }

  return transporter;
}

export const EmailService = {
  sendMail: async ({ to, subject, text, html }) => {
    const smtpTransporter = getTransporter();

    if (!smtpTransporter) {
      console.warn('SMTP no configurado. Se omite el envio de correo de alerta.');
      return { skipped: true, reason: 'SMTP_NOT_CONFIGURED' };
    }

    return await smtpTransporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html
    });
  },

  resetTransporterForTests: () => {
    transporter = undefined;
  }
};
