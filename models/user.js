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
      User.belongsTo(models.Roles, { foreignKey: 'roleId' })
    }
  };
  User.init({
    id: {
      type:DataTypes.STRING,
      primaryKey: true
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Roles',
        key: 'id'
      }
    },
    email: DataTypes.STRING,
    PIN: DataTypes.INTEGER,
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    last_signed_in: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};

