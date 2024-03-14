const express = require('express');
const router = express.Router();
const {
    getAll,
    findById,
    create,
    update,
    deleteById 
} = require('../controllers/employee_profile');

router.get('/', getAll);
router.get('/:id', findById);
router.post("/", create);
router.put('/:id', update);
router.delete('/:id', deleteById);

module.exports = router;
