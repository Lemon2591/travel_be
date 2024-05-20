const { where } = require("sequelize");
const { Post, Website } = require("../models");

const createPostService = async (data) => {
  const {
    title,
    des_seo,
    key_seo,
    content,
    url,
    thumbnail,
    website_id,
    category_id,
    author,
  } = data;

  if (
    !title ||
    !des_seo ||
    !key_seo ||
    !content ||
    !url ||
    !thumbnail ||
    !website_id ||
    !category_id ||
    !author
  ) {
    throw new Error("Truy cập bị trừ chối !");
  }
  await Post.create({ ...data });
};

const getPostService = async (key_w, slug, category_id) => {
  if (!key_w || !slug || !category_id) {
    throw new Error("Truy cập bị trừ chối !");
  }
  const website = await Website.findOne({
    where: {
      key: key_w,
    },
  });

  const post = await Post.findOne({
    where: {
      website_id: website?.id,
      slug: slug,
      category_id: category_id,
    },
  });
  return post;
};

module.exports = {
  createPostService,
  getPostService,
};
