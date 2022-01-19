'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OTP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      OTP.belongsTo(User, {
        foreignKey: { name: "userId", allowNull: false },
        as: "user", onDelete: 'CASCADE'
      });
    }
  };
  OTP.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    otp: DataTypes.STRING,
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    expires_in: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'OTP',
  });
  return OTP;
};