// LOGIN
function login() {
    let name = document.getElementById("username").value;

    if (!name) {
        alert("Enter your name");
        return;
    }

    localStorage.setItem("username", name);
    window.location.href = "index.html";
}


// LOGOUT
function logout() {
    localStorage.removeItem("username");
    window.location.href = "login.html";
}


// SHOW USER
if (document.getElementById("welcome")) {
    let name = localStorage.getItem("username");

    if (!name) {
        window.location.href = "login.html";
    } else {
        document.getElementById("welcome").innerText = "Logged in as: " + name;
    }
}


// SEND SOS
function sendSOS() {

    let name = localStorage.getItem("username");

    if (!name) {
        alert("Please start session first");
        return;
    }

    document.getElementById("status").innerText =
        "Getting location...";

    navigator.geolocation.getCurrentPosition(

        function(position) {

            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            console.log("Latitude:", lat);
            console.log("Longitude:", lon);

            fetch('http://localhost:5000/alert', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    name: name,
                    latitude: lat,
                    longitude: lon
                })

            })

            .then(response => response.json())

            .then(data => {

                document.getElementById("status").innerText =
                    "Alert created";

            });

        },

        function(error) {

            console.log(error);

            document.getElementById("status").innerText =
                "Location access denied";

        },

    );

}


// LOAD ALERTS
function loadAlerts() {
    fetch('http://localhost:5000/alerts')
    .then(res => res.json())
    .then(data => {
        let container = document.getElementById("alerts");
        if (!container) return;

        container.innerHTML = "";

        document.getElementById("count").innerText = data.length;

        data.forEach(a => {
            let statusClass = a[2] === "RAISED" ? "raised" : "resolved";

            let div = document.createElement("div");
            div.className = "alert-card";

            div.innerHTML = `
                <div>
                    <b>Alert ${a[0]}</b><br>
                    ${a[1]}<br>
                    <small>${a[3]}</small>
                </div>

                <span class="status ${statusClass}">
                    ${a[2]}
                </span>

                ${a[2] === "RAISED" ? 
                `<button class="resolve-btn" onclick="resolveAlert(${a[0]})">Resolve</button>` 
                : ""}
            `;

            container.appendChild(div);
        });
    })
    .catch(err => console.error(err));
}


// RESOLVE ALERT
function resolveAlert(id) {
    fetch(`http://localhost:5000/resolve/${id}`, {
        method: 'POST'
    })
    .then(() => loadAlerts())
    .catch(err => console.error(err));
}


// AUTO LOAD
if (document.getElementById("alerts")) {
    loadAlerts();
}


// AUTO REFRESH
setInterval(() => {
    if (document.getElementById("alerts")) {
        loadAlerts();
    }
}, 5000);