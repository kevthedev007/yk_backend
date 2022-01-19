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
    static associate({ Role, Customer, OTP, Activity }) {
      // define association here
      User.belongsTo(Role, {
        foreignKey: { name: "roleId", allowNull: false },
        as: "role", onDelete: 'CASCADE'
      });
      User.hasOne(Customer, {
        foreignKey: { name: "userId", allowNull: false },
        as: "customer",
      });
      User.hasMany(OTP, {
        foreignKey: { name: "userId", allowNull: false },
        as: "otp",
      });
      User.hasMany(Activity, {
        foreignKey: { name: "userId", allowNull: false },
        as: "activity",
      });
    }
  };
  User.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Roles',
        key: 'id'
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
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

