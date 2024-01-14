const SERVER_URL = "https://localhost:8080";

const form = document.getElementById('myForm');
form.addEventListener('submit', filterData);

const downloadBtns = document.getElementById('download-btns')

function downloadJson() {
    const file = new Blob([localStorage.getItem('json')], {type: 'text/plain'})
    const tmp = document.createElement('a')
    tmp.href = URL.createObjectURL(file)
    tmp.download = 'autokuce_u_zagrebu_filter.json'
    tmp.click()
}

function downloadCsv() {
    let data = JSON.parse(localStorage.getItem('json'))

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

    const file = new Blob([csv], {type: 'text/plain'})
    const tmp = document.createElement('a')
    tmp.href = URL.createObjectURL(file)
    tmp.download = 'autokuce_u_zagrebu_filter.csv'
    tmp.click()
}

function filterData(f) {
    f.preventDefault();
    const form = f.currentTarget   

    const filterWord = form.children[1].value

    downloadBtns.hidden = false
    downloadBtns.setAttribute('class', 'd-flex flex-row justify-content-around align-items-center')

    let fields = {}
    const options = form.children[2].children
    for(let i=0; i<6; i++) {
        let key = options[i].value
        let val = options[i].selected

        fields[key] = val
    }

    if(fields['all']) {
        fetchFilterAll(filterWord).then(data => {
            fillTable(data);
            localStorage.setItem('json', JSON.stringify(data))
        })
    } else if(fields['dealership_name']) {
        fetchFilterDealershipName(filterWord).then(data => {
            fillTable(data);
            localStorage.setItem('json', JSON.stringify(data))
        })
    } else if(fields['brand']) {
        fetchFilterBrand(filterWord).then(data => {
            fillTable(data);
            localStorage.setItem('json', JSON.stringify(data))
        })
    } else if(fields['car_name']) {
        fetchFilterCarName(filterWord).then(data => {
            fillTable(data);
            localStorage.setItem('json', JSON.stringify(data))
        })
    } else if(fields['address']) {
        fetchFilterAddress(filterWord).then(data => {
            fillTable(data);
            localStorage.setItem('json', JSON.stringify(data))
        })
    }else {
        fetchAll().then(data => {
            fillTable(data);
            localStorage.setItem('json', JSON.stringify(data))
        })
    }

    // preuzimanje jsona 
    // localStorage.setItem('json', JSON.stringify(data))
}

async function fetchAll() {
    return await fetch(
        SERVER_URL+'/getAll', {
            mode: 'cors',
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        }
    ).then(res => res.json())
    .catch(err => console.log(err))
}

async function fetchFilterAll(filter) {
    return await fetch(
        SERVER_URL+'/getFAll?filter='+filter, {
            mode: 'cors',
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        }
    ).then(res => res.json())
    .catch(err => console.log(err))
}

async function fetchFilterDealershipName(filter) {
    return await fetch(
        SERVER_URL+'/getFDealershipName?filter='+filter, {
            mode: 'cors',
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        }
    ).then(res => res.json())
    .catch(err => console.log(err))
}

async function fetchFilterBrand(filter) {
    return await fetch(
        SERVER_URL+'/getFBrand?filter='+filter, {
            mode: 'cors',
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        }
    ).then(res => res.json())
    .catch(err => console.log(err))
}

async function fetchFilterCarName(filter) {
    return await fetch(
        SERVER_URL+'/getFCarName?filter='+filter, {
            mode: 'cors',
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        }
    ).then(res => res.json())
    .catch(err => console.log(err))
}

async function fetchFilterAddress(filter) {
    return await fetch(
        SERVER_URL+'/getFAddress?filter='+filter, {
            mode: 'cors',
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        }
    ).then(res => res.json())
    .catch(err => console.log(err))
}

function fillTable(data) {
    localStorage.setItem('json', JSON.stringify(data))

    const tableDiv = document.getElementById('table')
    while(tableDiv.firstChild) {
        tableDiv.removeChild(tableDiv.lastChild)
    }

    let table = document.createElement('table')
    table.setAttribute('class', 'table table-striped w-75 m-4')
    table.setAttribute('style', 'white-space: nowrap;')

    let innerHtml = `
        <thead class="bg-primary">
            <tr style="text-align: center;">
            <th scope="col"></th>
            <th scope="col">Naziv auto kuće</th>
            <th scope="col">Radno vrijeme</th>
            <th scope="col">Automobili</th>
            <th scope="col">Broj telefona</th>
            <th scope="col">Email</th>
            <th scope="col">Adresa</th>
            </tr>
        </thead>
        <tbody>
    `
    let rowCnt = 0;
    for(let i=0; i<data.length; i++) {
        let current = data.at(i)

        if(current.cars == null) continue;
        rowCnt++

        let wh = current.working_hours
        let whDict = {}

        for(let j=0; j<wh.length; j++) {
            let e = wh.at(j)
            if(e.days == 'MON-FRI') {
                whDict['mf'] = e.open_time ? e.open_time+'-'+e.closing_time : 'zatvoreno'
            } else if(e.days == 'SAT') {
                whDict['sat'] = e.open_time ? e.open_time+'-'+e.closing_time : 'zatvoreno'
            } else {
                whDict['sun'] = e.open_time ? e.open_time+'-'+e.closing_time : 'zatvoreno'
            }
        }

        let wh_ponpet = wh.at(2).open

        /* console.log(data.at(i)) */
        let dealershipHtml = `
        <tr>
            <th scope="row">${rowCnt}</th>
            <td>${current.dealership_name}</td>
            <td>
                <ul style="list-style-type: none; padding: 0;">
                    <li>
                        <div class="working-hours d-flex flex-row justify-content-between">
                            <div class="working-hours-days">
                                PON-PET
                            </div>
                            <div class="working-hours-time">
                                ${whDict['mf']}
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="working-hours d-flex flex-row justify-content-between">
                            <div class="working-hours-days">
                                SUB
                            </div>
                            <div class="working-hours-time">
                                ${whDict['sat']}
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="working-hours d-flex flex-row justify-content-between">
                            <div class="working-hours-days">
                                NED
                            </div>
                            <div class="working-hours-time">
                                ${whDict['sun']}
                            </div>
                        </div>
                    </li>
                </ul>
            </td>
            <td>
                <ul>
        `
        let cars = current.cars;
        for(let j=0; j<cars.length; j++) {
            let carName = cars.at(j).brand+' '+cars.at(j).car_name
            let price = cars.at(j).price_euro.toFixed(2)
            dealershipHtml += `
                <li>
                    <div class="d-flex flex-row justify-content-between">
                        <div class="car-name">
                            ${carName}
                        </div>
                        <div class="car-price">
                            ${price}&euro;
                        </div>
                    </div>
                </li>     
             `
        }

        dealershipHtml += `
                </ul>
            </td>
            <td>${current.phone_number ?? '-'}</td>
            <td>${current.email ?? '-'}</td>
            <td style="white-space: normal;">${current.address ?? '-'}</td>
        </tr>
        `
        
        innerHtml += dealershipHtml
    }
    innerHtml += `     
        </tbody>
    `
    table.innerHTML = innerHtml
    tableDiv.appendChild(table)
}


