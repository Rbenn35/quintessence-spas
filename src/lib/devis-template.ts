/**
 * Rendu HTML du devis (design « Proposition 3 » validé), avec styles en ligne
 * pour être compatible email. Réutilisé pour l'aperçu back-office et, plus
 * tard, pour l'envoi automatique.
 */
import { applyDevisVars } from "./devis";

export interface DevisLineRow {
  label: string;
  sub?: string;
  price: number;
  oldPrice?: number;
  /** Ligne offerte : prix barré + « Offert ». */
  offered?: boolean;
}

export interface DevisData {
  /** Dictionnaire complet des variables remplaçables dans le texte ({cle}). */
  vars: Record<string, string>;
  /** Gabarit du titre ({cle} + *mise en avant* + retours ligne). */
  title: string;
  /** Objet du mail déjà rendu (affiché en bandeau d'aperçu uniquement). */
  subjectPreview?: string;
  productName: string;
  productSpecs: string;
  productImage: string;
  ref: string;
  dateLabel: string;
  validityDays: number;
  intro: string;
  lines: DevisLineRow[];
  total: number;
  savings: number;
  contactEmail: string;
  logoUrl: string;
  ctaUrl: string;
}

const C = {
  ink: "#13313d",
  dark: "#1b2a37",
  accent: "#2f86a3",
  teal: "#7fb6cf",
  muted: "#5d7681",
  line: "#e7eef1",
  cream: "#f5f9fb",
};
const serif = "'Fraunces', Georgia, 'Times New Roman', serif";
const sans = "'Inter', Arial, Helvetica, sans-serif";

