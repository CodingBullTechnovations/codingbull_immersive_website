/**
 * Hostinger SMTP readiness check for lead notification email (production only).
 *
 *   npm run check:email              offline: validates configuration only
 *   npm run check:email -- --verify  also connects and authenticates to Hostinger
 *                                    (Nodemailer verify). It never sends an email.
 *
 * Mirrors src/lib/server/env.ts + src/lib/server/email.ts: Resend is used whenever
 * RESEND_API_KEY is any non-empty string (raw truthiness, no trimming), before SMTP.
 * Never prints secret values, loaded configuration, or raw exception messages
 * (SMTP server responses can echo credentials or addresses).
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const EXPECTED = Object.freeze({
  host: 'smtp.hostinger.com',
  port: '465',
  mailbox: 'pranshu@codingbullz.com',
});

const PLACEHOLDER_PASSWORDS = /^(?:password|passw0rd|changeme|change[-_ ]?me|change[-_ ]?this|replace[-_ ]?me|your[-_ ]?(?:smtp[-_ ]?|mailbox[-_ ]?|email[-_ ]?)?password|smtp[-_ ]?password|mailbox[-_ ]?password|placeholder|example|secret|todo|tbd|test|x+|\*+|\.+|<[^>]*>|\[[^\]]*\]|\{[^}]*\}|\$\{[^}]*\})$/i;
// One bare address: no whitespace (incl. CR/LF), separators, quotes or angle brackets.
const BARE_ADDRESS = /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]+$/;
// One display-name/address pair: optional plain or quoted name, then exactly one <address>.
const NAMED_ADDRESS = /^(?:"[^"<>\r\n,;]*"|[^"<>\r\n,;]*?)\s*<([^<>]+)>$/;
const USAGE = 'Usage: npm run check:email [-- --verify]\n  (no option)  offline configuration check\n  --verify     also authenticate to Hostinger SMTP; sends no email';

/** Returns the lowercased address for exactly one mailbox, or null. */
export function parseSingleMailbox(value) {
  if (typeof value !== 'string' || /[,;\r\n]/.test(value)) return null;
  const trimmed = value.trim();
  if (BARE_ADDRESS.test(trimmed)) return trimmed.toLowerCase();
  if ((trimmed.match(/</g) ?? []).length !== 1 || (trimmed.match(/>/g) ?? []).length !== 1) return null;
  const named = NAMED_ADDRESS.exec(trimmed);
  return named && BARE_ADDRESS.test(named[1]) ? named[1].toLowerCase() : null;
}

/** Pure check of an environment object. Returns { ok, results: [{ ok, label, hint? }] } with no values. */
export function checkEmailConfig(env) {
  const results = [];
  const add = (ok, label, hint) => results.push(ok ? { ok, label } : { ok, label, hint });
  const raw = (key) => (typeof env[key] === 'string' ? env[key] : undefined);

  const resend = raw('RESEND_API_KEY');
  add(!resend, 'RESEND_API_KEY is empty or unset',
    'It is non-empty (whitespace counts), so Resend is the active provider and is tried before SMTP. STOP: the owner must decide whether to keep Resend or switch to Hostinger SMTP before changing it.');

  add(raw('SMTP_HOST') === EXPECTED.host, `SMTP_HOST is ${EXPECTED.host}`,
    `Set SMTP_HOST exactly to ${EXPECTED.host}.`);

  add(raw('SMTP_PORT') === EXPECTED.port, `SMTP_PORT is ${EXPECTED.port} (SSL)`,
    `Set SMTP_PORT exactly to ${EXPECTED.port}. Runtime enables SSL only when the port is 465; an unset port defaults to 587.`);

  add(raw('SMTP_USER') === EXPECTED.mailbox, `SMTP_USER is ${EXPECTED.mailbox}`,
    `Set SMTP_USER exactly to the full mailbox address ${EXPECTED.mailbox}.`);

  const password = raw('SMTP_PASSWORD');
  add(typeof password === 'string' && password.trim() !== '' && !PLACEHOLDER_PASSWORDS.test(password.trim()) && password.trim().toLowerCase() !== EXPECTED.mailbox,
    'SMTP_PASSWORD is set and does not look like a placeholder',
    'Missing, blank, or looks like a placeholder. Enter the real mailbox password privately (escape any $ as \\$). --verify confirms it actually works.');

  // Runtime sender: SMTP_FROM ?? EMAIL_FROM ?? default ('' counts as set because of ??).
  const effectiveFrom = raw('SMTP_FROM') ?? raw('EMAIL_FROM') ?? 'CodingBull <hello@codingbullz.com>';
  add(parseSingleMailbox(effectiveFrom) === EXPECTED.mailbox, `SMTP sender (SMTP_FROM, else EMAIL_FROM) is exactly one address: ${EXPECTED.mailbox}`,
    `Set SMTP_FROM to "CodingBull <${EXPECTED.mailbox}>" (one address; no commas, semicolons or line breaks). Hostinger expects the sender to match the authenticated mailbox.`);

  add(parseSingleMailbox(raw('EMAIL_FROM')) === EXPECTED.mailbox, `EMAIL_FROM is exactly one address: ${EXPECTED.mailbox}`,
    `Set EMAIL_FROM to "CodingBull <${EXPECTED.mailbox}>" so skipped/Resend delivery records show the same sender.`);

  const contact = raw('CONTACT_EMAIL');
  add(typeof contact === 'string' && BARE_ADDRESS.test(contact), 'CONTACT_EMAIL is exactly one bare address',
    'Set CONTACT_EMAIL explicitly to one inbox address (no name, commas, semicolons, spaces or line breaks); unset falls back to a built-in default.');

  return { ok: results.every((result) => result.ok), results };
}

