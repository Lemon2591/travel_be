const { sequelize } = require("../connection");
const BaseModel = require("../config/BaseModel");
const { DataTypes } = require("sequelize");

/**
 * Define Level Model
 *
 * @export
 * @class Level
 * @extends {BaseModel}
 */
class Post extends BaseModel {
  static association() {
    const Users = require("./Users");
    const Website = require("./Website");
    const Category = require("./Category");

    this.belongsTo(Users, {
      foreignKey: "author",
      targetKey: "id",
      as: "Users",
    });

    this.belongsTo(Website, {
      foreignKey: "website_id",
      targetKey: "id",
      as: "Website",
    });

    this.belongsTo(Category, {
      foreignKey: "category_id",
      targetKey: "id",
      as: "Category",
    });
  }
}
/**
 * Attributes model
 */

const attributes = {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  slug: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  des_seo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  key_seo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  website_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  author: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  is_delete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
};

/**
 * Options model
 */
const options = {
  tableName: "post",
};

/**
 * Init Model
 */
Post.init(attributes, { ...options, sequelize });

module.exports = Post;
