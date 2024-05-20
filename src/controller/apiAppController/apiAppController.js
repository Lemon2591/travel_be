const { ApiAppService } = require("../../service");

const ApiUpLoadFile = async (req, res) => {
  const files = req.files;

  return ApiAppService.uploadFileService(files);
};

const createPost = async (req, res) => {
  const data = req.body;
  return ApiAppService?.createPostService(data);
};

const getPost = async (req, res) => {
  const { key_w, slug, category_id } = req.headers;
  return ApiAppService?.getPostService(key_w, slug, category_id);
};

module.exports = {
  ApiUpLoadFile,
  createPost,
  getPost,
};
