const {Pool} = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: false
})

async function getDealerships() {
    const ds = []
    const result = await pool.query(`
        SELECT row_to_json(row)
        FROM (
            SELECT d.id id, d.name dealership_name,
                json_agg(json_build_object('wh_id', wh.id, 'days', wh.days, 'open_time', wh.open_time, 'closing_time', wh.closing_time)) AS working_hours,
                (
                    SELECT json_agg(json_build_object('car_id', c.id, 'brand', b.name, 'car_name', c.name, 'price_euro', c.price_euro)) AS cars
                    FROM dealership d1
                    LEFT JOIN dealership_car dc ON d1.id = dc.dealership_id 
                    LEFT JOIN car c ON c.id = dc.car_id
                    LEFT JOIN car_brand b ON c.brand_id = b.id
                    WHERE d1.id = d.id
                    GROUP BY d1.id
                ),
                d.phone_number, d.email, d.address
            FROM working_hours wh
            LEFT JOIN dealership_working_hours dwh ON wh.id = dwh.working_hours_id
            LEFT JOIN dealership d ON d.id = dwh.dealership_id
            GROUP BY d.id
            ORDER BY d.id
        ) row;
    `);
    result.rows.forEach(r => {
        ds.push(r.row_to_json);
    })
    return ds;
}

async function getDealershipById(id) {
    const ds = []
    const result = await pool.query(`
        SELECT row_to_json(row)
        FROM (
            SELECT d.id id, d.name dealership_name,
                json_agg(json_build_object('wh_id', wh.id, 'days', wh.days, 'open_time', wh.open_time, 'closing_time', wh.closing_time)) AS working_hours,
                (
                    SELECT json_agg(json_build_object('car_id', c.id, 'brand', b.name, 'car_name', c.name, 'price_euro', c.price_euro)) AS cars
                    FROM dealership d1
                    LEFT JOIN dealership_car dc ON d1.id = dc.dealership_id 
                    LEFT JOIN car c ON c.id = dc.car_id
                    LEFT JOIN car_brand b ON c.brand_id = b.id
                    WHERE d1.id = d.id
                    GROUP BY d1.id
                ),
                d.phone_number, d.email, d.address
            FROM working_hours wh
            LEFT JOIN dealership_working_hours dwh ON wh.id = dwh.working_hours_id
            LEFT JOIN dealership d ON d.id = dwh.dealership_id
            WHERE d.id = ${id}
            GROUP BY d.id
        ) row;
    `);
    result.rows.forEach(r => {
        ds.push(r.row_to_json);
    })
    return ds;
}

async function getCars() {
    const cars = []
    const result = await pool.query(`
        SELECT row_to_json(row)
        FROM (
            SELECT c.id car_id, b.name brand, c.name car_name, c.price_euro price_euro 
            FROM car c
            LEFT JOIN car_brand b ON c.brand_id = b.id
            ORDER BY c.id
        ) row;
    `);
    result.rows.forEach(r => {
        cars.push(r.row_to_json);
    })
    return cars;
}

async function getCarById(id) {
    const cars = []
    const result = await pool.query(`
        SELECT row_to_json(row)
        FROM (
            SELECT c.id car_id, b.name brand, c.name car_name, c.price_euro price_euro 
            FROM car c
            LEFT JOIN car_brand b ON c.brand_id = b.id
            WHERE c.id = ${id}
            ORDER BY c.id
        ) row;
    `);
    result.rows.forEach(r => {
        cars.push(r.row_to_json);
    })
    return cars;
}

async function getWorkingHours() {
    const whs = []
    const result = await pool.query(`
        SELECT row_to_json(row)
        FROM (
            SELECT d.id id, json_agg(json_build_object('wh_id', wh.id, 'days', wh.days, 'open_time', wh.open_time, 'closing_time', wh.closing_time)) AS working_hours
            FROM dealership d
            LEFT JOIN dealership_working_hours dwh ON d.id = dwh.dealership_id
            LEFT JOIN working_hours wh ON dwh.working_hours_id = wh.id
            GROUP BY d.id
            ORDER BY d.id
        ) row;
    `);
    result.rows.forEach(r => {
        whs.push(r.row_to_json);
    })
    return whs;
}

async function getWorkingHoursByDsId(id) {
    const whs = []
    const result = await pool.query(`
        SELECT row_to_json(row)
        FROM (
            SELECT d.id id, json_agg(json_build_object('wh_id', wh.id, 'days', wh.days, 'open_time', wh.open_time, 'closing_time', wh.closing_time)) AS working_hours
            FROM dealership d
            LEFT JOIN dealership_working_hours dwh ON d.id = dwh.dealership_id
            LEFT JOIN working_hours wh ON dwh.working_hours_id = wh.id
            WHERE d.id = ${id}
            GROUP BY d.id
            ORDER BY d.id
        ) row;
    `);
    result.rows.forEach(r => {
        whs.push(r.row_to_json);
    })
    return whs;
}

async function getContactInfo() {
    const cis = []
    const result = await pool.query(`
        SELECT row_to_json(row)
        FROM (
            SELECT d.id id, d.phone_number, d.email
            FROM dealership d
            ORDER BY d.id
        ) row;
    `);
    result.rows.forEach(r => {
        cis.push(r.row_to_json);
    })
    return cis;
}

async function getContactInfoByDsId(id) {
    const cis = []
    const result = await pool.query(`
        SELECT row_to_json(row)
        FROM (
            SELECT d.id id, d.phone_number, d.email
            FROM dealership d
            WHERE d.id = ${id}
            ORDER BY d.id
        ) row;
    `);
    result.rows.forEach(r => {
        cis.push(r.row_to_json);
    })
    return cis;
}

