'use strict';
module.exports = (sequelize, DataTypes) => {

  const EmployeeProfile = sequelize.define('EmployeeProfile', {
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
    placeOfBirth: {
      field: 'place_of_birth',
      type: DataTypes.STRING
    },
    dateOfBirth: {
      field: 'date_of_birth',
      type: DataTypes.DATE,
      get() {
        const date = this.getDataValue('dateOfBirth')
        const convert = new Intl.DateTimeFormat('fr-CA', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(new Date(date));

        return convert;
      },
      set(value) {
        // Mengonversi string ke tipe data DATE
        this.setDataValue('dateOfBirth', new Date(value));
      }
    },
    gender: {
      type: DataTypes.ENUM("Laki-Laki", "Perempuan")
    },
    isMarried: {
      field: 'is_married',
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    profPict: {
      field: 'prof_pict',
      type: DataTypes.STRING
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
    tableName: "employee_profile",
    timestamps: true
  });
  return EmployeeProfile;
};