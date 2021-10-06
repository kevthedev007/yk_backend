'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Customers', {
      customer_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dob: {
        type: Sequelize.DATE,
        allowNull: false
      },
      phone_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "inactive"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Customers');
  }
};