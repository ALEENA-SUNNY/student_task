import {
  Pencil,
  Trash2,
  CheckCircle,
  Circle
} from "lucide-react";

function TaskList({
  tasks,
  deleteTask,
  editTask,
  toggleComplete,
  search,
  setSearch,
  filter,
  setFilter
}) {
  const today = new Date().toISOString().slice(0, 10);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.subject.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Pending" && !task.completed) ||
      (filter === "Completed" && task.completed) ||
      (filter === "Overdue" &&
        !task.completed &&
        task.deadline &&
        task.deadline < today);

    return matchesSearch && matchesFilter;
  });

  function downloadTasks() {
    const header = [
      "Title",
      "Subject",
      "Description",
      "Deadline",
      "Priority",
      "Status"
    ];

    const rows = tasks.map((task) => [
      task.title,
      task.subject,
      task.description,
      task.deadline,
      task.priority,
      task.completed ? "Completed" : "Pending"
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [header, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "student-tasks.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="task-list">
      <div className="task-controls">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Tasks</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>

        <button onClick={downloadTasks}>
          Download CSV
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="empty-message">No tasks found.</p>
      ) : (
        filteredTasks.map((task) => (
          <div className="task-card" key={task.id}>
            <div className="task-info">
              <h3 className={task.completed ? "completed" : ""}>
                {task.title}
              </h3>

              <p>Subject: {task.subject}</p>
              <p>{task.description}</p>
              <p>Deadline: {task.deadline || "Not set"}</p>
              <p>Priority: {task.priority}</p>

              {!task.completed &&
                task.deadline &&
                task.deadline < today && (
                  <p className="overdue-message">
                    ⚠ This task is overdue!
                  </p>
                )}
            </div>

            <div className="task-actions">
              <button
                onClick={() => toggleComplete(task.id)}
                title="Toggle completion"
              >
                {task.completed ? (
                  <CheckCircle />
                ) : (
                  <Circle />
                )}
              </button>

              <button
                onClick={() => editTask(task)}
                title="Edit task"
              >
                <Pencil />
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                title="Delete task"
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;