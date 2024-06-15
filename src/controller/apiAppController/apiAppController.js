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

const getFeaturePost = async (req, res) => {
  const { key_w, location, category } = req.headers;
  return ApiAppService?.getFeaturePostService(key_w, location, category);
};

const getListPost = async (req, res) => {
  const { page, limit } = req.query;
  return ApiAppService?.getListPostService(page, limit);
};

module.exports = {
  ApiUpLoadFile,
  createPost,
  getPost,
  getFeaturePost,
  getListPost,
};
