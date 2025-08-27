// pages/api/ping-db.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    const [[row]] = await conn.query('SELECT VERSION() AS v');
    return res.status(200).json({ ok: true, mysql: row.v });
  } catch (e) {
    return res
      .status(500)
      .json({ ok: false, error: String(e?.message ?? e) });
  } finally {
    if (conn) await conn.end();
  }
}