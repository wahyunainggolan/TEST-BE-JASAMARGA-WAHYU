const db = require('../models/index');
const Employee = db.Employee;
const EmployeeProfile = db.EmployeeProfile;

async function getAll(req, res) {
    EmployeeProfile.findAll({
        include: [
            {
                model: db.Employee,
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

async function findById(req, res) {
    EmployeeProfile.findByPk(req.params.id, {
        include: [
            {
                model: db.Employee,
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
    const data = req.body.profile;
    const existsEmployee = await Employee.findByPk(data.employeeId, {
        where: {
            isActive: true
        }
    });

    if (!existsEmployee) {
        return res.status(404).json({
            status: 'error', message: "employee not found"
        });
    }

    const existsEmployeeProfile = await EmployeeProfile.findOne({
        where: {
            employeeId: data.employeeId
        }
    })

    if (existsEmployeeProfile) {
        return res.status(400).json({
            status: 'error', message: "employee profile already exists"
        });
    }

    db.sequelize.transaction(async (t) => {
        const profile = EmployeeProfile.create(data, {
            transaction: t
        })

        return profile;
    }).then(async (profile) => {
        const data = await EmployeeProfile.findByPk(profile.id, {
            include: [
                {
                    model: db.Employee,
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
        return res.status(201).json({ profile: data })
    })
        .catch((error) => res.status(400).json({ status: 'error', message: error }));
}


async function update(req, res) {
    const EmployeeProfileId = req.params.id;
    const data = req.body.profile

    db.sequelize.transaction(async (t) => {
        const profile = await EmployeeProfile.findByPk(EmployeeProfileId, {
            transaction: t,
            include: [
                {
                    model: db.Employee,
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

        return profile;
    }).then((profile) => {
        if (!profile) {
            return res.status(401).json({ status: 'error', message: "employee profile not found" });
        }

        profile.update({
            placeOfBirth: data.placeOfBirth || profile.placeOfBirth,
            dateOfBirth: data.dateOfBirth || profile.dateOfBirth,
            gender: data.gender || profile.gender,
            isMarried: data.isMarried || profile.isMarried,
            profPict: data.profPict || profile.profPict
        }).then((profileNew) => res.status(200).json({ profile: profileNew }))
        .catch((error) => res.status(400).json({ status: 'error', message: error }))
    })
}

async function deleteById(req, res) {
    const employeeProfileId = req.params.id;
    db.sequelize.transaction(async (t) => {
        const profile = await EmployeeProfile.findByPk(employeeProfileId, {
            transaction: t,
        })

        return profile
    }).then((profile) => {
        if (profile) {
            profile.destroy()
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