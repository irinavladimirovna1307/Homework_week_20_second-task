let taskData = {};
let chart; // переменная для графика

async function loadData() {
  try {
    const response = await axios.get("data.json");
    taskData = response.data;
    initDashboard();
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
}

function initDashboard() {
  renderChart();
  renderTasks();
  renderComments();
}

function renderChart() {
  const ctx = document.getElementById("taskChart").getContext("2d");
  if (chart) chart.destroy(); // если уже есть график, удаляем его

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      datasets: [
        {
          label: "Мяу-задачи",
          data: taskData.weeklyActivity,
          borderColor: "#ff6b81",
          backgroundColor: "rgba(255, 107, 129, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Уровень мурчания",
          },
        },
      },
    },
  });
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  const statusFilter = document.getElementById("statusFilter").value;

  taskList.innerHTML = "";

  const filtered = taskData.tasks.filter(
    (task) => statusFilter === "all" || task.status === statusFilter
  );

  filtered.forEach((task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add(
      "p-2",
      "border-bottom",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    taskDiv.innerHTML = `
      <div>
        <strong>${task.title}</strong><br>
        <small>${task.project} | До: ${task.due} | Статус: ${task.status}</small>
      </div>
      <button class="btn btn-sm btn-danger" onclick="deleteTask(${index})">Удалить</button>
    `;
    taskList.appendChild(taskDiv);
  });
}

function renderComments() {
  const commentList = document.getElementById("commentList");
  commentList.innerHTML = "";
  taskData.comments.forEach((comment) => {
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment-item");
    commentDiv.innerHTML = `<strong>${comment.user}</strong><br><small>${comment.text}</small>`;
    commentList.appendChild(commentDiv);
  });
}

function addTask() {
  const title = document.getElementById("newTaskTitle").value;
  const project = document.getElementById("newTaskProject").value;
  const due = document.getElementById("newTaskDue").value;

  if (!title || !project || !due) {
    alert("Пожалуйста, заполни все поля, мяу!");
    return;
  }

  taskData.tasks.push({
    title,
    project,
    due,
    status: "Ожидает",
  });

  renderTasks();

  // Очистка полей
  document.getElementById("newTaskTitle").value = "";
  document.getElementById("newTaskProject").value = "";
  document.getElementById("newTaskDue").value = "";
}

function deleteTask(index) {
  const statusFilter = document.getElementById("statusFilter").value;
  const filteredTasks = taskData.tasks.filter(
    (task) => statusFilter === "all" || task.status === statusFilter
  );
  const taskToDelete = filteredTasks[index];

  const originalIndex = taskData.tasks.findIndex(
    (t) =>
      t.title === taskToDelete.title &&
      t.project === taskToDelete.project &&
      t.due === taskToDelete.due
  );

  taskData.tasks.splice(originalIndex, 1);
  renderTasks();
}

window.onload = loadData;
