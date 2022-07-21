let envs = [
    "dev",
    "int",
    "rct",
    "pprod",
    "prod"
];

let services = [
    "algorithm",
    "measurement",
    "parameter",
    "notification",
    "task",
    "compute",
    "bs-statement",
    "bs-auth",
    "bs-user",
    "bs-invoice",
    "bs-partner",
    "bs-config",
    "bs-meter",
    "bs-synoptic",
    "bs-energy-modeling",
    "bs-action-plan",
    "bs-geocoding",
    "bs-commitment",
    "adie",
    "bs-sensor",
    "bs-dataset",
    "market-index",
    "sensor-data-ingestion",
    "sensor-data-ingestion-histo",
    "invoice-ingestion",
    "sensor-data-aggregation",
    "bs-alarm",
    "ds-tools",
    "bs-estate",
    "bs-transformer",
    "bs-datacollect",
    // "ds-event-sourcing",
    // "file-router",
    // "bs-historization",
    // "bs-module",
    // "bs-rule",
    // "aim-user",
    // "api-ingestion-engine",
    // "document-ingestion-engine",
    // "timeseries-ingestion-engine",
    // "timeseries-ingestion-engine",
    // "data-catalogue"
];
let servicesOptions = document.getElementById("services");
servicesOptions.innerHTML = "<option value=\"\">--Please choose an option--</option>\n" +
    services
        .map(env => "<option value=\"" + env + "\">" + env + "</option>")
        .join("\n");

let envsOptions = document.getElementById("envs");
envsOptions.innerHTML = "<option value=\"\">--Please choose an option--</option>\n" +
    envs
        .map(service => "<option value=\"" + service + "\">" + service + "</option>")
        .join("\n");

let ok = document.getElementById("ok");
ok.addEventListener("click", async ev => {
    if (envsOptions.value !== "" && servicesOptions.value !== "") {
        console.log(envsOptions.value, servicesOptions.value);
        const card = await serviceCard(envsOptions.value, servicesOptions.value);
        console.log(card)
        let bord = document.getElementById("bord")
        bord.innerHTML = card
    }
})

// showAll(env, services);

async function showAll(env, services) {
    let servicesCard = await showServices(env, services)
    console.log(servicesCard)
    let bord = document.getElementById("bord")
    bord.innerHTML = servicesCard
}

async function showServices(env, services) {
    let infoServices = []
    for (const service of services) {
        const value = await serviceCard(env, service);
        infoServices.push(value);
    }
    return infoServices.join('')
}

async function serviceCard(env, service) {
    const value = await actuatorInfo(env, service);
    if (value === undefined) {
        return "";
    }

    return "<div class='card'>" +
        "<h1>" + value.build.artifact + "</h1>" +
        "<h3>build:</h3>" +
        "<p>" + new Date(value.build.time).toUTCString() + "</p>" +
        "<p>" + value.build.version + "</p>" +
        "<h3>git:</h3>" +
        "<p>" + value.git.branch + "</p>" +
        "<p>" + value.git.commit.id + "</p>" +
        "<p>" + new Date(value.git.commit.time).toUTCString() + "</p>" +
        "<h3>documentation:</h3>" +
        "<a href='" + getDocumentationUrl(env, service) + "'>swagger-ui</a>" +
        "<h3>actuator info:</h3>" +
        "<a href='" + getActuatorInfo(env, service) + "'>actuator</a>" +
        "</div>";
}

async function actuatorInfo(env, service) {
    let url = getActuatorInfo(env, service);
    console.log(env, service, url);
    return await fetch(url)
        .then(response => response.json())
        .then((data) => data)
        .catch(reason => undefined);
}

function getActuatorInfo(env, service) {
    return getUrl(env) + service + "/actuator/info";
}

function getUrl(env) {
    switch (env) {
        case "dev":
            return "https://backend-api-dev.energisme.net/"
        case "int":
            return "https://backend-api-int.energisme.net/"
        case "rct":
            return "http://backend-api-rct.energisme.net/"
        case "pprod":
            return "http://backend-api-pprod.energisme.net/"
        case "prod":
            return "http://backend-api-prod.energisme.net/"
    }
}

function getDocumentationUrl(env, service) {
    return getUrl(env) + service + "/swagger-ui.html"
}
