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
      OTP.belongsTo(models.Customer, { foreignKey: 'customerId', onDelete: 'CASCADE' })
    }
  };
  OTP.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    customerId: {
      type: DataTypes.UUID,
      references: {
        model: 'Customers',
        key: 'id'
      }
    },
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