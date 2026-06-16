import nodemailer from "nodemailer";

/**
 * Envoi d'e-mails via SMTP (Gmail / Google Workspace).
 * Inerte tant que SMTP_USER + SMTP_PASSWORD ne sont pas définis : la fonction
 * journalise et renvoie false, sans rien casser. Dès que les identifiants sont
 * fournis (mot de passe d'application Google), les envois partent réellement.
 */
const host = process.env.SMTP_HOST || "smtp.gmail.com";
const port = Number(process.env.SMTP_PORT || 465);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASSWORD;
const contactEmail = process.env.CONTACT_EMAIL || user || "";

export const emailConfigured = Boolean(user && pass);
export const EMAIL_FROM = `Quintessence Spas <${user || "contact@quintessencespas.com"}>`;
export const CONTACT_EMAIL = contactEmail;

let transporter: nodemailer.Transporter | null = null;
function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user: user as string, pass: pass as string },
    });
  }
  return transporter;
}

export interface MailInput {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/** Envoie un e-mail. Renvoie true si parti, false si non configuré/échec. */
export async function sendMail(input: MailInput): Promise<boolean> {
  if (!emailConfigured) {
    console.warn(
      `[email] non configuré (SMTP_USER/PASSWORD manquants) — envoi ignoré : "${input.subject}" → ${input.to}`,
    );
    return false;
  }
  try {
    await getTransporter().sendMail({
      from: EMAIL_FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
      ...(input.replyTo ? { replyTo: input.replyTo } : {}),
    });
    return true;
  } catch (err) {
    console.error("[email] échec d'envoi :", err);
    return false;
  }
}
