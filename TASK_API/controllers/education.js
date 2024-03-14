const db = require('../models/index');
const Employee = db.Employee;
const EmployeeEducation = db.Education;

async function getAll(req, res) {
    EmployeeEducation.findAll({
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
    }).then((education) => {
        if (education) {
            return res.status(200).json({ education: education })
        } else {
            return res.status(401).json({ status: 'error', message: "employee education not found" });
        }
    }).catch((error) => res.status(400).json({ status: 'error', message: error }));
}

async function findById(req, res) {
    EmployeeEducation.findByPk(req.params.id, {
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
    }).then((education) => {
        if (education) {
            return res.status(200).json({ education: education })
        } else {
            return res.status(401).json({ status: 'error', message: "employee education not found" });
        }
    }).catch((error) => res.status(400).json({ status: 'error', message: error }));
}

async function create(req, res) {
    const employeeId = req.body.employeeId;
    const data = req.body.education.map(edu => ({
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
        const edu = EmployeeEducation.bulkCreate(data, {
            transaction: t
        })

        return edu;
    }).then(async (_) => {
        const data = await EmployeeEducation.findAll({
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
        return res.status(201).json({ education: data })
    })
        .catch((error) => res.status(400).json({ status: 'error', message: error.errors }));
}

async function update(req, res) {
    const id = req.params.id;
    const data = req.body.education;
    db.sequelize.transaction(async (t) => {
        const education = await EmployeeEducation.findByPk(id, {
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

        return education;
    }).then((education) => {
        if (education) {
            education.update({
                name: data.name || education.name,
                description: data.description || education.description
            })
            .then((educationNew) => res.status(200).json({ education: educationNew }))
            .catch((error) => res.status(400).json({ status: 'error', message: error }))
        } else {
            return res.status(401).json({ status: 'error', message: "employee education not found" });
        }
    }).catch((error) => res.status(400).json({ status: 'error', message: error }));
}

async function deleteById(req, res) {
    const id = req.params.id;
    db.sequelize.transaction(async (t) => {
        const education = await EmployeeEducation.findByPk(id, {
            transaction: t
        })

        return education;
    }).then((education) => {
        if (education) {
            education.destroy()
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