const SERVER_URL = "https://localhost:8080";

async function fetchUser() {
    return await fetch(
        SERVER_URL+'/', {
            mode: 'cors',
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        }
    ).then(res => res.json())
    .catch(err => console.log(err))
}

fetchUser().then(data => {
    console.log(data.username)
    if(data.username) {
        console.log("Prijevljen")
    } else {
        console.log("Nije prijavljen")
    }
});