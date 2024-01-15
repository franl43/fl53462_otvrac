const express = require('express');
const db = require('./db_api.js');
const fse = require('fs-extra');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))

const host = 'localhost'
const port = 8081

app.get('/api/v1/', function(req, res) {
    fse.readJSON(path.resolve(__dirname, '..', '..', 'openapi.json'))
    .then(data => {
        res.json(resWrapper(200, "OK", `openapi.json fetched.`, data))
    })
    .catch(err => {
        res.status(404).json(resWrapper(404, "Not Found", `Can't read openapi.json.`, null))
    })
});

app.get('/api/v1/dealerships', function(req, res) {
    let result = []
    
    db.getDealerships()
    .then(p => {
        p.forEach(r => result.push(r))
        if(result.length > 0) {
            let jsonldResult = []
            result.forEach(r => jsonldResult.push(jsonldWrapper(r)))
            res.json(resWrapper(200, "OK", `All dealerships fetched.`, jsonldResult))
        } else {
            res.status(404).json(resWrapper(404, "Not Found", `Can't find fetched resource.`, null))
        }
    })
});

app.get('/api/v1/dealerships/:id', function(req, res) {
    let id = parseInt(req.params.id)
    
    let result = []
    if(id) {
        db.getDealershipById(id)
        .then(p => {
            p.forEach(r => result.push(r))
            if(result.length == 1) {
                jsonldWrapper(result[0])
                res.json(resWrapper(200, "OK", `Dealership with id:${id} fetched.`, jsonldWrapper(result[0])))
            } else {
                res.status(404).json(resWrapper(404, "Not Found", `Dealership with id:${id} doesn't exist.`, null))
            }
        })
    } else {
        res.status(404).json(resWrapper(404, "Not Found", `Dealership with id:${req.params.id} doesn't exist.`, null))
    }
    
});

app.get('/api/v1/cars', function(req, res) {
    let result = []
    
    db.getCars()
    .then(p => {
        p.forEach(r => result.push(r))
        if(result.length > 0) {
            res.json(resWrapper(200, "OK", `All cars fetched.`, result))
        } else {
            res.status(404).json(resWrapper(404, "Not Found", `Can't find fetched resource.`, null))
        }
    })
});

app.get('/api/v1/cars/:id', function(req, res) {
    let id = parseInt(req.params.id)
    
    let result = []
    if(id) {
        db.getCarById(id)
        .then(p => {
            p.forEach(r => result.push(r))
            if(result.length == 1) {
                res.json(resWrapper(200, "OK", `Car with id:${id} fetched.`, result[0]))
            } else {
                res.status(404).json(resWrapper(404, "Not Found", `Car with id:${id} doesn't exist.`, null))
            }
        })
    } else {
        res.status(404).json(resWrapper(404, "Not Found", `Car with id:${req.params.id} doesn't exist.`, null))
    }
});

app.get('/api/v1/working_hours', function(req, res) {
    let result = []
    
    db.getWorkingHours()
    .then(p => {
        p.forEach(r => result.push(r))
        if(result.length > 0) {
            res.json(resWrapper(200, "OK", `Working hours for all dealerships fetched.`, result))
        } else {
            res.status(404).json(resWrapper(404, "Not Found", `Can't find fetched resource.`, null))
        }
    })
});

app.get('/api/v1/working_hours/:id', function(req, res) {
    let id = parseInt(req.params.id)
    
    let result = []
    if(id) {
        db.getWorkingHoursByDsId(id)
        .then(p => {
            p.forEach(r => result.push(r))
            if(result.length == 1) {
                res.json(resWrapper(200, "OK", `Working hours for dealership with id:${id} fetched.`, result[0]))
            } else {
                res.status(404).json(resWrapper(404, "Not Found", `Working hours for dealership with id:${id} doesn't exist.`, null))
            }
        })
    } else {
        res.status(404).json(resWrapper(404, "Not Found", `Working hours for dealership with id:${req.params.id} doesn't exist.`, null))
    }
});

app.get('/api/v1/contact', function(req, res) {
    let result = []
    
    db.getContactInfo()
    .then(p => {
        p.forEach(r => result.push(r))
        if(result.length > 0) {
            res.json(resWrapper(200, "OK", `Contact info for all dealerships fetched.`, result))
        } else {
            res.status(404).json(resWrapper(404, "Not Found", `Can't find fetched resource.`, null))
        }
    })
});

app.get('/api/v1/contact/:id', function(req, res) {
    let id = parseInt(req.params.id)
    
    let result = []
    if(id) {
        db.getContactInfoByDsId(id)
        .then(p => {
            p.forEach(r => result.push(r))
            if(result.length == 1) {
                res.json(resWrapper(200, "OK", `Contact info for dealership with id:${id} fetched.`, result[0]))
            } else {
                res.status(404).json(resWrapper(404, "Not Found", `Contact info for dealership with id:${id} doesn't exist.`, null))
            }
        })
    } else {
        res.status(404).json(resWrapper(404, "Not Found", `Contact info for dealership with id:${req.params.id} doesn't exist.`, null))
    }
});

