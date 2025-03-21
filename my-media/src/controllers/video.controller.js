import { responseSuccess } from "../common/helpers/response.helper.js";
import videoService from "../services/video.service.js";

const videoController = {
  videoList: async (req, res, next) => {
    try {
      const videos = await videoService.videoList();
      const resData = responseSuccess(
        videos,
        `Get List Videos Successfully`,
        200
      );
    } catch (error) {
      next(error);
    }
  },
};

export default videoController;
