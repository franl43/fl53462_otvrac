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
            SELECT d.name dealership_name,
                json_agg(json_build_object('days', wh.days, 'open_time', wh.open_time, 'closing_time', wh.closing_time)) AS working_hours,
                (
                    SELECT json_agg(json_build_object('brand', b.name, 'car_name', c.name, 'price_euro', c.price_euro)) AS cars
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
        ) row;
    `);
    result.rows.forEach(r => {
        ds.push(r.row_to_json);
    })
    return ds;
}

async function getDealershipsFilterAll(filter) {
    const unique = []
    const ds = []
    await getDealershipsFilterDealershipName(filter)
    .then(r1 => r1.forEach(e => {
        if(!unique.includes(e.dealership_name) && e.cars != null) {
            ds.push(e)
            unique.push(e.dealership_name)
        }
    }))

    await getDealershipsFilterAddress(filter)
    .then(r4 => r4.forEach(e => {
        if(!unique.includes(e.dealership_name) && e.cars != null) {
            ds.push(e)
            unique.push(e.dealership_name)
        }
    }))
    
    await getDealershipsFilterBrand(filter)
    .then(r2 => r2.forEach(e => {
        if(!unique.includes(e.dealership_name) && e.cars != null) {
            ds.push(e)
            unique.push(e.dealership_name)
        }
    }))

    await getDealershipsFilterCarName(filter)
    .then(r3 => r3.forEach(e => {
        if(!unique.includes(e.dealership_name) && e.cars != null) {
            ds.push(e)
            unique.push(e.dealership_name)
        }
    }))
    
    return ds;
}

async function getDealershipsFilterDealershipName(filter) {
    const ds = []
    const result = await pool.query(`
        SELECT row_to_json(row)
        FROM (
            SELECT d.name dealership_name,
                json_agg(json_build_object('days', wh.days, 'open_time', wh.open_time, 'closing_time', wh.closing_time)) AS working_hours,
                (
                    SELECT json_agg(json_build_object('brand', b.name, 'car_name', c.name, 'price_euro', c.price_euro)) AS cars
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
            WHERE lower(d.name) LIKE lower('%${filter}%')
            GROUP BY d.id
        ) row;
    `);
    result.rows.forEach(r => {
        ds.push(r.row_to_json);
    })
    return ds;
}

async function getDealershipsFilterBrand(filter) {
    const ds = []
    const result = await pool.query(`
        SELECT row_to_json(row)
        FROM (
            SELECT d.name dealership_name,
                json_agg(json_build_object('days', wh.days, 'open_time', wh.open_time, 'closing_time', wh.closing_time)) AS working_hours,
                (
                    SELECT json_agg(json_build_object('brand', b.name, 'car_name', c.name, 'price_euro', c.price_euro)) AS cars
                    FROM dealership d1
                    LEFT JOIN dealership_car dc ON d1.id = dc.dealership_id 
                    LEFT JOIN car c ON c.id = dc.car_id
                    LEFT JOIN car_brand b ON c.brand_id = b.id
                    WHERE d1.id = d.id AND lower(b.name) LIKE lower('%${filter}%')
                    GROUP BY d1.id
                ),
                d.phone_number, d.email, d.address
            FROM working_hours wh
            LEFT JOIN dealership_working_hours dwh ON wh.id = dwh.working_hours_id
            LEFT JOIN dealership d ON d.id = dwh.dealership_id
            GROUP BY d.id
        ) row;
    `);
    result.rows.forEach(r => {
        ds.push(r.row_to_json);
    })
    return ds;
}

async function getDealershipsFilterCarName(filter) {
    const ds = []
    const result = await pool.query(`
        SELECT row_to_json(row)
        FROM (
            SELECT d.name dealership_name,
                json_agg(json_build_object('days', wh.days, 'open_time', wh.open_time, 'closing_time', wh.closing_time)) AS working_hours,
                (
                    SELECT json_agg(json_build_object('brand', b.name, 'car_name', c.name, 'price_euro', c.price_euro)) AS cars
                    FROM dealership d1
                    LEFT JOIN dealership_car dc ON d1.id = dc.dealership_id 
                    LEFT JOIN car c ON c.id = dc.car_id
                    LEFT JOIN car_brand b ON c.brand_id = b.id
                    WHERE d1.id = d.id AND lower(c.name) LIKE lower('%${filter}%')
                    GROUP BY d1.id
                ),
                d.phone_number, d.email, d.address
            FROM working_hours wh
            LEFT JOIN dealership_working_hours dwh ON wh.id = dwh.working_hours_id
            LEFT JOIN dealership d ON d.id = dwh.dealership_id
            GROUP BY d.id
        ) row;
    `);
    result.rows.forEach(r => {
        ds.push(r.row_to_json);
    })
    return ds;
}

async function getDealershipsFilterAddress(filter) {
    const ds = []
    const result = await pool.query(`
        SELECT row_to_json(row)
        FROM (
            SELECT d.name dealership_name,
                json_agg(json_build_object('days', wh.days, 'open_time', wh.open_time, 'closing_time', wh.closing_time)) AS working_hours,
                (
                    SELECT json_agg(json_build_object('brand', b.name, 'car_name', c.name, 'price_euro', c.price_euro)) AS cars
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
            WHERE lower(d.address) LIKE lower('%${filter}%')
            GROUP BY d.id
        ) row;
    `);
    result.rows.forEach(r => {
        ds.push(r.row_to_json);
    })
    return ds;
}

module.exports = {getDealerships,
                    getDealershipsFilterAll,
                    getDealershipsFilterDealershipName,
                    getDealershipsFilterBrand,
                    getDealershipsFilterCarName,
                    getDealershipsFilterAddress
                }