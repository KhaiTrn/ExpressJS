import { Sequelize } from "sequelize";
import initModels from "../../models/init-models.js";
import { DATABASE_URL } from "../constant/app.constant.js";

export const sequelize = new Sequelize(DATABASE_URL, { logging: false });
const models = initModels(sequelize);

// Kiểm tra kết nối với cở sở dữ liệu (db)
sequelize
  .authenticate()
  .then(() => {
    console.log(`kết nối với db thành công`);
  })
  .catch(() => {
    console.log(`kết nối với db không thành công`);
  });

// try {
//    await sequelize.authenticate();
//    console.log(`Kết nối với db thành công`);
// } catch (error) {
//    console.log(`Kết nối với db KHÔNG thành công`);
// }
export default models;
