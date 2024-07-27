const { sequelize } = require("../connection");
const Users = require("./Users");
const LoginStatus = require("./LoginStatus");
const UserRole = require("./UserRole");
const Website = require("./Website");
const UserWebsite = require("./UserWebsite");
const Media = require("./Media");
const Role = require("./Role");
const Category = require("./Category");
const Post = require("./Post");
const View = require("./View");
const Location = require("./Location");

for (const m in sequelize.models) {
  sequelize.models[m].sync();
}

// Init association
for (const m in sequelize.models) {
  sequelize.models[m].association();
}

module.exports = {
  Users,
  LoginStatus,
  UserRole,
  Website,
  UserWebsite,
  Media,
  Role,
  Category,
  Post,
  View,
};
