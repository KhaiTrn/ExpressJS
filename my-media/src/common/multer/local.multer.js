import multer from "multer";
// multer.diskStorage(): lưu tạm file vào trong ổ đĩa rồi mới đưa file đó lên cloud
// Nơi lưu trữ (lưu pixcel data hình ảnh), Xử lý tên file và đuôi mở rộng (extension)
const storage = multer.diskStorage({
  // Xử lý nơi lưu trữ file
  destination: function (req, file, cb) {
    // có req và file để xử lý logic tạo ra folder muốn lưu trữ (file: imag, docx, excel, pdff, ...)
    cb(null, "images/"); // Thư mục lưu trữ tạm thời
  },

  // Xử lý tên file
  filename: function (req, file, cb) {
    // Tạo tên file duy nhất để tránh trùng lặp
    // Date.now(): lấy thời gian hiện tại (tính bằng mili giây)
    // Math.round(Math.random() * 1e9): tạo ra một số ngẫu nhiên từ 0 đến 1 tỷ (1e9) sau đó làm tròn lại
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // fileExtension (đuôi mở rộng của file)
    const fileExtension = path.extname(file.originalname); // path.extname(): lấy đuôi mở rộng của file (vd: .jpg, .png, .pdf, ...)

    // file.fieldname: tên trường trong form-data (vd: avatar, image, ...) lấy từ name của input trong form-data
    //convert to template string
    const fileNameString = `local-${file.fieldname}-${uniqueSuffix}${fileExtension}`;

    cb(null, fileNameString); // callback(không có lỗi nếu có truyền vào đây,filename) Trả về tên file đã xử lý
  },
});

const uploadLocal = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1 MB
  },
});

export default uploadLocal;
