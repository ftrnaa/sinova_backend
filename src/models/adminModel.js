import pool from "../config/db.js";

export const findAdminByEmail = async (email) => {
    const result = await pool.query(
        `
        SELECT u.id, u.name, u.email, u.password, r.role_name AS role
        FROM users u
        JOIN role r ON r.id = u.role_id
        WHERE u.email = $1 AND r.role_name = 'admin'
        `,
        [email]
    );

    return result.rows[0];
};

export const createAdmin = async (name, email, hashedPassword) => {

    // cari role_id = admin
    const role = await pool.query(
        `SELECT id FROM role WHERE role_name = 'admin'`
    );

    if (!role.rows.length)
        throw new Error("Role admin tidak ditemukan!");

    const roleId = role.rows[0].id;

    const result = await pool.query(
        `
        INSERT INTO users (name, email, password, role_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role_id
        `,
        [name, email, hashedPassword, roleId]
    );

    return result.rows[0];
};