async function insertDealerships(name, phoneNumber, email, address) {
    const id = []
    const result = await pool.query(`
    INSERT INTO dealership(name, phone_number, email, address) VALUES
    ('${name}', '${phoneNumber}', '${email}', '${address}')
    RETURNING id;
    `);
    result.rows.forEach(r => {
        id.push(r.id);
    })
    return id;
}

async function insertDealership(name, phoneNumber, email, address, wh_ids, c_ids) {
    const id = []
    const result = await pool.query(`
        INSERT INTO dealership(name, phone_number, email, address) VALUES
        ('${name}', '${phoneNumber}', '${email}', '${address}')
        RETURNING id;
    `);
    result.rows.forEach(r => {
        id.push(r.id);
    })
    let d_id = id.at(0)
    if(d_id) {
        for(let wh_id of wh_ids) {
            await insertDsWH(d_id, wh_id)
        }
        for(let c_id of c_ids) {
            await insertDsC(d_id, c_id)
        }
    }
    return id;
}

async function insertDsWH(d_id, wh_id) {
    const id = []
    const result = await pool.query(`
        INSERT INTO dealership_working_hours(dealership_id, working_hours_id) VALUES
        (${d_id}, ${wh_id})
        RETURNING dealership_id;
    `);
    result.rows.forEach(r => {
        id.push(r.dealership_id);
    })
    return id;
}

async function insertDsC(d_id, c_id) {
    const id = []
    const result = await pool.query(`
        INSERT INTO dealership_car(dealership_id, car_id) VALUES
        (${d_id}, ${c_id})
        RETURNING dealership_id;
    `);
    result.rows.forEach(r => {
        id.push(r.dealership_id);
    })
    return id;
}

async function updateDealership(id, obj) {
    const res = []
    let result
    if(obj.dealership_name) {
        result = await updateDName(id, obj.dealership_name)
    }
    if(obj.phone_number) {
        result = await updateDPhoneNumber(id, obj.phone_number)
    }
    if(obj.email) {
        result = await updateDEmail(id, obj.email)
    }
    if(obj.address) {
        result = await updateDAddress(id, obj.address)
    }
    result.forEach(r => {
        res.push(r);
    })
    return res;
}

async function updateDName(id, name) {
    const res = []
    const result = await pool.query(`
        UPDATE dealership
        SET name = '${name}'
        WHERE id = ${id}
        RETURNING id;
    `);
    result.rows.forEach(r => {
        res.push(r.id);
    })
    return res;
}

async function updateDPhoneNumber(id, phone_number) {
    const res = []
    const result = await pool.query(`
        UPDATE dealership
        SET phone_number = '${phone_number}'
        WHERE id = ${id}
        RETURNING id;
    `);
    result.rows.forEach(r => {
        res.push(r.id);
    })
    return res;
}

async function updateDEmail(id, email) {
    const res = []
    const result = await pool.query(`
        UPDATE dealership
        SET email = '${email}'
        WHERE id = ${id}
        RETURNING id;
    `);
    result.rows.forEach(r => {
        res.push(r.id);
    })
    return res;
}

async function updateDAddress(id, address) {
    const res = []
    const result = await pool.query(`
        UPDATE dealership
        SET address = '${address}'
        WHERE id = ${id}
        RETURNING id;
    `);
    result.rows.forEach(r => {
        res.push(r.id);
    })
    return res;
}

async function updateWorkingHours(id, obj) {
    const res = []
    let result
    if(obj.open_time) {
        result = await updateWHOpenTime(id, obj.open_time)
    }
    if(obj.closing_time) {
        result = await updateWHClosingTime(id, obj.closing_time)
    }
    result.forEach(r => {
        res.push(r);
    })
    return res;
}

async function updateWHOpenTime(id, open_time) {
    const res = []
    const result = await pool.query(`
        UPDATE working_hours
        SET open_time = '${open_time}'
        WHERE id = ${id}
        RETURNING id;
    `);
    result.rows.forEach(r => {
        res.push(r.id);
    })
    return res;
}

async function updateWHClosingTime(id, closing_time) {
    const res = []
    const result = await pool.query(`
        UPDATE working_hours
        SET closing_time = '${closing_time}'
        WHERE id = ${id}
        RETURNING id;
    `);
    result.rows.forEach(r => {
        res.push(r.id);
    })
    return res;
}

async function deleteDsC(id) {
    const res = []
    const result = await pool.query(`
        DELETE FROM dealership_car WHERE dealership_id = ${id} RETURNING car_id;
    `);
    result.rows.forEach(r => {
        res.push(r.car_id);
    })
    return res;
}

async function deleteDsWH(id) {
    const res = []
    const result = await pool.query(`
        DELETE FROM dealership_working_hours WHERE dealership_id = ${id} RETURNING working_hours_id;
    `);
    result.rows.forEach(r => {
        res.push(r.working_hours_id);
    })
    return res;
}

async function deleteDealership(id) {
    const res = []

    await deleteDsC(id)
    await deleteDsWH(id)

    const result = await pool.query(`
        DELETE FROM dealership WHERE id = ${id} RETURNING id;
    `);
    result.rows.forEach(r => {
        res.push(r.id);
    })
    return res;
}

module.exports = {getDealerships, getDealershipById, getCars, getCarById, getWorkingHours, getWorkingHoursByDsId, getContactInfo, getContactInfoByDsId, insertDealership, updateDealership, updateWorkingHours, deleteDealership}