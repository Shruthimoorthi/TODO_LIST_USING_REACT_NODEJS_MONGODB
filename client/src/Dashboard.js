import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showAllAfterAdd, setShowAllAfterAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      window.history.replaceState({}, document.title, "/dashboard"); 
      window.location.reload(); 
    }
  }, []);

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;
  const userName = user?.name || "User";

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    };
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const handleAddTask = async () => {
    if (!title.trim()) return alert("Title is required!");

    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, priority, dueDate }),
    });

    const newTask = await res.json();
    setTasks([newTask, ...tasks]);
    setTitle("");
    setPriority("medium");
    setDueDate("");
    setShowForm(true);
    setShowTasks(false);
    setShowAllAfterAdd(true);
  };

  const toggleStatus = async (task) => {
    const nextStatus =
      task.status === "pending"
        ? "in-progress"
        : task.status === "in-progress"
        ? "completed"
        : "pending";

    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/${task._id}`, {
  method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: nextStatus }),
    });

    const updatedTask = await res.json();
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
  };

  const handleDelete = async (taskId) => {
  await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/${taskId}`, {
method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setTasks(tasks.filter((task) => task._id !== taskId));
  };

  const handleShare = async (taskId) => {
    const email = prompt("Enter email to share with:");
    if (!email) return;
const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/share/${taskId}`, {

method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    alert(data.message || "Task shared.");
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === "all" || task.status === filterStatus;
    const priorityMatch =
      filterPriority === "all" || task.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
  <h2
    style={{
      color: "#fff",
      margin: 0,
      fontFamily: "Cormorant",
      fontStyle: "italic",
      fontWeight: 600,
      fontSize: "36px",
    }}
  >
    👋 Welcome, {userName}
  </h2>

  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
    <button
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }}
      style={{
        backgroundColor: "white",
        color: "purple",
        border: "none",
        padding: "10px 16px",
        borderRadius: "8px",
        fontWeight: "600",
        fontStyle: "italic",
        cursor: "pointer",
        fontSize: "14px",
      }}
    >
      🚪 Logout
    </button>
    <img
      src="https://cdn-icons-png.flaticon.com/512/9758/9758653.png"
      alt="Todo"
      style={{ height: "80px" }}
    />
  </div>
</div>
      <div style={buttonContainerStyle}>
        <button
          onClick={() => {
            setShowForm(true);
            setShowTasks(false);
            setShowAllAfterAdd(false);
          }}
          style={buttonStyle}
        >
          ➕ Add Your Task
        </button>
        <button
          onClick={() => {
            setShowForm(false);
            setShowTasks(true);
          }}
          style={buttonStyle}
        >
          📋 Manage Your Task
        </button>
      </div>
      {showForm && (
        <div style={formStyle}>
          <h3 style={formTitleStyle}>Add New Task</h3>
          <div style={formGroupStyle}>
            <label>Task Name:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label>Priority:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={inputStyle}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div style={formGroupStyle}>
            <label>Due Date:</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button onClick={handleAddTask} style={submitButtonStyle}>
            Add Task
          </button>
        </div>
      )}
      {showForm && showAllAfterAdd && renderTable(tasks, "All Tasks")}
      {showTasks && (
        <div>
          <h3 style={{ color: "#ff5e99" }}>Your Tasks</h3>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={inputStyle}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={inputStyle}
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          {renderTable(filteredTasks, "Filtered Tasks")}
        </div>
      )}
    </div>
  );
  function renderTable(taskList, title) {
    return (
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h3 style={{ color: "purple", textAlign: "center", fontSize: "26px" }}>
          {title}
        </h3>
        <table style={tableStyle}>
          <thead style={{ backgroundColor: "purple", color: "white" }}>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Priority</th>
              <th style={thStyle}>Due Date</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {taskList.map((task) => (
              <tr key={task._id}>
                <td style={tdStyle}>
                  {task.title}{" "}
                  {task.sharedWith && task.sharedWith.length > 0 && (
                    <span style={sharedTagStyle}>Shared</span>
                  )}
                </td>
                <td style={tdStyle}>{task.priority}</td>
                <td style={tdStyle}>
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td style={tdStyle}>{task.status}</td>
                <td style={tdStyle}>
                  <button style={actionBtn} onClick={() => toggleStatus(task)}>
                    🔁 Toggle
                  </button>
                  <button
                    style={actionBtn}
                    onClick={() => handleDelete(task._id)}
                  >
                    🗑️ Delete
                  </button>
                  <button
                    style={actionBtn}
                    onClick={() => handleShare(task._id)}
                  >
                    📤 Share
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

const pageStyle = {
  backgroundColor: "#fff0f5",
  minHeight: "100vh",
  padding: "2rem",
  fontFamily: "'Poppins', sans-serif",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#f78fb3",
  padding: "1.5rem",
  borderRadius: "12px",
  marginBottom: "2rem",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "2rem",
  marginBottom: "2rem",
};

const buttonStyle = {
  padding: "1rem 2rem",
  fontSize: "18px",
  backgroundColor: "purple",
  color: "white",
  border: "none",
  fontStyle: "italic",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
};

const submitButtonStyle = {
  ...buttonStyle,
  fontFamily: "Patua One",
  fontStyle: "italic",
  backgroundColor: "white",
  color: "purple",
};

const formStyle = {
  margin: "0 auto",
  maxWidth: "600px",
  padding: "2rem",
  backgroundColor: "violet",
  borderRadius: "12px",
  boxShadow: "0 0 12px rgba(0,0,0,0.1)",
  marginBottom: "2rem",
  fontStyle: "italic",
};

const formGroupStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "1rem",
  color: "white",
  fontFamily: "Libra Caslon Text",
  fontWeight: "800",
  fontSize: 20,
};

const formTitleStyle = {
  color: "purple",
  fontStyle: "italic",
  fontSize: "20px",
  fontFamily: "Patua One",
  textAlign: "center",
};

const inputStyle = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginTop: "5px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "pink",
  borderRadius: "10px",
  overflow: "hidden",
};

const thStyle = {
  padding: "12px",
  textAlign: "left",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "2px solid white",
};

const actionBtn = {
  fontSize: "16px",
  backgroundColor: "white",
  border: "1px solid purple",
  padding: "8px",
  marginRight: "6px",
  borderRadius: "8px",
  cursor: "pointer",
};

const sharedTagStyle = {
  backgroundColor: "white",
  color: "purple",
  padding: "2px 8px",
  marginLeft: "10px",
  fontSize: "12px",
  borderRadius: "5px",
  fontStyle: "italic",
};

export default Dashboard;
