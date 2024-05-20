const { ApiShareService } = require("../../service");

const ApiShareProductComputer = async () => {
  return ApiShareService.apiShareServiceComputer();
};

const ApiShareProvince = async (req, res) => {
  const { type, code, key } = req.query;

  return ApiShareService.apiShareServiceProvince(type, code, key);
};

const ApiShareProductFashion = async (req, res) => {
  return ApiShareService.apiShareServiceFashion();
};

const ApiShareProductMusic = async (req, res) => {
  return ApiShareService.apiShareServiceMusic();
};

const ApiShareProductVideo = async (req, res) => {
  const { limit, page } = req?.query;
  return ApiShareService.apiShareServiceVideo(limit, page);
};

const ApiShareProductMobile = async (req, res) => {
  const { limit, page, type } = req?.query;
  return ApiShareService.apiShareServiceMobile(limit, page, type);
};

const ApiShareProductBook = async (req, res) => {
  const { limit, page } = req?.query;
  return ApiShareService.apiShareServiceBook(limit, page);
};

module.exports = {
  ApiShareProductComputer,
  ApiShareProvince,
  ApiShareProductFashion,
  ApiShareProductMusic,
  ApiShareProductVideo,
  ApiShareProductMobile,
  ApiShareProductBook,
};
