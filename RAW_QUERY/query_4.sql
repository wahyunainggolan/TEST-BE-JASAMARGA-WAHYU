SELECT
    e.id AS employee_id,
    e.nik,
    e.name,
    e.is_active,
    ep.gender,
    CONCAT(DATE_PART('year', AGE(ep.date_of_birth)), ' Years Old') AS age,
    ed.name AS school_name,
    ed.level,
    CONCAT(STRING_AGG(DISTINCT CONCAT(ef.count_relation, ' ', ef.relation_status), ' & ')) AS family_data
FROM
    employee e
LEFT JOIN
    employee_profile ep ON e.id = ep.employee_id
LEFT JOIN
    education ed ON e.id = ed.employee_id
LEFT JOIN (
    SELECT
        employee_id,
        relation_status,
        COUNT(*) AS count_relation
    FROM
        employee_family
    GROUP BY
        employee_id,
        relation_status
) ef ON e.id = ef.employee_id
LEFT JOIN (
    SELECT
        employee_id,
        COUNT(*) AS total_family
    FROM
        employee_family
    GROUP BY
        employee_id
) ef2 ON e.id = ef2.employee_id
GROUP BY
    e.id, e.nik, e.name, e.is_active, ep.gender, ep.date_of_birth, ed.name, ed.level, ef2.total_family;



-- Penjelasan singkatnya:

-- SELECT Clause: Menentukan kolom mana yang akan ditampilkan dalam hasil query. Kolom-kolom tersebut adalah employee_id, nik, name, is_active, gender, age, school_name, level, dan family_data.

-- FROM Clause: Menentukan tabel-tabel yang akan digunakan dalam query. Tabel-tabel yang digunakan adalah employee, employee_profile, education, dan employee_family.

-- LEFT JOIN: Menghubungkan tabel-tabel tersebut dengan menggunakan operasi LEFT JOIN berdasarkan kondisi yang dibutuhkan yang berarti semua baris dari tabel sebelah kiri (employee) akan ditampilkan, bahkan jika tidak ada baris yang sesuai dalam tabel sebelah kanan (employee_profile, education, employee_family).

-- GROUP BY Clause: Mengelompokkan baris-baris hasil query berdasarkan kolom-kolom yang ditentukan. Dalam hal ini, baris-baris dikelompokkan berdasarkan employee_id, nik, name, is_active, gender, date_of_birth, school_name, dan level.

-- Aggregate Functions: Digunakan untuk melakukan operasi agregasi seperti COUNT untuk menghitung jumlah baris yang sesuai dalam setiap grup.

-- String Aggregation: Menggunakan fungsi STRING_AGG untuk menggabungkan data dari kolom-kolom relation_status dan count_relation dalam tabel employee_family menjadi satu string yang dipisahkan oleh '&' untuk setiap karyawan.

-- COALESCE Function: Menggantikan nilai NULL dengan nilai alternatif. Dalam hal ini, jika tidak ada data keluarga yang terkait dengan karyawan, maka akan ditampilkan "-" menggunakan fungsi COALESCE.