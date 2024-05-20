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
class Category extends BaseModel {
  static association() {}
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
  category_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  slug: {
    type: DataTypes.STRING(255),
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
  tableName: "category",
};

/**
 * Init Model
 */
Category.init(attributes, { ...options, sequelize });

module.exports = Category;