/** Map a Nodemailer/Node error to a safe category; never returns the raw message. */
export function describeVerifyError(error) {
  const code = typeof error?.code === 'string' ? error.code : '';
  const safeCode = /^[A-Z0-9_]{2,40}$/.test(code) ? code : 'UNKNOWN';
  if (code === 'EAUTH') return { category: 'authentication rejected', code: safeCode, hint: 'Check SMTP_USER/SMTP_PASSWORD privately (including \\$ escaping).' };
  if (['EDNS', 'ENOTFOUND', 'EAI_AGAIN'].includes(code)) return { category: 'DNS lookup failed', code: safeCode, hint: 'Check server DNS/network.' };
  if (/CERT|SELF_SIGNED|UNABLE_TO_VERIFY|ERR_TLS|EPROTO/.test(code)) return { category: 'TLS certificate validation failed', code: safeCode, hint: 'Do not disable certificate checks; confirm the host is smtp.hostinger.com.' };
  if (['ETIMEDOUT', 'ECONNECTION', 'ESOCKET', 'ECONNREFUSED', 'ECONNRESET', 'EHOSTUNREACH', 'ENETUNREACH'].includes(code)) return { category: 'connection failed or timed out', code: safeCode, hint: 'Check that outbound port 465 is allowed from this server.' };
  return { category: 'SMTP verification failed', code: safeCode, hint: 'Re-run later; check Hostinger mailbox status.' };
}

/** Load env files exactly as `next start` does in production, even if NODE_ENV is set to test or development. */
export async function loadProductionEnv(dir) {
  const { default: nextEnv } = await import('@next/env');
  const silent = { info() {}, error() {} };
  const hadNodeEnv = Object.prototype.hasOwnProperty.call(process.env, 'NODE_ENV');
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    const { loadedEnvFiles } = nextEnv.loadEnvConfig(dir, false, silent, true);
    return loadedEnvFiles.map((file) => path.basename(file.path));
  } finally {
    if (hadNodeEnv) process.env.NODE_ENV = previousNodeEnv;
    else delete process.env.NODE_ENV;
  }
}

async function verifySmtp(env) {
  const { default: nodemailer } = await import('nodemailer');
  const transport = nodemailer.createTransport({
    host: EXPECTED.host,
    port: Number(EXPECTED.port),
    secure: true, // implicit TLS on 465; default certificate validation stays on
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
    dnsTimeout: 10_000,
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
    logger: false,
    debug: false,
  });
  try {
    await transport.verify(); // connect + TLS + AUTH only; no message is sent
    return { ok: true };
  } catch (error) {
    return { ok: false, ...describeVerifyError(error) };
  } finally {
    transport.close();
  }
}

export async function main(argv = process.argv.slice(2), dir = websiteRoot) {
  const unknown = argv.filter((arg) => arg !== '--verify' && arg !== '--help' && arg !== '-h');
  if (unknown.length || argv.length > 1) {
    console.error(`Unexpected argument(s). ${USAGE}`);
    return 2;
  }
  if (argv[0] === '--help' || argv[0] === '-h') {
    console.log(USAGE);
    return 0;
  }

  const files = await loadProductionEnv(dir);
  console.log(`Production env files loaded (names only): ${files.length ? files.join(', ') : 'none'}; process environment takes precedence.`);

  const { ok, results } = checkEmailConfig(process.env);
  for (const result of results) {
    console.log(`${result.ok ? 'PASS' : 'FAIL'}  ${result.label}${result.ok ? '' : `\n      -> ${result.hint}`}`);
  }
  if (!ok) {
    console.log('Configuration check failed. No connection attempted.');
    return 1;
  }
  console.log('Offline configuration check passed.');
  if (argv[0] !== '--verify') {
    console.log('Run with -- --verify to test SMTP login (sends no email).');
    return 0;
  }

  const verified = await verifySmtp(process.env);
  if (verified.ok) {
    console.log(`PASS  Authenticated to ${EXPECTED.host}:${EXPECTED.port} over TLS. No email was sent.`);
    return 0;
  }
  console.log(`FAIL  SMTP verify: ${verified.category} (code ${verified.code}). ${verified.hint} No email was sent.`);
  return 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().then((code) => { process.exitCode = code; }, () => {
    console.error('Email configuration check failed unexpectedly. No email was sent.');
    process.exitCode = 1;
  });
}
