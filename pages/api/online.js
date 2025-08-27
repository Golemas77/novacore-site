import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const {
    DB_HOST = '127.0.0.1',
    DB_PORT = '3306',
    DB_USER = 'root',
    DB_PASS = '',
    ACORE_CHAR_DB = 'acore_characters',
    ACORE_PLAYERBOTS_DB = 'acore_playerbots',
    ADMIN_API_TOKEN,
  } = process.env;

  // Paprasta apsauga: šitą endpointą gali kviesti tik su teisingu tokenu
  const token = req.headers['x-admin-token'];
  if (!ADMIN_API_TOKEN || token !== ADMIN_API_TOKEN) {
    return res.status(403).json({ ok: false, error: 'Forbidden' });
  }

  let conn;
  try {
    conn = await mysql.createConnection({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASS,
    });

    // Bendras online
    const [[{ total }]] = await conn.query(
      `SELECT COUNT(*) AS total FROM \`${ACORE_CHAR_DB}\`.characters WHERE online = 1`
    );

    // Botų online (per playerbots_random_bots)
    let bots = 0;
    try {
      const [[{ bots: botsCount }]] = await conn.query(
        `SELECT COUNT(*) AS bots
         FROM \`${ACORE_CHAR_DB}\`.characters c
         JOIN \`${ACORE_PLAYERBOTS_DB}\`.playerbots_random_bots rb
           ON c.guid = rb.bot
         WHERE c.online = 1`
      );
      bots = botsCount || 0;
    } catch (e) {
      // Jei nėra playerbots schemos/lentelės – nelaikom klaida, laikom 0
      bots = 0;
    }

    const players = Math.max(0, (total || 0) - (bots || 0));
    return res.status(200).json({ ok: true, total, bots, players });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  } finally {
    if (conn) await conn.end();
  }
}