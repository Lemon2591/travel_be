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

class View extends BaseModel {
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
  view_day: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  post_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  website_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
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
  tableName: "view",
};

/**
 * Init Model
 */
View.init(attributes, { ...options, sequelize });

module.exports = View;
