
"use strict";

// CONFIGURATION

const CONFIG = {
    database: "assets/data/sites.json"
};

// DOM ELEMENTS

const projects = document.getElementById("projects");
const message = document.getElementById("message");
const search = document.getElementById("search");
const siteCount = document.getElementById("site-count");
const year = document.getElementById("year");

let websites = [];

// INITIALIZATION

year.textContent = new Date().getFullYear();

search.addEventListener("input", renderWebsites);

loadWebsites();

// LOAD JSON DATABASE

async function loadWebsites() {
    message.textContent = "Loading websites...";

    try {
        const response = await fetch(CONFIG.database);

        if (!response.ok) {
            throw new Error(`Database error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid database format.");
        }

        websites = data.filter(site =>
            site &&
            typeof site.name === "string" &&
            site.name.trim() !== "" &&
            typeof site.url === "string" &&
            isValidUrl(site.url)
        );

        renderWebsites();

    } catch (error) {
        console.error(error);

        siteCount.textContent = "ERROR";

        message.textContent =
            "Unable to load websites. Check assets/data/sites.json.";
    }
}

// VALIDATE WEBSITE URL

function isValidUrl(value) {
    try {
        const url = new URL(value);

        return (
            url.protocol === "https:" ||
            url.protocol === "http:"
        );
    } catch {
        return false;
    }
}

// CREATE WEBSITE CARD

function createWebsiteCard(site) {
    const card = document.createElement("a");

    card.className = "card";
    card.href = site.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.setAttribute(
        "aria-label",
        `Visit ${site.name} (opens in a new tab)`
    );

    const top = document.createElement("div");
    top.className = "card-top";

    const category = document.createElement("span");
    category.className = "card-category";
    category.textContent = site.category || "Website";

    const arrow = document.createElement("span");
    arrow.className = "card-arrow";
    arrow.textContent = "↗";

    top.append(category, arrow);

    const title = document.createElement("h3");
    title.textContent = site.name;

    const description = document.createElement("p");
    description.textContent =
        site.description || "Visit this website.";

    card.append(top, title, description);

    return card;
}

// RENDER WEBSITE DATABASE

function renderWebsites() {
    projects.replaceChildren();

    const query = search.value.toLowerCase().trim();

    const filtered = websites.filter(site => {
        return (
            site.name.toLowerCase().includes(query) ||
            (site.description || "").toLowerCase().includes(query) ||
            (site.category || "").toLowerCase().includes(query)
        );
    });

    filtered.forEach(site => {
        projects.appendChild(createWebsiteCard(site));
    });

    siteCount.textContent =
        `${websites.length} PROJECT${websites.length === 1 ? "" : "S"}`;

    message.textContent = filtered.length
        ? `${filtered.length} WEBSITE${filtered.length === 1 ? "" : "S"} FOUND`
        : "No websites found.";
}
