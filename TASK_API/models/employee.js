'use strict';
module.exports = (sequelize, DataTypes) => {

  const Employee = sequelize.define('Employee', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nik: {
      type: DataTypes.STRING,
      unique: true
    },
    name: {
      type: DataTypes.STRING
    },
    isActive: {
      field: 'is_active',
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    startDate: {
      field: 'start_date',
      allowNull: false,
      type: DataTypes.DATE,
      get() {
        const date = new Date(`${this.getDataValue('startDate')}`);
        const convert = new Intl.DateTimeFormat('fr-CA', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(new Date(date));
        return convert;
      }
    },
    endDate: {
      field: 'end_date',
      allowNull: false,
      type: DataTypes.DATE,
      get() {
        const date = new Date(`${this.getDataValue('endDate')}`);
        const convert = new Intl.DateTimeFormat('fr-CA', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(new Date(date));
        return convert;
      }
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
    tableName: "employee",
    timestamps: true
  });

  Employee.associate = function (models) {
    // associations can be defined here
    Employee.hasOne(models.EmployeeProfile, { as: "profile", foreignKey: "employeeId" });
    Employee.hasMany(models.Education, { as: 'education', foreignKey: "employeeId" });
    Employee.hasMany(models.EmployeeFamily, { as: 'family', foreignKey: "employeeId" });
    models.EmployeeProfile.belongsTo(Employee, { as: 'employee', foreignKey: "employeeId" });
    models.EmployeeFamily.belongsTo(Employee, { as: 'employee', foreignKey: "employeeId" });
    models.Education.belongsTo(Employee, { as: 'employee', foreignKey: "employeeId" });
  };
  return Employee;
};