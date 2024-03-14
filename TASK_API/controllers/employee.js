const db = require('../models/index')
const Employee = db.Employee;

async function insertEmployeeData(req, res) {
    const existNik = await findEmployeeByNik(req.body.employee.nik);
    if (!existNik) {
        db.sequelize.transaction(async (t) => {
            const employee = Employee.create({
                nik: req.body.employee.nik,
                name: req.body.employee.name,
                startDate: req.body.employee.startDate,
                endDate: req.body.employee.endDate,
                isActive: true,
                profile: req.body.employee.profile,
                family: req.body.employee.family,
                education: req.body.employee.education,
            }, {
                transaction: t,
                include: [
                    {
                        model: db.EmployeeProfile,
                        as: 'profile',
                    },
                    {
                        model: db.EmployeeFamily,
                        as: 'family',
                    },
                    {
                        model: db.Education,
                        as: 'education',
                    },
                ]
            })

            return employee;
        }).then((employee) => res.status(201).json({ employee: employee }))
            .catch((error) => res.status(400).json({ status: 'error', message: error }));
    } else {
        res.status(400).json({ status: 'error', message: "nik exists", employee: existNik });
    }
}

async function create(req, res) {
    const existNik = await findEmployeeByNik(req.body.employee.nik);
    if (existNik) {
        return res.status(400).json({ status: 'error', message: "nik exists", employee: existNik });
    }

    db.sequelize.transaction(async (t) => {
        const employee = Employee.create(req.body.employee, {
            transaction: t,
            include: [
                {
                    model: db.EmployeeProfile,
                    as: 'profile',
                },
                {
                    model: db.EmployeeFamily,
                    as: 'family',
                },
                {
                    model: db.Education,
                    as: 'education',
                },
            ]
        })

        return employee;
    }).then((employee) => res.status(201).json({ employee: employee }))
        .catch((error) => res.status(400).json({ status: 'error', message: error }));
}

async function findEmployeeByNik(nik) {
    const employee = await Employee.findOne({
        where: {
            nik: nik,
        }
    })

    return employee;
}

async function findEmployee(req, res) {
    Employee.findByPk(req.params.id, {
        include: [
            {
                model: db.EmployeeProfile,
                as: 'profile',
                attributes: ['id', 'placeOfBirth', 'dateOfBirth', 'gender', 'isMarried', 'profPict'],
            },
            {
                model: db.EmployeeFamily,
                as: 'family',
                attributes: ['id', 'name', 'religion', 'isLife', 'isDivorced', 'relationStatus', 'placeOfBirth', 'dateOfBirth'],
            },
            {
                model: db.Education,
                as: 'education',
                attributes: ['id', 'name', 'level', 'description'],
            },
        ]
    }).then((employee) => {
        if (employee) {
            return res.status(200).json({ employee: employee })
        } else {
            return res.status(401).json({ status: 'error', message: "not found" });
        }
    }).catch((error) => res.status(400).json({ status: 'error', message: error }));
}


async function getAll(req, res) {
    Employee.findAll({
        include: [
            {
                model: db.EmployeeProfile,
                as: 'profile',
                attributes: ['placeOfBirth', 'dateOfBirth', 'gender', 'isMarried', 'profPict'],
            },
            {
                model: db.EmployeeFamily,
                as: 'family',
                attributes: ['name', 'religion', 'isLife', 'isDivorced', 'relationStatus', 'placeOfBirth', 'dateOfBirth'],
            },
            {
                model: db.Education,
                as: 'education',
                attributes: ['name', 'level', 'description'],
            },
        ]
    }).then((employee) => {
        if (employee) {
            return res.status(200).json({ employee: employee })
        } else {
            return res.status(401).json({ status: 'error', message: "not found" });
        }
    }).catch((error) => res.status(400).json({ status: 'error', message: error }));
}


async function updateEmployee(req, res) {
    const employeeId = req.params.id;
    db.sequelize.transaction(async (t) => {
        const employee = await Employee.findByPk(employeeId, {
            transaction: t,
            include: [
                {
                    model: db.EmployeeProfile,
                    as: 'profile',
                    attributes: ['placeOfBirth', 'dateOfBirth', 'gender', 'isMarried', "profPict"],
                },
                {
                    model: db.EmployeeFamily,
                    as: 'family',
                    attributes: ['name', 'religion', 'isLife', 'isDivorced', 'relationStatus', 'placeOfBirth', 'dateOfBirth'],
                },
                {
                    model: db.Education,
                    as: 'education',
                    attributes: ['name', 'level', 'description'],
                },
            ]
        })

        return employee;
    }).then((employee) => {
        if (employee) {
            employee.update({
                nik: req.body.employee.nik || employee.nik,
                name: req.body.employee.name || employee.name,
                startDate: req.body.employee.startDate || employee.startDate,
                endDate: req.body.employee.endDate || employee.endDate
            })
                .then((employeeNew) => res.status(200).json({ employee: employeeNew }))
                .catch((error) => res.status(400).json({ status: 'error', message: error }))
        } else {
            return res.status(401).json({ status: 'error', message: "not found" });
        }
    }).catch((error) => res.status(400).json({ status: 'error', message: error }));
}

