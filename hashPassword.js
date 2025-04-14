// backend/hashPassword.js
const bcrypt = require('bcryptjs');
const plainPassword = 'swati9468'; // Put your desired password here

async function hash() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    console.log('Plain Password:', plainPassword);
    console.log('Hashed Password:', hashedPassword);
}
hash();