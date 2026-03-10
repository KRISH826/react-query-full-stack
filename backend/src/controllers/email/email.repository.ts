import { pool } from "../../db/db";

export async function getEmailTemplateRepo(name: string): Promise<{ subject: string; html_body: string } | null> {
    const { rows } = await pool.query(
        `SELECT subject, body_html AS html_body FROM email_templates WHERE name = $1`,
        [name]
    )
    return rows[0] || null;
}