async function deleteEmployee(req, res) {
    const employeeId = req.params.id;
    db.sequelize.transaction(async (t) => {
        const employee = await Employee.findByPk(employeeId, {
            transaction: t,
            include: [
                {
                    model: db.EmployeeProfile,
                    as: 'profile',
                    attributes: ['placeOfBirth', 'dateOfBirth', 'gender', 'isMarried'],
                },
                {
                    model: db.EmployeeFamily,
                    as: 'family',
                    attributes: ['name', 'religion', 'isLife', 'isDivorced', 'relationStatus', 'placeOfBirth', 'dateOfBirth'],
                },
                {
                    model: db.Education,
                    as: 'education',
                    attributes: ['name', 'level', 'description'],
                },
            ]
        })

        return employee;
    }).then((employee) => {
        if (employee) {
            employee.destroy()
                .then((employeeNew) => res.status(200).json({ status: 'success' }))
                .catch((error) => res.status(400).json({ status: 'error', message: error }))
        } else {
            return res.status(401).json({ status: 'error', message: "not found" });
        }
    }).catch((error) => res.status(400).json({ status: 'error', message: error }));
}

async function updateEmployeeData(req, res) {
    const employeeId = req.params.id
    const employeeData = req.body.employee;
    const employeeProfile = employeeData.profile;
    const employeeFams = employeeData.family;
    const employeeEdu = employeeData.education;

    const employee = await Employee.findOne({ where: { id: employeeId, isActive: true } })

    if (!employee) {
        return res.status(401).json({ status: 'error', message: "not found" });
    }

    db.sequelize.transaction(async (t) => {
        await employee.update(employeeData, { transaction: t });
        await db.EmployeeProfile.findOne({
            where: { employeeId: employeeId, id: employeeProfile.id },
            transaction: t
        }).then(async (profile) => await profile.update(employeeProfile));

        await Promise.all(employeeFams.map(async (data) => {
            await db.EmployeeFamily.findOne({
                where: { employeeId: employeeId, id: data.id },
                transaction: t
            }).then(async (fam) => await fam.update(data))
        }))

        await Promise.all(employeeEdu.map(async (data) => {
            await db.Education.findOne({
                where: { employeeId: employeeId, id: data.id },
                transaction: t
            }).then(async (edu) => await edu.update(data))
        }))
    }).then(async () => {
        const employee = await Employee.findOne({
            where: { id: employeeId, isActive: true }, include: [
                {
                    model: db.EmployeeProfile,
                    as: 'profile',
                    attributes: ['placeOfBirth', 'dateOfBirth', 'gender', 'isMarried', "profPict"],
                },
                {
                    model: db.EmployeeFamily,
                    as: 'family',
                    attributes: ['name', 'religion', 'isLife', 'isDivorced', 'relationStatus', 'placeOfBirth', 'dateOfBirth'],
                },
                {
                    model: db.Education,
                    as: 'education',
                    attributes: ['name', 'level', 'description'],
                },
            ]
        })

        return res.status(200).json({ employee: employee });
    }).catch((error) => {
        return res.status(400).json({ status: "error", message: error })
    })
}

async function getReportAllEmployee(req, res) {
    try {
        const employees = await Employee.findAll({
            attributes: [
                'id',
                'nik',
                'name',
                'is_active',
                [db.sequelize.fn('STRING_AGG', db.sequelize.col('family_data'), ' & '), 'keterangan']
            ],
            include: [
                {
                    model: db.EmployeeProfile,
                    as: "profile",
                    attributes: ['gender', [db.sequelize.fn('AGE', db.sequelize.col('profile.date_of_birth')), 'age']],
                },
                {
                    model: db.EmployeeFamily,
                    as: 'family',
                    attributes: [
                        [
                            db.sequelize.literal("CONCAT(COUNT(*), ' ', relation_status)"), '&',
                            'family_data',
                        ],
                    ],
                    group: ['family.employee_id', 'family.relation_status'],
                },
                {
                    model: db.Education,
                    as: "education",
                    attributes: [
                        [
                            db.sequelize.literal(`STRING_AGG("education"."name", ', ')`),
                            'school_name',
                        ],
                        [
                            db.sequelize.literal(`STRING_AGG("education"."level"::text, ', ')`),
                            'levels',
                        ],
                    ],
                    group: ['education.employee_id'],
                },
            ],
        });

        return res.status(200).json({ employees: employees })
    } catch (error) {
        return res.status(500).json({ status: "error reports", message: error });
    }
}

module.exports = {
    create, getAll, findEmployee, updateEmployee, deleteEmployee, insertEmployeeData, updateEmployeeData, getReportAllEmployee
}