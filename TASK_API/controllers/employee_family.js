const db = require('../models/index');
const Employee = db.Employee;
const EmployeeFamily = db.EmployeeFamily;

async function getAll(req, res) {
    EmployeeFamily.findAll({
        include: [
            {
                model: Employee,
                as: 'employee',
                attributes: [
                    'id',
                    'nik',
                    'name',
                    'startDate',
                    'endDate',
                    'isActive'
                ],
            },
        ]
    }).then((family) => {
        if (family) {
            return res.status(200).json({ family: family })
        } else {
            return res.status(401).json({ status: 'error', message: "employee family not found" });
        }
    }).catch((error) => res.status(400).json({ status: 'error', message: error }));
}

async function findById(req, res) {
    EmployeeFamily.findByPk(req.params.id, {
        include: [
            {
                model: Employee,
                as: 'employee',
                attributes: [
                    'id',
                    'nik',
                    'name',
                    'startDate',
                    'endDate',
                    'isActive'
                ],
            },
        ]
    }).then((profile) => {
        if (profile) {
            return res.status(200).json({ profile: profile })
        } else {
            return res.status(401).json({ status: 'error', message: "employee profile not found" });
        }
    }).catch((error) => res.status(400).json({ status: 'error', message: error }));
}

async function create(req, res) {
    const employeeId = req.body.employeeId;
    const data = req.body.family.map(edu => ({
        ...edu,
        employeeId: req.body.employeeId,
    }));

    const existsEmployee = await Employee.findByPk(employeeId, {
        where: {
            isActive: true
        }
    });

    if (!existsEmployee) {
        return res.status(404).json({
            status: 'error', message: "employee not found"
        });
    }

    db.sequelize.transaction(async (t) => {
        const edu = EmployeeFamily.bulkCreate(data, {
            transaction: t
        })

        return edu;
    }).then(async (_) => {
        const data = await EmployeeFamily.findAll({
            where: {
                employeeId: employeeId
            },
            include: [
                {
                    model: Employee,
                    as: 'employee',
                    attributes: [
                        'id',
                        'nik',
                        'name',
                        'startDate',
                        'endDate',
                        'isActive'
                    ],
                },
            ]
        })
        return res.status(201).json({ family: data })
    })
        .catch((error) => res.status(400).json({ status: 'error', message: error.errors }));
}

async function update(req, res) {
    const id = req.params.id;
    const data = req.body.family;
    db.sequelize.transaction(async (t) => {
        const family = await EmployeeFamily.findByPk(id, {
            transaction: t,
            include: [
                {
                    model: Employee,
                    as: 'employee',
                    attributes: [
                        'id',
                        'nik',
                        'name',
                        'startDate',
                        'endDate',
                        'isActive'
                    ],
                },
            ]
        })

        return family;
    }).then((family) => {
        if (family) {
            family.update(data)
            .then(() => res.status(200).json({ family: family }))
            .catch((error) => res.status(400).json({ status: 'error', message: error }))
        } else {
            return res.status(401).json({ status: 'error', message: "employee family not found" });
        }
    }).catch((error) => res.status(500).json({ status: 'error', message: error }));
}

async function deleteById(req, res) {
    const id = req.params.id;
    db.sequelize.transaction(async (t) => {
        const family = await EmployeeFamily.findByPk(id, {
            transaction: t
        })

        return family;
    }).then((family) => {
        if (family) {
            family.destroy()
            .then((_) => res.status(200).json({ status: 'success' }))
            .catch((error) => res.status(400).json({ status: 'error', message: error }))
        } else {
            return res.status(401).json({ status: 'error', message: "not found" });
        }
    }).catch((error) => res.status(400).json({ status: 'error', message: error }));
}

module.exports = {
    getAll, findById, create, update, deleteById
}