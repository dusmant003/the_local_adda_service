const bcrypt = require('bcrypt');
const { executeQuery } = require('./config/db');

const createAdmin = async () => {
    try {
        const name = "dusmant meher";
        const email = "dusmantameher449@gmail.com";
        const password = "barsha@123";
        const role = "admin";

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await executeQuery(
            `INSERT INTO admins (name, email, password, role)
             VALUES (?, ?, ?, ?)`,
            [name, email, hashedPassword, role]
        );

        console.log("Admin created successfully");
        console.log("Admin ID:", result.insertId);

        process.exit(0);

    } catch (error) {
        console.error("Create admin error:", error.message);
        process.exit(1);
    }
};

createAdmin();