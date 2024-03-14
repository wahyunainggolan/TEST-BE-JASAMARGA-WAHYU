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

    await queryInterface.addConstraint('employee_profile', {
      fields: ['employee_id'],
      type: "foreign key",
      name: "custom_fkey_employee_profile",
      references: {
        table: 'employee',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })

    await queryInterface.addConstraint('employee_family', {
      fields: ['employee_id'],
      type: "foreign key",
      name: "custom_fkey_employee_family",
      references: {
        table: 'employee',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })

    await queryInterface.addConstraint('employee_education', {
      fields: ['employee_id'],
      type: "foreign key",
      name: "custom_fkey_education",
      references: {
        table: 'employee',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeConstraint('employee_profile', 'custom_fkey_employee_family', {
      type: "foreign key"
    })

    await queryInterface.removeConstraint('employee_family', 'custom_fkey_employee_family', {
      type: "foreign key"
    })

    await queryInterface.removeConstraint('education', 'custom_fkey_education', {
      type: "foreign key"
    })
  }
};
