import prisma from "../prisma/init.prisma.js";

const checkPermission = async (req, res, next) => {
  try {
    // Gom dữ liệu cần thiết để kiểm tra permission
    const user = req.user;
    const role_id = user.role_id;
    const baseUrl = req.baseUrl;
    const routePath = req.route.path;
    const fullPath = `${baseUrl}${routePath}`;
    const method = req.method;

    // nếu là ADMIN (role_id === 1) thì cho qua
    // bắt buộc phải có return, nếu không code sẽ chạy tiếp tục, nếu là admin bỏ qua kiểm tra
    if (role_id === 1) return next();
    console.log({ role_id, fullPath, method });
    // đi tìm id của permission thông qua fullPath, method
    // Truy vấn bảng permissions để lấy ra quyền dựa trên fullPath và method.
    const permission = await prisma.permissions.findFirst({
      where: {
        endpoint: fullPath,
        method: method,
      },
    });
    //Truy vấn bảng role_permissions để kiểm tra xem role của user có quyền truy cập API này không.
    const role_permission = await prisma.role_permissions.findFirst({
      where: {
        permission_id: permission.permission_id, //permission_id phải khớp với permission.permission_id.
        role_id: role_id, //role_id phải khớp với vai trò của user.
        is_active: true, // is_active: true đảm bảo quyền này đang được kích hoạt.
      },
    });

    if (!role_permission)
      throw new BadRequestException(
        `Bạn không đủ quyền sử dụng tài nguyên (API) này`
      );

    next();
  } catch (error) {
    next(error);
  }
};
export default checkPermission;
