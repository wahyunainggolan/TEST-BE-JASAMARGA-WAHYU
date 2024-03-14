'use strict';
module.exports = (sequelize, DataTypes) => {

  const Education = sequelize.define('Education', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    employeeId: {
      field: 'employee_id',
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    level: {
      allowNull: false,
      type: DataTypes.ENUM("Tk", "Sd", "Smp", "Sma", "Strata 1", "Strata 2", "Doktor", "Profesor"),
      unique: 'unique_level_per_employee'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdBy: {
      field: 'created_by',
      type: DataTypes.STRING,
      defaultValue: "admin"
    },
    updatedBy: {
      field: 'updated_by',
      type: DataTypes.STRING,
      defaultValue: "admin"
    },
    createdAt: {
      field: 'created_at',
      allowNull: false,
      type: DataTypes.DATE,
      get() {
        const date = new Date(`${this.getDataValue('createdAt')}`);
        return `${date.toISOString().split('T')[0]} ${date.toLocaleTimeString([], { timeStyle: 'medium', hour12: false })}`;
      }
    },
    updatedAt: {
      field: 'updated_at',
      allowNull: false,
      type: DataTypes.DATE,
      get() {
        const date = new Date(`${this.getDataValue('updatedAt')}`);
        return `${date.toISOString().split('T')[0]} ${date.toLocaleTimeString([], { timeStyle: 'medium', hour12: false })}`;
      }
    }
  }, {
    tableName: "employee_education",
    timestamps: true,
    indexes: [
      {
        unique: true, // This ensures the uniqueness per employeeId
        fields: ['employee_id', 'level'],
        name: 'unique_level_per_employee' // Name your unique constraint
      }
    ]
  });
  return Education;
};