import bcrypt from "bcryptjs";

const password = "boba$";

const hashPassword = async () => {
    const hash = await bcrypt.hash(password, 10);
    console.log("Hash:", hash);
};

hashPassword();
