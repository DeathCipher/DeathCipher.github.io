
"use strict";

// CONFIGURATION

const CONFIG = {
    username: "DeathCipher",
    perPage: 100
};

// DOM ELEMENTS

const projects = document.getElementById("projects");
const message = document.getElementById("message");
const search = document.getElementById("search");
const year = document.getElementById("year");

let repositories = [];

// INITIALIZATION

year.textContent = new Date().getFullYear();

search.addEventListener("input", renderProjects);

loadRepositories();

// LOAD GITHUB REPOSITORIES

async function loadRepositories() {
    message.textContent = "Connecting to GitHub...";

    try {
        const response = await fetch(
            `https://api.github.com/users/${CONFIG.username}/repos?per_page=${CONFIG.perPage}&sort=updated`
        );

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();

        repositories = data
            .filter(repo => !repo.fork && !repo.archived)
            .sort((a, b) => {
                if (a.homepage && !b.homepage) return -1;
                if (!a.homepage && b.homepage) return 1;

                return b.stargazers_count - a.stargazers_count;
            });

        renderProjects();

    } catch (error) {
        console.error(error);

        message.textContent =
            "Unable to load projects. Please try again later.";
    }
}

// CREATE PROJECT CARD

function createProjectCard(repo) {
    const card = document.createElement("article");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = repo.name;

    const description = document.createElement("p");
    description.textContent =
        repo.description || "No description available.";

    const tag = document.createElement("div");
    tag.className = "tag";

    tag.textContent =
        `${repo.language || "PROJECT"} · ★ ${repo.stargazers_count}`;

    const links = document.createElement("div");
    links.className = "links";

    if (repo.homepage) {
        links.appendChild(
            createLink(repo.homepage, "VISIT WEBSITE →")
        );
    }

    links.appendChild(
        createLink(repo.html_url, "SOURCE CODE →")
    );

    card.append(title, description, tag, links);

    return card;
}

// CREATE SAFE EXTERNAL LINK

function createLink(url, label) {
    const link = document.createElement("a");

    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;

    return link;
}

// RENDER PROJECTS

function renderProjects() {
    projects.replaceChildren();

    const query = search.value.toLowerCase().trim();

    const filtered = repositories.filter(repo => {
        return (
            repo.name.toLowerCase().includes(query) ||
            (repo.description || "").toLowerCase().includes(query)
        );
    });

    filtered.forEach(repo => {
        projects.appendChild(createProjectCard(repo));
    });

    message.textContent = filtered.length
        ? `${filtered.length} PROJECT(S) FOUND`
        : "No projects found.";
}
