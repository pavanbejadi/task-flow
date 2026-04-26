import { useState } from "react";

function TaskCard({ task, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? task.dueDate.split("T")[0] : "",
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status === "pending";

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null;

  const handleToggle = async () => {
    await onUpdate(task._id, {
      status: task.status === "pending" ? "completed" : "pending",
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdate(task._id, { title, description, priority, dueDate });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onDelete(task._id);
    } finally {
      setDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="task-card editing">
        <input
          className="edit-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />
        <input
          className="edit-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <div className="edit-row">
          <select
            className="edit-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <input
            type="date"
            className="edit-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="edit-actions">
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button className="cancel-btn" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`task-card ${task.status === "completed" ? "completed" : ""}`}
    >
      <div className="task-left">
        <button
          className={`check-btn ${task.status === "completed" ? "done" : ""}`}
          onClick={handleToggle}
        >
          {task.status === "completed" ? "✓" : ""}
        </button>
        <div className={`priority-dot ${task.priority}`}></div>
      </div>
      <div className="task-info">
        <p
          className={`task-title ${task.status === "completed" ? "done" : ""}`}
        >
          {task.title}
        </p>
        {task.description && <p className="task-desc">{task.description}</p>}
        <div className="task-meta">
          {task.dueDate && (
            <span className={isOverdue ? "overdue" : "due-date"}>
              {isOverdue ? "⚠ Overdue · " : "Due: "}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
      <div className="task-right">
        <span className={`priority-badge ${task.priority}`}>
          {task.priority}
        </span>
        <div className="task-actions">
          <button
            className="action-btn edit"
            onClick={() => setIsEditing(true)}
            disabled={deleting}
          >
            ✏
          </button>
          <button
            className="action-btn delete"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "..." : "✕"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
