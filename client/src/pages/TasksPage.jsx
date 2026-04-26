import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config";

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activePriority, setActivePriority] = useState("all");
  const { user } = useAuth();

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeFilter !== "all") params.status = activeFilter;
      if (activePriority !== "all") params.priority = activePriority;
      const [tasksRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/tasks`, { ...config, params }),
        axios.get(`${API_BASE_URL}/api/tasks/stats`, config),
      ]);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [activeFilter, activePriority]);

  const handleCreate = async (taskData) => {
    try {
      setCreating(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/tasks`,
        taskData,
        config,
      );
      setTasks([res.data, ...tasks]);
      fetchTasks();
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (id, data) => {
    const res = await axios.put(
      `${API_BASE_URL}/api/tasks/${id}`,
      data,
      config,
    );
    setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE_URL}/api/tasks/${id}`, config);
    setTasks(tasks.filter((t) => t._id !== id));
    fetchTasks();
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="app-layout">
      <Sidebar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        activePriority={activePriority}
        setActivePriority={setActivePriority}
      />
      <div className="main-content">
        <div className="top-bar">
          <div>
            <h1 className="page-title">My Tasks</h1>
            <p className="page-subtitle">Manage and track your tasks</p>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Tasks</p>
            <p className="stat-value purple">{stats.total || 0}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Pending</p>
            <p className="stat-value amber">{stats.pending || 0}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Completed</p>
            <p className="stat-value green">{stats.completed || 0}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">High Priority</p>
            <p className="stat-value red">{stats.high || 0}</p>
          </div>
        </div>
        <TaskForm onTaskCreated={handleCreate} creating={creating} />
        <div className="search-wrapper">
          <input
            className="search-input"
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <p className="results-count">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        </div>
        {loading ? (
          <div className="loading-wrap">
            <div className="spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : (
          <div className="tasks-list">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <p>No tasks found</p>
                <span>Add a new task or change your filters</span>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TasksPage;
