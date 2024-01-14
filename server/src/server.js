const express = require('express');
const cors = require('cors')
const db = require('./db_app.js');
const { auth } = require('express-openid-connect');
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

https.createServer({
    key: fse.readFileSync('server.key'),
    cert: fse.readFileSync('server.cert')
}, app).listen(port, host, () => console.log(`Server running at https://${host}:${port}/`));
//app.listen(port, host, () => console.log(`Server running at http://${host}:${port}/`))