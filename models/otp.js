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
    static associate(models) {
      // define association here
      OTP.belongsTo(models.Customer, { foreignKey: 'customer_id' })
    }
  };
  OTP.init({
    otp_id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    customer_id: DataTypes.STRING,
    otp: DataTypes.INTEGER,
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    expires_in: DataTypes.DATE
  }, {
    sequelize,
    tableName: 'OTP',
    modelName: 'OTP',
  });
  return OTP;
};