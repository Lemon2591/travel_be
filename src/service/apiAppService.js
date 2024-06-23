const { Post, Website, Users, Category, Media } = require("../models");
const { Op } = require("sequelize");
const { Paging } = require("../helper/helper");

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
      is_delete: false,
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

  const suggest = await Post?.findAll({
    limit: 4,
    include: [
      {
        model: Category,
        as: "category",
        attributes: {
          exclude: ["createdAt", "updatedAt", "is_delete"],
        },
      },
    ],
    order: [
      ["view", "desc"],
      ["createdAt", "desc"],
    ],
  });
  if (!post) {
    throw new Error("Không có dữ liệu !");
  }

  if (!suggest) {
    throw new Error("Không có dữ liệu !");
  }

  return {
    post,
    suggest,
  };
};

const uploadFileService = async (files, data) => {
  for (let item of files) {
    const filePath = `${process.env.API_SERVER}/storage/${item.filename}`;

    await Media.create({
      url: filePath,
      author: JSON.parse(data)?.author,
    });

    return {
      url: filePath,
    };
  }
};

const getFeaturePostService = async (key_w, location, category) => {
  let where = {
    is_delete: false,
  };

  if (location !== "all") {
    where = {
      ...where,
      slug: {
        [Op.like]: `%${location}%`,
      },
    };
  }
  if (!key_w) {
    throw new Error("Truy cập bị trừ chối !");
  }

  if (!category) {
    throw new Error("Truy cập bị trừ chối !");
  }

  const website = await Website.findOne({
    where: {
      key: key_w,
    },
  });

  const category_id = await Category.findOne({
    where: {
      slug: category,
      is_delete: false,
    },
  });

  const feature = await Post.findAll({
    where: {
      website_id: website?.id,
      category_id: category_id?.id,
      ...where,
    },
    include: [
      {
        model: Category,
        as: "category",
        attributes: {
          exclude: ["createdAt", "updatedAt", "is_delete"],
        },
      },
    ],
    order: [
      ["view", "desc"],
      ["createdAt", "desc"],
    ],
    attributes: {
      exclude: ["updatedAt", "is_delete", "id"],
    },
  });

  if (!feature || feature?.length === 0) {
    throw new Error("Không có dữ liệu !");
  }

  const sort = feature?.splice(0, 3);
  return sort?.sort((a, b) => Number(b.view) - Number(a.view));
};

const getListPostService = async (page, limit) => {
  const paging = Paging(page, limit);

  const res = await Post.findAll({
    where: {
      is_delete: false,
    },
    ...paging,
    attributes: {
      exclude: ["updatedAt", "is_delete", "id"],
    },
    include: [
      {
        model: Category,
        as: "category",
        attributes: {
          exclude: ["createdAt", "updatedAt", "is_delete"],
        },
      },
    ],
    order: [
      ["view", "desc"],
      ["createdAt", "desc"],
    ],
  });

  const count = await Post.count({
    where: {
      is_delete: false,
    },
  });

  return {
    data: Number(page) === 1 ? res.reverse() : res,
    limit: Number(limit),
    page: Number(page),
    total: count,
  };
};

const getListPostCMSService = async (
  page,
  limit,
  title,
  category,
  view,
  is_delete
) => {
  const paging = Paging(page, limit);
  let where = {};
  if (title) {
    where = {
      ...where,
      title: {
        [Op.like]: `%${title}%`,
      },
    };
  }
  if (category) {
    where = { ...where, category_id: category };
  }

  if (is_delete) {
    console.log(is_delete);
    where = { ...where, is_delete: is_delete === "1" ? false : true };
  }

  const res = await Post.findAll({
    where: {
      ...where,
    },
    ...paging,
    attributes: {
      exclude: ["updatedAt"],
    },
    include: [
      {
        model: Category,
        as: "category",
        attributes: {
          exclude: ["createdAt", "updatedAt", "is_delete"],
        },
      },
      {
        model: Users,
        as: "users",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password", "email", "is_delete"],
        },
      },
    ],

    order: [["createdAt", "desc"]],
  });

  const count = await Post.count({
    where: {
      ...where,
    },
  });

  const data = view
    ? res?.sort((a, b) =>
        view === "1"
          ? Number(b?.view) - Number(a?.view)
          : Number(a?.view) - Number(b?.view)
      )
    : res;

  return {
    data: data,
    total: count,
    page: Number(page),
    limit: Number(limit),
  };
};

const changeStatusService = async (id, type) => {
  if (!id || !type) {
    throw new Error("Truy cập bị trừ chối !");
  }

  if (type == "restore" || type == "delete") {
    const res = await Post.update(
      {
        is_delete: type === "restore" ? false : true,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return res;
  }

  throw new Error("Truy cập bị trừ chối !");
};

const detailsPostService = async (userID, id) => {
  if (!userID || !id || !Number(id)) {
    throw new Error("Truy cập bị trừ chối !");
  }

  const res = await Post.findOne({
    where: {
      id: id,
      author: userID,
      is_delete: false,
    },
  });
  return res;
};

const updatePostService = async (userID, data) => {
  if (userID !== data?.author) {
    throw new Error("Truy cập bị trừ chối !");
  }

  await Post.update(
    { ...data },
    {
      where: {
        id: data?.id,
      },
    }
  );
};

module.exports = {
  createPostService,
  getPostService,
  uploadFileService,
  getFeaturePostService,
  getListPostService,
  getListPostCMSService,
  changeStatusService,
  detailsPostService,
  updatePostService,
};
