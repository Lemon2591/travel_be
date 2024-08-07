const { ApiAppService } = require("../../service");
const { deToken } = require("../../helper/helper");

const ApiUpLoadFile = async (req, res) => {
  const files = req.files;
  const { data } = req.body;
  return ApiAppService.uploadFileService(files, data);
};

const createPost = async (req, res) => {
  const data = req.body;
  return ApiAppService?.createPostService(data);
};

const getPost = async (req, res) => {
  const { key, slug, category } = req.headers;
  return ApiAppService?.getPostService(key, slug, category, req);
};

const getFeaturePost = async (req, res) => {
  const { key, location, category } = req.headers;

  return ApiAppService?.getFeaturePostService(key, location, category);
};

const getListPost = async (req, res) => {
  const { page, limit } = req.query;
  return ApiAppService?.getListPostService(page, limit);
};

const getListPostCMS = async (req, res) => {
  const { page, limit, title, category, view, is_delete } = req.query;
  return ApiAppService.getListPostCMSService(
    page,
    limit,
    title,
    category,
    view,
    is_delete
  );
};

const changeStatus = async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;
  return ApiAppService.changeStatusService(id, type);
};

const detailsPost = async (req, res) => {
  const { auth_t } = req.cookies;
  const { userID } = await deToken(`Bearer ${auth_t}`);
  const { id } = req.params;

  return ApiAppService.detailsPostService(userID, id);
};

const updatePost = async (req, res) => {
  const { auth_t } = req.cookies;
  const { userID } = await deToken(`Bearer ${auth_t}`);
  const data = req.body;

  return ApiAppService.updatePostService(userID, data);
};

const getImage = async (req, res) => {
  const { page, limit } = req.query;
  return ApiAppService.getImageService(page, limit);
};

const getAllPost = async (req, res) => {
  const { key, location, page, limit } = req.headers;
  return ApiAppService.getAllPostService(key, location, page, limit);
};

const getView = async (req, res) => {
  const { startTime, endTime, website, type } = req.body;
  return ApiAppService.getViewService(startTime, endTime, website, type);
};
module.exports = {
  ApiUpLoadFile,
  createPost,
  getPost,
  getFeaturePost,
  getListPost,
  getListPostCMS,
  changeStatus,
  detailsPost,
  updatePost,
  getImage,
  getAllPost,
  getView,
};