app.post('/api/v1/dealerships', function(req, res) {
    let obj = req.body
    let result = []
    let wh_ids = []
    let c_ids = []

    if(obj.dealership_name && obj.phone_number && obj.email && obj.address && obj.working_hours && obj.cars) {
        obj.working_hours.forEach(wh => {
            wh_ids.push(wh.wh_id)
        })
        obj.cars.forEach(c => {
            c_ids.push(c.car_id)
        })

        db.insertDealership(obj.dealership_name, obj.phone_number, obj.email, obj.address, wh_ids, c_ids)
        .then(p => {
            p.forEach(r => result.push(r))
            let id = result.at(0)
            if(id) {
                let idObj = {id: id}
                Object.assign(idObj, obj)
                res.json(resWrapper(200, "OK", `Dealership inserted.`, idObj))
            } else {
                res.status(409).json(resWrapper(409, "Conflict", "Dealership insert failed.", obj))
            }
            
        })
    } else {
        res.status(422).json(resWrapper(422, "Unprocessable Content", "Dealership json invalid.", obj))
    }   
});

app.put('/api/v1/dealerships/:id', function(req, res) {
    let id = parseInt(req.params.id)
    
    let result = []
    if(id) {
        db.updateDealership(id, req.body)
        .then(p1 => {
            db.getDealershipById(id)
            .then(p => {
                p.forEach(r => result.push(r))
                if(result.length == 1) {
                    res.json(resWrapper(200, "OK", `Dealership with id:${id} updated.`, result[0]))
                } else {
                    res.status(404).json(resWrapper(404, "Not Found", `Dealership with id:${id} doesn't exist.`, null))
                }
            })
        })
    } else {
        res.status(404).json(resWrapper(404, "Not Found", `Dealership with id:${req.params.id} doesn't exist.`, null))
    }   
});

app.put('/api/v1/working_hours/:id', function(req, res) {
    let id = parseInt(req.params.id)
    
    let result = []
    if(id) {
        db.updateWorkingHours(id, req.body) 
        .then(p => {
            p.forEach(r => result.push(r))
            res.json(resWrapper(200, "OK", `Working hours with id:${id} updated.`, null))
        })
    } else {
        res.status(404).json(resWrapper(404, "Not Found", `Working hours with id:${req.params.id} doesn't exist.`, null))
    }   
});


app.delete('/api/v1/dealerships/:id', function(req, res) {
    let id = parseInt(req.params.id)
    
    let result = []
    if(id) {
        db.deleteDealership(id)
        .then(p => {
            p.forEach(r => result.push(r))
            if(result.length == 1) {
                res.json(resWrapper(200, "OK", `Dealership with id:${id} deleted.`, null))
            } else {
                res.status(404).json(resWrapper(404, "Not Found", `Dealership with id:${id} doesn't exist.`, null))
            }
        })
    } else {
        res.status(404).json(resWrapper(404, "Not Found", `Dealership with id:${req.params.id} doesn't exist.`, null))
    }   
});


app.patch('/api/v1*', function(req, res) {
    res.status(501).json(resWrapper(501, "Not Implemented", 'PATCH not implemented', null))
});

function resWrapper(code, status, msg, response) {
    resp = {
        "code": code,
        "status": status,
        "message": msg,
        "response": response
    }
    return resp
}

function jsonldWrapper(ds) {
    jsonld = {
        "@context": {
            "dealership_name": "https://schema.org/name",
            "phone_number": "https://schema.org/telephone",
            "email": "https://schema.org/email",
            "address": "https://schema.org/address",
            "open_time": "https://schema.org/opens",
            "closing_time": "https://schema.org/closes"
        },
        "@type": "https://schema.org/Organization",
        "dealership_name": ds.dealership_name
    }
    let whs = []
    for(let ws of ds.working_hours) {
        whs.push({
            "@type": "https://schema.org/OpeningHoursSpecification",
            "wh_id": ws.wh_id,
            "days": ws.days,
            "open_time": ws.open_time,
            "closing_time": ws.closing_time
        })
    }
    let whsObj = {"working_hours": whs}
    let restObj = {
        "cars": ds.cars,
        "phone_number": ds.phone_number,
        "email": ds.email,
        "address": ds.address
    }
    Object.assign(jsonld, whsObj, restObj)
    
    return jsonld
}

app.listen(port, host, () => console.log(`Server running at http://${host}:${port}/api/v1/`))