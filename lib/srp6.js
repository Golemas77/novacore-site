// AzerothCore SRP6 paskyros duomenys (salt + verifier). Slaptazodis NIEKUR nesaugomas - tik sis "parasas".
//   v = g ^ H(s || H(USERNAME ":" PASSWORD)) mod N,  g = 7, N = 0x894B...9BB7, baitai - little-endian
// Patikrinta pries tikra AzerothCore botu paskyros irasa (verifier sutapo).
import crypto from 'crypto';

const N = BigInt('0x894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7');
const G = 7n;

function modPow(base, exp, mod) {
  let result = 1n;
  base %= mod;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    exp >>= 1n;
  }
  return result;
}

function leToBigInt(buf) {
  let x = 0n;
  for (let i = buf.length - 1; i >= 0; i--) x = (x << 8n) | BigInt(buf[i]);
  return x;
}

function bigIntToLe32(x) {
  const out = Buffer.alloc(32);
  for (let i = 0; i < 32; i++) {
    out[i] = Number(x & 0xffn);
    x >>= 8n;
  }
  return out;
}

export function verifierFor(username, password, saltBuf) {
  const h1 = crypto.createHash('sha1').update(`${username.toUpperCase()}:${password.toUpperCase()}`).digest();
  const x = leToBigInt(crypto.createHash('sha1').update(Buffer.concat([saltBuf, h1])).digest());
  return bigIntToLe32(modPow(G, x, N));
}

export function makeRegistrationData(username, password) {
  const salt = crypto.randomBytes(32);
  const verifier = verifierFor(username, password, salt);
  return { salt: salt.toString('hex').toUpperCase(), verifier: verifier.toString('hex').toUpperCase() };
}
