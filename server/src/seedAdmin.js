import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import User from './models/User.js';
dotenv.config();

await connectDB();
const email = (process.env.ADMIN_EMAIL || 'admin@buspass.local').toLowerCase();
let admin = await User.findOne({ email });
if (!admin) {
  admin = await User.create({
    name: process.env.ADMIN_NAME || 'System Admin',
    email,
    phone: '0000000000',
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
    role: 'admin'
  });
  console.log(`Admin created: ${email}`);
} else {
  console.log(`Admin already exists: ${email}`);
}
process.exit(0);
