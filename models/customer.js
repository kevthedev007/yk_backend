'use strict';
const {
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
};