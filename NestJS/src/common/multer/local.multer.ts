import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
fs.mkdirSync('uploads', { recursive: true });
const store = diskStorage({
  // Xử lý nơi lưu trữ file
  destination: (req, file, cb) => {
    // có req và file để xử lý logic tạo ra folder muốn lưu trữ (file: imag, docx, excel, pdff, ...)
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname); // lấy đuôi file
    const fileNameString = `local-${uniqueSuffix}-${file.fieldname}${fileExtension}`;
    cb(null, fileNameString);
  },
});
const uploadLocal = {
  storage: store,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
}; // 1MB
export default uploadLocal;
