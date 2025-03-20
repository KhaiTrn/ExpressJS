import { Sequelize } from "sequelize";
import initModels from "../../models/init-models.js";

export const sequelize = new Sequelize(
  "mysql://root:123456@localhost:3306/demo_database"
);
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
