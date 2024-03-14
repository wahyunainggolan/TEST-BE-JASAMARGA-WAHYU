'use strict';
module.exports = (sequelize, DataTypes) => {

  const EmployeeFamily = sequelize.define('EmployeeFamily', {
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
    identifier: {
      type: DataTypes.STRING
    },
    placeOfBirth: {
      field: 'place_of_birth',
      type: DataTypes.STRING
    },
    dateOfBirth: {
      field: 'date_of_birth',
      type: DataTypes.DATE,
      get() {
        const date = new Date(`${this.getDataValue('dateOfBirth')}`);
        const convert = new Intl.DateTimeFormat('fr-CA', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(date);
        return convert;
      },
      set(value) {
        // Mengonversi string ke tipe data DATE
        this.setDataValue('dateOfBirth', new Date(value));
      }
    },
    religion: {
      allowNull: false,
      type: DataTypes.ENUM("Islam", "Katolik", "Budha", "Protestan", "Konghucu")
    },
    isLife: {
      field: "is_life",
      type: DataTypes.BOOLEAN,
    },
    isDivorced: {
      field: 'is_divorced',
      type: DataTypes.BOOLEAN,
    },
    relationStatus: {
      field: "relation_status",
      allowNull: false,
      type: DataTypes.ENUM("Suami", "Istri", "Anak", "Anak Sambung")
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
    tableName: "employee_family",
    timestamps: true
  });
  return EmployeeFamily;
};