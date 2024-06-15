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
class UserWebsites extends BaseModel {
  static association() {
    const Website = require("./Website");
    const Users = require("./Users");

    this.belongsTo(Users, {
      foreignKey: "user_id",
      targetKey: "id",
      as: "users",
    });

    this.belongsTo(Website, {
      foreignKey: "website_id",
      targetKey: "id",
      as: "websites",
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
  website_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  user_id: {
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
  tableName: "user_websites",
};

/**
 * Init Model
 */
UserWebsites.init(attributes, { ...options, sequelize });

module.exports = UserWebsites;
