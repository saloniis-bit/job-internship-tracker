const jobForm = document.getElementById("jobForm");
const jobList = document.getElementById("jobList");

const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");

let applications =
  JSON.parse(localStorage.getItem("applications")) || [];

jobForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const company = document.getElementById("company").value;
  const role = document.getElementById("role").value;
  const type = document.getElementById("type").value;
  const status = document.getElementById("status").value;
  const date = document.getElementById("date").value;

  const application = {
    id: Date.now(),
    company,
    role,
    type,
    status,
    date
  };

  applications.push(application);

  saveApplications();
  displayApplications();

  jobForm.reset();
});

function saveApplications() {
  localStorage.setItem(
    "applications",
    JSON.stringify(applications)
  );
}

function displayApplications() {
  jobList.innerHTML = "";

  const searchText = searchInput.value.toLowerCase();
  const selectedStatus = filterStatus.value;

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.company.toLowerCase().includes(searchText) ||
      application.role.toLowerCase().includes(searchText);

    const matchesStatus =
      selectedStatus === "All" ||
      application.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  filteredApplications.forEach((application) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${application.company}</td>
      <td>${application.role}</td>
      <td>${application.type}</td>
      <td class="status">${application.status}</td>
      <td>${application.date}</td>
      <td>
        <button
          class="delete-btn"
          onclick="deleteApplication(${application.id})"
        >
          Delete
        </button>
      </td>
    `;

    jobList.appendChild(row);
  });

  updateStats();
}

function deleteApplication(id) {
  applications = applications.filter(
    (application) => application.id !== id
  );

  saveApplications();
  displayApplications();
}

function updateStats() {
  document.getElementById("totalCount").textContent =
    applications.length;

  document.getElementById("interviewCount").textContent =
    applications.filter(
      (application) => application.status === "Interview"
    ).length;

  document.getElementById("offerCount").textContent =
    applications.filter(
      (application) => application.status === "Offer"
    ).length;
}

searchInput.addEventListener("input", displayApplications);
filterStatus.addEventListener("change", displayApplications);

displayApplications();
