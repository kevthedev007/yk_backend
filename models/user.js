'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Roles, { foreignKey: 'role_id' })
    }
  };
  User.init({
    id: {
      type:DataTypes.STRING,
      primaryKey: true
    },
    role_id: DataTypes.INTEGER,
    email: DataTypes.STRING,
    PIN: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    last_signed_in: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};