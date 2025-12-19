import pool from "../config/db.js";



export const findPenyediaByEmail = (email) => {
    return pool.query(`
        SELECT 
            u.id,
            u.name,
            u.email,
            u.password,
            r.role_name AS role
        FROM users u
        JOIN role r ON r.id = u.role_id
        WHERE u.email = $1 AND r.role_name = 'penyedia'
    `, [email]);
};

export const createPenyedia = async (name, email, hashedPassword) => {

    // ambil role_id penyedia
    const roleResult = await pool.query(
        `SELECT id FROM role WHERE role_name = 'penyedia'`
    );

    if (!roleResult.rows.length) {
        throw new Error("Role penyedia tidak ditemukan");
    }

    const roleId = roleResult.rows[0].id;

    // insert user
    const userRes = await pool.query(
        `INSERT INTO users (name, email, password, role_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, role_id`,
        [name, email, hashedPassword, roleId]
    );

    return userRes;
};
