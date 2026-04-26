import { useState } from "react";

function TaskForm({ onTaskCreated, creating }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async () => {
    if (!title) {
      alert("Please enter a title");
      return;
    }
    await onTaskCreated({ title, description, priority, dueDate });
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
  };

  return (
    <div className="task-form">
      <h3 className="form-title">Add new task</h3>
      <div className="form-row">
        <input
          type="text"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={creating}
          className="form-input"
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={creating}
          className="form-input"
        />
      </div>
      <div className="form-row form-row-split">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          disabled={creating}
          className="form-select"
        >
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={creating}
          className="form-input"
        />
        <button className="form-btn" onClick={handleSubmit} disabled={creating}>
          {creating ? "Adding..." : "+ Add Task"}
        </button>
      </div>
    </div>
  );
}

export default TaskForm;
