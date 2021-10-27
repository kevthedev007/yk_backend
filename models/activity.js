'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Activity.belongsTo(models.Customer, { foreignKey: 'customerId', onDelete: 'CASCADE' })
    }
  };
  Activity.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    customerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Customers',
        key: 'id'
      }
    },
    activity: DataTypes.ENUM('pin_reset', 'data_purchase'),
  }, {
    sequelize,
    modelName: 'Activity',
  });
  return Activity;
};