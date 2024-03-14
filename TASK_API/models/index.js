'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const Employee = require('./employee')(sequelize, Sequelize);
const Education = require('./education')(sequelize, Sequelize);
const EmployeeFamily = require('./employee_family')(sequelize, Sequelize);
const EmployeeProfile = require('./employee_profile')(sequelize, Sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

Employee.hasOne(EmployeeProfile, { as: "profile", foreignKey: "employeeId" });
Employee.hasMany(Education, { as: 'education', foreignKey: "employeeId" });
Employee.hasMany(EmployeeFamily, { as: 'family', foreignKey: "employeeId" });
EmployeeProfile.belongsTo(Employee, { as: 'employee', foreignKey: "employeeId" });
EmployeeFamily.belongsTo(Employee, { as: 'employee', foreignKey: "employeeId" });
Education.belongsTo(Employee, { as: 'employee', foreignKey: "employeeId" });

db.Employee = Employee;
db.EmployeeFamily = EmployeeFamily;
db.EmployeeProfile = EmployeeProfile;
db.Education = Education;

sequelize.sync();

module.exports = db;
