const express = require('express');
const cors = require('cors')
const app = express();
const db = require('./db_app.js')

const host = 'localhost'
const port = 8080

app.use(cors({
    origin: 'http://127.0.0.1:5500'
}))

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

app.listen(port, host, () => console.log(`Server running at http://${host}:${port}/`))