import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const uploadDir = path.resolve('uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`);
  }
});

const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
export const uploadDocuments = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 3 },
  fileFilter: (_req, file, cb) => {
    if (!allowed.includes(file.mimetype)) return cb(new Error('Only PDF, JPG and PNG files are allowed.'));
    cb(null, true);
  }
}).fields([
  { name: 'bonafide', maxCount: 1 },
  { name: 'idCard', maxCount: 1 },
  { name: 'photo', maxCount: 1 }
]);
