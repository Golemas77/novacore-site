// Bendros registracijos taisykles ir pagalbinės funkcijos (naudoja ir narsykle, ir API).
import crypto from 'crypto';

export const USERNAME_RE = /^[A-Za-z0-9]{3,16}$/;
export const PASSWORD_RE = /^[\x21-\x7E]{6,16}$/;   // spausdinami ASCII simboliai be tarpu, 6-16 ilgio (WoW klientas riboja iki 16)
export const EMAIL_RE = /^[a-z0-9._%+\-]{1,64}@[a-z0-9.\-]{1,190}\.[a-z]{2,24}$/;

const RESERVED = [/^RNDBOT/i, /^ADMIN/i, /^(NOVACORE|GAMEMASTER|MODERATOR|SYSTEM|ROOT|SERVER)$/i];

export function validateRegistration({ username, email, password }) {
  if (typeof username !== 'string' || !USERNAME_RE.test(username)) {
    return 'Vartotojo vardas turi būti 3-16 simbolių ir sudarytas tik iš lotyniškų raidžių bei skaitmenų.';
  }
  if (RESERVED.some((re) => re.test(username))) {
    return 'Šis vartotojo vardas rezervuotas, pasirink kitą.';
  }
  if (typeof email !== 'string' || email.length > 100 || !EMAIL_RE.test(email.toLowerCase())) {
    return 'Įvesk teisingą el. pašto adresą.';
  }
  if (typeof password !== 'string' || !PASSWORD_RE.test(password)) {
    return 'Slaptažodis turi būti 6-16 simbolių, be tarpų ir tik lotyniškais simboliais.';
  }
  if (password.toUpperCase() === username.toUpperCase()) {
    return 'Slaptažodis neturi sutapti su vartotojo vardu.';
  }
  return null;
}

// CRON_SECRET patikra (ta pati, kaip /api/push-online) laiko pastoviu budu
export function isAuthorized(req) {
  const expected = process.env.CRON_SECRET;
  const given = req.headers['x-cron-secret'];
  if (!expected || typeof given !== 'string') return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function clientKey(req) {
  const fwd = req.headers['x-forwarded-for'];
  const ip = (typeof fwd === 'string' && fwd.split(',')[0].trim()) || req.socket?.remoteAddress || 'nezinomas';
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 24);
}
