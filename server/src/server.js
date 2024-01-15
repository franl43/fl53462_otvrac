const express = require('express');
const cors = require('cors')
const db = require('./db_app.js');
const { auth, requiresAuth } = require('express-openid-connect');
const dotenv = require('dotenv');
const https = require('https');
const fse = require('fs-extra');
const path = require('path')
const app = express();

const host = 'localhost'
const port = 8080

app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');
app.use('/disk', express.static(path.resolve(__dirname, '../../')))

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500']
}));

const config = { 
    authRequired : false,
    idpLogout : false,
    secret: process.env.SECRET,
    baseURL: `https://${host}:${port}`,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: 'https://flaic.eu.auth0.com',
    clientSecret: process.env.CLIENT_SECRET,
    authorizationParams: {
        response_type: 'code' ,
        //scope: "openid profile email"   
    },
};

app.use(auth(config));

app.get('/',  function (req, res) {
    let username;
    if(req.oidc.isAuthenticated()) {
      username = req.oidc.user?.name ?? req.oidc.user?.sub;
    }
    res.render('index', {username})
});

app.get('/datatable',  function (req, res) {
    let username;
    if(req.oidc.isAuthenticated()) {
      username = req.oidc.user?.name ?? req.oidc.user?.sub;
    }
    res.render('datatable', {username})
});

app.get('/profile', function (req, res) {
    if(req.oidc.isAuthenticated()) {
        let username = req.oidc.user?.name ?? req.oidc.user?.sub;
        let user = req.oidc.user
        res.render('profile', {username, user})
    } else {
        res.status(403).render('err403');
    }
});

app.get('/data', function (req, res) {
    if(req.oidc.isAuthenticated()) {
        let data = []
        db.getDealerships()
        .then(p => {
            p.forEach(r => data.push(r))
        })
        .then(p1 => {
            let csv = 'dealership_name,days,open_time,closing_time,brand,car_name,price_euro,phone_number,email,address\n'

            for(let i=0; i<data.length; i++) {
                let ds = data.at(i)
                let whs = ds.working_hours
                let cars = ds.cars

                for(let j=0; j<cars.length; j++) {
                    let car = cars.at(j)
                    for(let k=0; k<whs.length; k++) {
                        let wh = whs.at(k)
                        csv += `${ds.dealership_name},${wh.days},${wh.open_time != null ? wh.open_time : ''},${wh.closing_time != null ? wh.closing_time : ''},${car.brand},${car.car_name},${car.price_euro},${ds.phone_number},${ds.email},"${ds.address}"\n`
                    }
                }
            }

            fse.writeFileSync('autokuce_u_zagrebu.csv', csv);
            fse.writeFileSync('autokuce_u_zagrebu.json', JSON.stringify(data));

            res.redirect('/');
        })
    } else {
        res.status(403).render('err403');
    }
});

app.get('/login', (req, res) => {
    res.oidc.login({
        returnTo: '/',
        authorizationParams: {      
            screen_hint: "login",
        },
    });
});

app.get('/getAll', function (req, res) {
    let result = []
    db.getDealerships()
    .then(p => {
        p.forEach(r => result.push(r))
        res.json(result)
    })
});

app.get('/getFAll', function (req, res) {
    let result = []
    db.getDealershipsFilterAll(req.query.filter)
    .then(p => {
        p.forEach(r => result.push(r))
        res.json(result)
    })
});

app.get('/getFDealershipName', function (req, res) {
    let result = []
    db.getDealershipsFilterDealershipName(req.query.filter)
    .then(p => {
        p.forEach(r => {if(r.cars != null) result.push(r)})
        res.json(result)
    })
});

app.get('/getFBrand', function (req, res) {
    let result = []
    db.getDealershipsFilterBrand(req.query.filter)
    .then(p => {
        p.forEach(r => {if(r.cars != null) result.push(r)})
        res.json(result)
    })
});

app.get('/getFCarName', function (req, res) {
    let result = []
    db.getDealershipsFilterCarName(req.query.filter)
    .then(p => {
        p.forEach(r => {if(r.cars != null) result.push(r)})
        res.json(result)
    })
});

app.get('/getFAddress', function (req, res) {
    let result = []
    db.getDealershipsFilterAddress(req.query.filter)
    .then(p => {
        p.forEach(r => {if(r.cars != null) result.push(r)})
        res.json(result)
    })
});

app.get('*', function (req, res) {
    let username = req.oidc.user?.name ?? req.oidc.user?.sub;
    res.status(404).render('err404', {username});
});

https.createServer({
    key: fse.readFileSync('server.key'),
    cert: fse.readFileSync('server.cert')
}, app).listen(port, host, () => console.log(`Server running at https://${host}:${port}/`));
//app.listen(port, host, () => console.log(`Server running at http://${host}:${port}/`))