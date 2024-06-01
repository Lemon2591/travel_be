const { Post, Website, Users, Category } = require("../models");

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
    attributes: {
      exclude: ["is_delete", "updatedAt"],
    },
    include: [
      {
        model: Users,
        as: "users",
        attributes: {
          exclude: ["password", "createdAt", "updatedAt", "is_delete", "id"],
        },
      },
      {
        model: Website,
        as: "website",
        attributes: {
          exclude: ["createdAt", "updatedAt", "is_delete", "id"],
        },
      },
      {
        model: Category,
        as: "category",
        attributes: {
          exclude: ["createdAt", "updatedAt", "is_delete", "id"],
        },
      },
    ],
  });
  if (!post) {
    throw new Error("Không có dữ liệu !");
  }
  return post;
};

const uploadFileService = async (files) => {
  for (let item of files) {
    const filePath = `${process.env.API_SERVER}/storage/${item.filename}`;
    return {
      url: filePath,
    };
  }
};

module.exports = {
  createPostService,
  getPostService,
  uploadFileService,
};
