'use strict';
const {
<<<<<<< HEAD
    Model, STRING
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of DataTypes lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
        toJSON(){
            return{... this.get(), id: undefined}
        }
    };
    Customer.init({
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {msg: 'user must have an email'},
                notEmpty: {msg: 'email must not be empty'},
                isEmail: {msg: 'must be a valid email address'},
            }
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: false
        },
        phone_no: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM("active", "inactive"),
            defaultValue: "inactive"
        },
        last_sigin_date: {
            type: DataTypes.STRING,
            defaultValue: "inactive"
        },
    }, {
        sequelize,
        tableName: 'Customer',
        modelName: 'Customer',
    });
    return Customer;
=======
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.hasMany(models.OTP, { foreignKey: 'customer_id'})
    }
  };
  Customer.init({
    customer_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false
    },
    phone_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive"
    },
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
>>>>>>> 8f207dba408f5aa0d0cee188faa95762ce6cbe2c
};