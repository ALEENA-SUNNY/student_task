
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ClipboardList
} from "lucide-react";
import "./App.css";

const API_URL = "https://student-taskserver.onrender.com";

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isOverdue(task) {
  return (
    !task.completed &&
    task.deadline &&
    task.deadline < getToday()
  );
}

const emptyForm = {
  title: "",
  subject: "",
  description: "",
  deadline: ""
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function getTasks() {
    try {
      setError("");
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      setError(
        "Cannot connect to the server. Make sure JSON Server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTasks();
  }, []);

  
  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const overdueCount = tasks.filter(isOverdue).length;

  const pendingCount = tasks.filter(
    (task) => !task.completed
  ).length;

  const subjects = [
    ...new Set(
      tasks.map((task) => task.subject).filter(Boolean)
    )
  ];

  
  const filteredTasks = tasks.filter((task) => {
    const searchText = search.toLowerCase();

    const matchesSearch = [
      task.title,
      task.subject,
      task.description
    ].some((value) =>
      (value || "").toLowerCase().includes(searchText)
    );

    let matchesFilter = true;

    if (activeFilter === "Completed") {
      matchesFilter = task.completed;
    } else if (activeFilter === "Pending") {
      matchesFilter = !task.completed;
    } else if (activeFilter === "Overdue") {
      matchesFilter = isOverdue(task);
    }

    return matchesSearch && matchesFilter;
  });


  function openAddForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(task) {
    setForm({
      title: task.title || "",
      subject: task.subject || "",
      description: task.description || "",
      deadline: task.deadline || ""
    });

    setEditingId(task.id);
    setShowForm(true);
  }
  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }


  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.subject.trim()) {
      setError("Please enter an assignment title and subject.");
      return;
    }

    try {
      setError("");

      if (editingId !== null) {
        const oldTask = tasks.find(
          (task) => String(task.id) === String(editingId)
        );

        await axios.put(`${API_URL}/${editingId}`, {
          ...form,
          title: form.title.trim(),
          subject: form.subject.trim(),
          completed: oldTask?.completed ?? false
        });
      } else {
        await axios.post(API_URL, {
          ...form,
          title: form.title.trim(),
          subject: form.subject.trim(),
          completed: false
        });
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await getTasks();
    } catch (error) {
      setError("Could not save the assignment. Please try again.");
    }
  }

  
  async function toggleTask(task) {
    try {
      setError("");

      await axios.patch(`${API_URL}/${task.id}`, {
        completed: !task.completed
      });

      await getTasks();
    } catch (error) {
      setError("Could not update the assignment.");
    }
  }

 
  async function deleteTask(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) {
      return;
    }

    try {
      setError("");

      await axios.delete(`${API_URL}/${task.id}`);
      await getTasks();
    } catch (error) {
      setError("Could not delete the assignment.");
    }
  }

  
  function clearSearch() {
    setSearch("");
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <BookOpen size={24} />
          </div>

          <div>
            <h2>Tasks</h2>
            <p>Student workspace</p>
          </div>
        </div>

        <p className="side-heading">WORKSPACE</p>

        {[
          {
            name: "All",
            label: "All assignments",
            icon: ClipboardList,
            count: tasks.length
          },
          {
            name: "Completed",
            label: "Completed works",
            icon: CheckCircle2,
            count: completedCount
          },
          {
            name: "Pending",
            label: "Pending works",
            icon: Clock3,
            count: pendingCount
          },
          {
            name: "Overdue",
            label: "Overdue works",
            icon: AlertCircle,
            count: overdueCount
          }
        ].map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`side-link ${
                activeFilter === item.name ? "selected" : ""
              }`}
              onClick={() => setActiveFilter(item.name)}
            >
              <Icon size={19} />
              <span>{item.label}</span>
              <span className="side-count">{item.count}</span>
            </button>
          );
        })}

        <div className="sidebar-bottom">
          <div className="mini-icon">
            <BookOpen size={19} />
          </div>
          <p>Small steps every day lead to big results.</p>
        </div>
      </aside>

     
      <main className="main-content">
        <header className="topbar">
          <div>
           
            <h1>My Assignments</h1>
          </div>

          <button className="add-button" onClick={openAddForm}>
            <Plus size={19} />
            Add assignment
          </button>
        </header>

        <section className="welcome-banner">
          <div>
            <span className="welcome-tag">YOUR STUDY SPACE</span>
            <h2>Stay focused.</h2>
            <p>
              All your subjects and assignments, organized in one place.
            </p>
          </div>

          <div className="banner-art">
            <ClipboardList size={55} strokeWidth={1.4} />
          </div>
        </section>

      
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">
              <ClipboardList size={22} />
            </div>
            <div>
              <p>Total assignments</p>
              <h2>{tasks.length}</h2>
              <span>Across all subjects</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p>Completed works</p>
              <h2>{completedCount}</h2>
              <span>Great progress!</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Clock3 size={22} />
            </div>
            <div>
              <p>Pending works</p>
              <h2>{pendingCount}</h2>
              <span>Still to be completed</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">
              <AlertCircle size={22} />
            </div>
            <div>
              <p>Overdue works</p>
              <h2>{overdueCount}</h2>
              <span>Past their deadlines</span>
            </div>
          </div>
        </section>

        
        <section className="subject-section">
          <div className="section-heading">
            <div>
              <h2>Your subjects</h2>
              <p>Assignments grouped by the subjects you study</p>
            </div>
          </div>

          {subjects.length === 0 ? (
            <p className="muted">
              Your subjects will appear here when you add assignments.
            </p>
          ) : (
            <div className="subject-chips">
              <button
                className="subject-chip all-chip"
                onClick={() => {
                  setActiveFilter("All");
                  clearSearch();
                }}
              >
                <BookOpen size={16} />
                All subjects
                <span>{tasks.length}</span>
              </button>

              {subjects.map((subject) => (
                <button
                  key={subject}
                  className="subject-chip"
                  onClick={() => {
                    setActiveFilter("All");
                    setSearch(subject);
                  }}
                >
                  <BookOpen size={16} />
                  {subject}
                  <span>
                    {
                      tasks.filter(
                        (task) => task.subject === subject
                      ).length
                    }
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="assignments-section">
          <div className="section-heading assignment-heading">
            <div>
              <h2>
                {activeFilter === "All"
                  ? "All assignments"
                  : `${activeFilter} works`}
              </h2>
              <p>{filteredTasks.length} assignment(s) found</p>
            </div>

            <div className="search-input">
              <Search size={18} />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search assignments..."
              />

              {search && (
                <button
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          <div className="filter-tabs">
            {["All", "Pending", "Completed", "Overdue"].map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={
                    activeFilter === filter
                      ? "tab active-tab"
                      : "tab"
                  }
                >
                  {filter}
                </button>
              )
            )}
          </div>

          {error && <div className="error-box">{error}</div>}

          {loading ? (
            <div className="empty-state">
              Loading your assignments...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <ClipboardList size={42} />
              <h3>No assignments found</h3>
              <p>Try another filter or add a new assignment.</p>

              <button className="add-button" onClick={openAddForm}>
                <Plus size={17} />
                Add assignment
              </button>
            </div>
          ) : (
            <div className="assignment-grid">
              {filteredTasks.map((task) => (
                <article className="assignment-card" key={task.id}>
                  <div className="assignment-card-top">
                    <div className="subject-icon">
                      <BookOpen size={20} />
                    </div>
                  </div>

                  <p className="assignment-subject">{task.subject}</p>

                  <h3 className={task.completed ? "task-done" : ""}>
                    {task.title}
                  </h3>

                  <p className="assignment-description">
                    {task.description || "No description added."}
                  </p>

                  <div className="assignment-deadline">
                    <Clock3 size={16} />
                    <span>{task.deadline || "No deadline"}</span>

                    {isOverdue(task) && (
                      <span className="overdue-label">Overdue</span>
                    )}
                  </div>

                  <div className="assignment-card-footer">
                    <span
                      className={`status-badge ${
                        task.completed
                          ? "done-status"
                          : isOverdue(task)
                          ? "overdue-status"
                          : "pending-status"
                      }`}
                    >
                      {task.completed
                        ? "Completed"
                        : isOverdue(task)
                        ? "Overdue"
                        : "Pending"}
                    </span>

                    <div className="card-actions">
                      <button
                        onClick={() => toggleTask(task)}
                        title={
                          task.completed
                            ? "Mark pending"
                            : "Mark completed"
                        }
                        aria-label={
                          task.completed
                            ? "Mark pending"
                            : "Mark completed"
                        }
                      >
                        <CheckCircle2 size={17} />
                      </button>

                      <button
                        onClick={() => openEditForm(task)}
                        title="Edit assignment"
                        aria-label="Edit assignment"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        className="delete-action"
                        onClick={() => deleteTask(task)}
                        title="Delete assignment"
                        aria-label="Delete assignment"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="footer">
          
          <span>Plan your work.</span>
        </footer>
      </main>

      
      {showForm && (
        <div
          className="modal-backdrop"
          onClick={() => setShowForm(false)}
        >
          <div
            className="task-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <h2>
                  {editingId !== null
                    ? "Edit assignment"
                    : "New assignment"}
                </h2>
                <p>Fill in the assignment details below.</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="task-form">
              <label htmlFor="title">Assignment title *</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. JavaScript assignment"
                required
              />

              <label htmlFor="subject">Subject *</label>
              <input
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="e.g. JavaScript, React, DBMS"
                required
              />

              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="What do you need to do?"
                rows="3"
              />

              <div className="modal-row">
                <div>
                  <label htmlFor="deadline">Deadline</label>
                  <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={form.deadline}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="add-button submit-button"
              >
                <Plus size={18} />
                {editingId !== null
                  ? "Save changes"
                  : "Create assignment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
