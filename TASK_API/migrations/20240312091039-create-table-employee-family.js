'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('employee_family', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING
      },
      identifier: {
        type: Sequelize.STRING
      },
      place_of_birth: {
        type: Sequelize.STRING
      },
      date_of_birth: {
        type: Sequelize.DATE
      },
      religion: {
        allowNull: false,
        type: Sequelize.ENUM("Islam", "Katolik", "Budha", "Protestan", "Konghucu")
      },
      is_life: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_divorced: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      relation_status: {
        allowNull: false,
        type: Sequelize.ENUM("Suami", "Istri", "Anak", "Anak Sambung")
      },
      created_by: {
        type: Sequelize.STRING
      },
      updated_by: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      }
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('employee_family');
     */

    await queryInterface.dropTable('employee_family');
  }
};
