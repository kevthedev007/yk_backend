'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Roles.hasMany(models.User, { foreignKey: 'role_id' })
    }
  };
  Roles.init({
    role_name: DataTypes.ENUM("admin", "customer")
  }, {
    sequelize,
    modelName: 'Roles',
  });
  return Roles;
};