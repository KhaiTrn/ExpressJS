import { BadRequestException } from "../common/helpers/error.helper.js";
import models from "../common/sequelize/init.sequelize.js";

const videoService = {
  videoList: async () => {
    // abc
    // throw new BadRequestException(`Lấy danh sách video không thành công`)
    const videos = await models.videos.findAll({ raw: true });
    return videos;
  },
};
export default videoService;
