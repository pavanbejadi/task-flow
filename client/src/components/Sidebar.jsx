import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Sidebar({
  activeFilter,
  setActiveFilter,
  activePriority,
  setActivePriority,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const statusFilters = [
    { label: "All Tasks", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
  ];
  const priorityFilters = [
    { label: "All Priority", value: "all" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        Task<span>Flow</span>
      </div>
      <div className="sidebar-section">
        <p className="sidebar-label">Status</p>
        {statusFilters.map((f) => (
          <div
            key={f.value}
            className={`sidebar-item ${activeFilter === f.value ? "active" : ""}`}
            onClick={() => setActiveFilter(f.value)}
          >
            <div className="sidebar-dot"></div>
            {f.label}
          </div>
        ))}
      </div>
      <div className="sidebar-section">
        <p className="sidebar-label">Priority</p>
        {priorityFilters.map((f) => (
          <div
            key={f.value}
            className={`sidebar-item ${activePriority === f.value ? "active" : ""}`}
            onClick={() => setActivePriority(f.value)}
          >
            <div className={`sidebar-dot ${f.value}`}></div>
            {f.label}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="user-name">{user?.name}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
