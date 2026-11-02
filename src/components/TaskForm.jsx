import { useState, useEffect } from "react";

function TaskForm({ addTask, editingTask, updateTask, cancelEdit }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setSubject(editingTask.subject);
      setDescription(editingTask.description);
      setDeadline(editingTask.deadline);
      setPriority(editingTask.priority);
    } else {
      clearForm();
    }
  }, [editingTask]);

  function clearForm() {
    setTitle("");
    setSubject("");
    setDescription("");
    setDeadline("");
    setPriority("Medium");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const task = {
      title,
      subject,
      description,
      deadline,
      priority
    };

    if (editingTask) {
      updateTask(editingTask.id, task);
    } else {
      addTask(task);
    }

    clearForm();
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{editingTask ? "Edit Task" : "Add New Task"}</h2>

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />

      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>Deadline</label>

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <label>Priority</label>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <button type="submit">
        {editingTask ? "Update Task" : "Add Task"}
      </button>

      {editingTask && (
        <button type="button" onClick={cancelEdit}>
          Cancel Edit
        </button>
      )}
    </form>
  );
}

export default TaskForm;