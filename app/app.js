const projectList = document.querySelector("#project-list");
const loadMessage = document.querySelector("#load-message");
const projectCardTemplate = document.querySelector("#project-card-template");

const statusLabels = {
  active: "Active",
  "on-track": "On track",
  "at-risk": "At risk",
  planned: "Planned",
  complete: "Complete",
};

const priorityLabels = {
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
};

function formatLabel(value, labels) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error("A project is missing a required status or priority.");
  }

  const normalized = value.trim().toLowerCase();
  return {
    label: labels[normalized] ?? value.trim(),
    className: normalized.replace(/[^a-z0-9-]/g, ""),
  };
}

function createProjectCard(project, index) {
  for (const field of ["name", "owner", "status", "recentActivity", "priority"]) {
    if (typeof project[field] !== "string" || project[field].trim() === "") {
      throw new Error(`Project ${index + 1} is missing a valid ${field}.`);
    }
  }

  const status = formatLabel(project.status, statusLabels);
  const priority = formatLabel(project.priority, priorityLabels);
  const card = projectCardTemplate.content.firstElementChild.cloneNode(true);
  card.classList.add(`project-card-${index % 3}`);
  card.querySelector('[data-field="status"]').className =
    `status-badge status-${status.className}`;
  card.querySelector('[data-field="status"]').textContent = status.label;
  card.querySelector('[data-field="priority"]').classList.add(
    `priority-${priority.className}`,
  );
  card.querySelector('[data-field="priority-label"]').textContent = priority.label;
  card.querySelector('[data-field="name"]').textContent = project.name.trim();
  card.querySelector('[data-field="owner-initial"]').textContent =
    project.owner.trim().slice(0, 1).toUpperCase();
  card.querySelector('[data-field="owner"]').textContent =
    `Led by ${project.owner.trim()}`;
  card.querySelector('[data-field="summary"]').textContent =
    typeof project.summary === "string" && project.summary.trim()
      ? project.summary.trim()
      : "Making steady progress toward the next milestone.";
  card.querySelector('[data-field="recentActivity"]').textContent =
    project.recentActivity.trim();
  return card;
}

async function loadProjects() {
  const response = await fetch("project-data.json");
  if (!response.ok) {
    throw new Error(`Project data could not be loaded (HTTP ${response.status}).`);
  }

  const data = await response.json();
  if (!data || !Array.isArray(data.projects)) {
    throw new Error('Project data must include a top-level "projects" array.');
  }

  const cards = data.projects.map(createProjectCard);
  projectList.replaceChildren(...cards);
  projectList.setAttribute("aria-busy", "false");

  document.querySelector("#project-count").textContent = String(data.projects.length);
  document.querySelector("#active-count").textContent = String(
    data.projects.filter((project) => {
      const status = String(project.status).toLowerCase();
      return status === "active" || status === "on-track";
    }).length,
  );
  document.querySelector("#attention-count").textContent = String(
    data.projects.filter(
      (project) =>
        String(project.status).toLowerCase() === "at-risk" ||
        String(project.priority).toLowerCase() === "high",
    ).length,
  );

  loadMessage.hidden = true;
}

loadProjects().catch((error) => {
  console.error("Unable to display Project Pulse data:", error);
  projectList.setAttribute("aria-busy", "false");
  loadMessage.className = "load-message load-message-error";
  loadMessage.textContent =
    "We couldn’t load the project list. Check that the preview server is running and app/project-data.json is available.";
});
