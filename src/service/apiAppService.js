const { Post, Website, Users, Category, Media, View } = require("../models");
const { Op } = require("sequelize");
const { Paging } = require("../helper/helper");
const moment = require("moment");
const { google } = require("googleapis");
const path = require("path");

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

const getPostService = async (key, slug, category, req) => {
  if (!key || !slug || !category) {
    throw new Error("Truy cập bị trừ chối !");
  }

  const website = await Website.findOne({
    where: {
      key: key,
    },
  });

  const post = await Post.findOne({
    where: {
      website_id: website?.id,
      slug: slug,
      category_id: category,
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

  if (!post) {
    throw new Error("Không có dữ liệu !");
  }

  await Post.update(
    {
      view: Number(post?.view) + 1,
    },
    {
      where: {
        website_id: website?.id,
        slug: slug,
        category_id: category,
        is_delete: false,
      },
    }
  );

  const check_first = await View.findOne({
    where: {
      createdAt: {
        [Op.gte]: moment().startOf("days").unix(),
      },
      post_id: post?.id,
    },
  });

  if (!check_first) {
    await View.create({
      view_day: 1,
      post_id: post?.id,
      website_id: website?.id,
    });
  } else {
    await check_first.update({
      view_day: Number(check_first.toJSON()?.view_day) + 1,
    });
  }

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

const getFeaturePostService = async (key, location, category) => {
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
  if (!key) {
    throw new Error("Truy cập bị trừ chối !");
  }

  if (!category) {
    throw new Error("Truy cập bị trừ chối !");
  }

  const website = await Website.findOne({
    where: {
      key: key,
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

const getImageService = async (page, limit) => {
  const paging = Paging(page, limit);

  const data = await Media.findAll({
    where: {
      is_delete: false,
    },
    ...paging,
  });

  const total = await Media?.count({
    where: {
      is_delete: false,
    },
  });
  return {
    data,
    total,
  };
};

const getAllPostService = async (key, location, page, limit) => {
  let paging = {};
  if (page && limit) {
    paging = Paging(page, limit);
  }

  let where = {
    is_delete: false,
  };

  if (location !== "all") {
    where = {
      ...where,
      title: {
        [Op.like]: `%${location}%`,
      },
    };
  }
  if (!key) {
    throw new Error("Truy cập bị trừ chối !");
  }

  const website = await Website.findOne({
    where: {
      key: key,
    },
  });

  const data = await Post.findAll({
    where: {
      website_id: website?.id,
      ...where,
    },
    ...paging,
    include: [
      {
        model: Category,
        as: "category",
        attributes: {
          exclude: ["createdAt", "updatedAt", "is_delete"],
        },
      },
    ],
    attributes: {
      exclude: ["updatedAt", "is_delete", "id"],
    },
  });

  const count = await Post.count({
    where: {
      website_id: website?.id,
      ...where,
    },
  });

  return {
    data: data,
    page: Number(page),
    limit: Number(limit),
    total: count,
  };
};

const getViewService = async (startTime, endTime, website, type) => {
  if (!website || !startTime || !endTime || !type) {
    throw new Error("Không có quyền quy cập !");
  }
  const analytics = google.analyticsdata("v1beta");
  const keyFile = path.join(__dirname, `../config/config_google.json`);
  const auth = new google.auth.GoogleAuth({
    keyFile: keyFile,
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
  });

  console.log(keyFile);
  const client = await auth.getClient();
  // Gửi yêu cầu báo cáo
  const response = await analytics.properties.runReport({
    property: `properties/448330506`, // Định dạng đúng cho propertyId
    requestBody: {
      dimensions: [{ name: "date" }],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "eventCount" },
      ],
      dateRanges: [
        {
          startDate: moment(startTime).format("YYYY-MM-DD"),
          endDate: moment(endTime).format("YYYY-MM-DD"),
        },
      ],
    },
    auth: client,
  });
  const rows = response.data.rows || [];
  // Sắp xếp dữ liệu theo ngày
  const sortedData = rows
    .map((row) => ({
      date: row.dimensionValues[0].value,
      sessions: row.metricValues[0].value,
      totalUsers: row.metricValues[1].value,
      eventCount: row.metricValues[2].value,
    }))
    .sort((a, b) => a.date - b.date)
    .map((el) => {
      const date = el.date;
      // Định dạng ngày thành yyyy/mm/dd
      const formattedDate = `${date.substring(0, 4)}/${date.substring(
        4,
        6
      )}/${date.substring(6, 8)}`;
      return {
        date: formattedDate,
        sessions: el.sessions,
        totalUsers: el.totalUsers,
        eventCount: el.eventCount,
      };
    });

  let data = {
    totalUsers: 0,
    totalEvent: 0,
    totalSessions: 0,
    category: [],
    series_event: {
      name: "Event",
      data: [],
    },
    series_user: {
      name: "User",
      data: [],
    },
    series_session: {
      name: "Session",
      data: [],
    },
  };

  for (let e of sortedData) {
    data.totalUsers += Number(e?.totalUsers);
    data.totalEvent += Number(e?.eventCount);
    data.totalSessions += Number(e?.sessions);
    data?.category?.push(
      moment(e?.date).format(type === "week" ? "dddd" : "MMM Do YY")
    );
    data?.series_event?.data.push(Number(e?.eventCount));
    data?.series_user?.data.push(Number(e?.totalUsers));
    data?.series_session?.data.push(Number(e?.sessions));
  }

  console.log(data);
  return data;
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
  getImageService,
  getAllPostService,
  getViewService,
};
