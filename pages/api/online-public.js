import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const {
    DB_HOST = '127.0.0.1',
    DB_PORT = '3306',
    DB_USER = 'root',
    DB_PASS = '',
    ACORE_CHAR_DB = 'acore_characters',
  } = process.env;

  let conn;
  try {
    conn = await mysql.createConnection({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASS,
    });

    const [[{ total }]] = await conn.query(
      `SELECT COUNT(*) AS total FROM \`${ACORE_CHAR_DB}\`.characters WHERE online = 1`
    );

    return res.status(200).json({ ok: true, total: total || 0 });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  } finally {
    if (conn) await conn.end();
  }
}