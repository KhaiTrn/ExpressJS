import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';

// multer.memoryStorage(): lưu tạm buffer(data hình ảnh) vào trong RAM rồi mới đưa buffer đó lên cloud
// tự giải phòng RAM sau khi kết thúc API
const uploadCloud: MulterOptions = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB
  },
};
export default uploadCloud;