function euro(n: number): string {
  return `${n.toLocaleString("fr-FR")} €`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Rend un titre : variables, échappement, *mise en avant* puis retours ligne. */
function renderTitleHtml(template: string, vars: Record<string, string>): string {
  let s = esc(applyDevisVars(template, vars));
  s = s.replace(
    /\*([^*]+)\*/g,
    `<em style="font-style:italic;color:${C.accent}">$1</em>`,
  );
  return s.replace(/\r?\n/g, "<br>");
}

export function renderDevisHtml(d: DevisData): string {
  const intro = applyDevisVars(d.intro, d.vars);
  const titleHtml = renderTitleHtml(d.title, d.vars);

  const lines = d.lines
    .map((l, i) => {
      const last = i === d.lines.length - 1;
      const price = l.offered
        ? `<span style="color:${C.muted};text-decoration:line-through;font-size:13px;margin-right:10px">${euro(
            l.price,
          )}</span><span style="color:${C.accent};font-weight:600">Offert</span>`
        : l.oldPrice
        ? `<span style="color:${C.muted};text-decoration:line-through;font-size:13px;margin-right:10px">${euro(
            l.oldPrice,
          )}</span>${euro(l.price)}`
        : euro(l.price);
      const sub = l.sub
        ? `<div style="font-size:12.5px;color:${C.muted}">${esc(l.sub)}</div>`
        : "";
      return `<tr><td style="padding:14px 18px;${
        last ? "" : `border-bottom:1px solid ${C.line};`
      }font-size:15px">${esc(l.label)}${sub}</td><td style="padding:14px 18px;${
        last ? "" : `border-bottom:1px solid ${C.line};`
      }font-size:15px;text-align:right;white-space:nowrap">${price}</td></tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:32px 16px;background:#fbfdfe;font-family:${sans};color:${C.ink};font-weight:300;line-height:1.65">
${
  d.subjectPreview
    ? `<div style="max-width:600px;margin:0 auto 14px;padding:11px 16px;background:#eef4f6;border-radius:8px;font-size:13px;color:${C.ink}"><strong style="color:${C.muted};font-weight:600">Objet :</strong> ${esc(
        d.subjectPreview,
      )}</div>`
    : ""
}
<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;padding:44px 48px 36px;box-shadow:0 6px 30px rgba(19,49,61,.06)">
  <div style="text-align:center;margin-bottom:28px"><img src="${d.logoUrl}" alt="Quintessence Spas" style="height:46px" /></div>
  <div style="font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:${C.muted};text-align:center">Devis personnalisé</div>
  <h1 style="font-family:${serif};font-weight:500;font-size:34px;text-align:center;line-height:1.25;margin:12px 0 0;color:${C.ink}">${titleHtml}</h1>
  <p style="color:${C.muted};font-size:15px;margin:20px auto 0;text-align:center;max-width:440px">${esc(
    intro,
  )}</p>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;margin-top:26px;border:1px solid ${C.line};border-radius:14px;background:${C.cream}">
    <tr>
      ${
        d.productImage
          ? `<td width="94" style="padding:14px 0 14px 14px;vertical-align:middle"><img src="${d.productImage}" alt="" width="80" height="80" style="width:80px;height:80px;border-radius:10px;object-fit:cover;display:block" /></td>`
          : ""
      }
      <td style="padding:14px;vertical-align:middle"><div style="font-family:${serif};font-size:20px;color:${C.ink}">${esc(
        d.productName,
      )}</div><div style="font-size:12.5px;color:${C.muted}">${esc(
        d.productSpecs,
      )}</div></td>
    </tr>
  </table>

  <div style="margin-top:18px;border:1px solid ${C.line};border-radius:14px;overflow:hidden">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:${C.cream};border-bottom:1px solid ${C.line}">
      <tr>
        <td style="padding:12px 18px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${C.muted}">Devis ${esc(
          d.ref,
        )} · ${esc(d.dateLabel)}</td>
        <td align="right" style="padding:12px 18px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${C.muted};text-align:right">Montant</td>
      </tr>
    </table>
    <table style="width:100%;border-collapse:collapse"><tbody>${lines}</tbody></table>
  </div>

  <table style="width:100%;border-collapse:collapse;margin-top:18px;background:${C.dark};border-radius:8px;overflow:hidden">
    <tr>
      <td style="padding:20px 24px;font-family:${serif};font-size:18px;color:#fff"><b style="font-weight:600">Total TTC</b> <span style="color:${C.teal}">· remise ${euro(
        d.savings,
      )}</span></td>
      <td style="padding:20px 26px;font-family:${serif};font-size:22px;color:#fff;text-align:right;border-left:1px solid rgba(255,255,255,.14);white-space:nowrap">${euro(
        d.total,
      )}</td>
    </tr>
  </table>

  <a href="${d.ctaUrl}" style="display:block;text-align:center;background:${C.dark};color:#fff;font-weight:600;text-decoration:none;padding:18px;border-radius:40px;margin-top:16px;letter-spacing:.06em;font-size:14px">VALIDER MON DEVIS</a>

  <p style="text-align:center;font-size:12.5px;color:${C.muted};margin-top:22px;line-height:1.95">Paiement 100 % sécurisé · Livraison partout en France<br>Offre valable ${
    d.validityDays
  } jours · Soit ${euro(d.savings)} d'économie<br>${esc(d.contactEmail)}</p>
</div>
</body></html>`;
}

/* ------------------------- E-mail de demande générique -------------------- */

export interface InfoData {
  vars: Record<string, string>;
  title: string;
  body: string;
  subjectPreview?: string;
  contactEmail: string;
  logoUrl: string;
  ctaUrl: string;
  ctaLabel: string;
}

/** Corps : lignes « - » regroupées en liste, autres lignes en paragraphes. */
function renderBodyHtml(text: string): string {
  const lines = text.split(/\r?\n/);
  let html = "";
  let inList = false;
  for (const raw of lines) {
    const line = raw.trim();
    const isItem = line.startsWith("- ") || line.startsWith("• ");
    if (isItem) {
      if (!inList) {
        html += `<ul style="margin:12px 0;padding-left:20px;color:${C.muted}">`;
        inList = true;
      }
      html += `<li style="margin:6px 0">${esc(line.replace(/^[-•]\s+/, ""))}</li>`;
    } else {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      if (line)
        html += `<p style="margin:12px 0;color:${C.muted};font-size:15px">${esc(
          line,
        )}</p>`;
    }
  }
  if (inList) html += "</ul>";
  return html;
}

export function renderInfoHtml(d: InfoData): string {
  const titleHtml = renderTitleHtml(d.title, d.vars);
  const bodyHtml = renderBodyHtml(applyDevisVars(d.body, d.vars));
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:32px 16px;background:#fbfdfe;font-family:${sans};color:${C.ink};font-weight:300;line-height:1.65">
${
  d.subjectPreview
    ? `<div style="max-width:600px;margin:0 auto 14px;padding:11px 16px;background:#eef4f6;border-radius:8px;font-size:13px;color:${C.ink}"><strong style="color:${C.muted};font-weight:600">Objet :</strong> ${esc(
        d.subjectPreview,
      )}</div>`
    : ""
}
<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;padding:44px 48px 36px;box-shadow:0 6px 30px rgba(19,49,61,.06)">
  <div style="text-align:center;margin-bottom:28px"><img src="${d.logoUrl}" alt="Quintessence Spas" style="height:46px" /></div>
  <div style="font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:${C.muted};text-align:center">Votre demande</div>
  <h1 style="font-family:${serif};font-weight:500;font-size:34px;text-align:center;line-height:1.25;margin:12px 0 18px;color:${C.ink}">${titleHtml}</h1>
  ${bodyHtml}
  <a href="${d.ctaUrl}" style="display:block;text-align:center;background:${C.dark};color:#fff;font-weight:600;text-decoration:none;padding:18px;border-radius:40px;margin-top:24px;letter-spacing:.06em;font-size:14px">${esc(
    d.ctaLabel,
  )}</a>
  <p style="text-align:center;font-size:12.5px;color:${C.muted};margin-top:22px;line-height:1.95">Réponse personnalisée sous 48&nbsp;h · Sans engagement<br>${esc(
    d.contactEmail,
  )}</p>
</div>
</body></html>`;
}
