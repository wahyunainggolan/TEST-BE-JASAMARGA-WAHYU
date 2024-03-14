const express = require('express');
const router = express.Router();
const {
    getAll,
    create,
    findEmployee,
    updateEmployee,
    deleteEmployee,
    insertEmployeeData,
    updateEmployeeData,
    getReportAllEmployee
} = require('../controllers/employee');

router.get('/', getAll);
router.get("/get-reports", getReportAllEmployee);
router.get('/:id', findEmployee);
router.post("/", create);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
router.post("/all-data", insertEmployeeData);
router.put("/all-data/:id", updateEmployeeData);


module.exports = router;
