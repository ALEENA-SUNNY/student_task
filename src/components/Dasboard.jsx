function Dasboard({ tasks }) {
  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const pending = tasks.filter(
    (task) => !task.completed
  ).length;

  const overdue = tasks.filter(
    (task) =>
      !task.completed &&
      task.deadline &&
      task.deadline < new Date().toISOString().slice(0, 10)
  ).length;

  return (
    <div className="dashboard">
      <div className="stat-card">
        <h3>Total Tasks</h3>
        <h2>{total}</h2>
      </div>

      <div className="stat-card">
        <h3>Pending</h3>
        <h2>{pending}</h2>
      </div>

      <div className="stat-card">
        <h3>Completed</h3>
        <h2>{completed}</h2>
      </div>

      <div className="stat-card">
        <h3>Overdue</h3>
        <h2>{overdue}</h2>
      </div>
    </div>
  );
}

export default Dasboard;