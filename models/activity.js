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
    static associate({ User }) {
      // define association here
      Activity.belongsTo(User, {
        foreignKey: { name: "userId", allowNull: false },
        as: "user", onDelete: 'CASCADE'
      });
    }
  };
  Activity.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
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