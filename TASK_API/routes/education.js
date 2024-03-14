const express = require('express');
const router = express.Router();
const {
    getAll,
    findById,
    create,
    update,
    deleteById
} = require('../controllers/education');

router.get('/', getAll);
router.get('/:id', findById);
router.post("/", create);
router.put('/:id', update);
router.delete('/:id', deleteById);

module.exports = router;
