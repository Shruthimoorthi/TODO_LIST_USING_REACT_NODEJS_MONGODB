import React, { useState } from "react";
import {jwtDecode} from "jwt-decode";
const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded = jwtDecode(token);
  return decoded.id || decoded._id;
};
function TaskItem({ task, onDelete, onStatusChange }) {
  const token = localStorage.getItem("token");
  const currentUserId = getUserIdFromToken();
  const isOwner = currentUserId === task.owner;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedPriority, setEditedPriority] = useState(task.priority);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate?.slice(0, 10) || "");

  const handleDelete = async () => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/${task._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    onDelete(task._id);
  };
  const handleStatusToggle = async () => {
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
    onStatusChange(updatedTask);
  };

  const handleSave = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/${task._id}cd`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: editedTitle,
        priority: editedPriority,
        dueDate: editedDueDate,
      }),
    });

    const updatedTask = await res.json();
    onStatusChange(updatedTask);
    setIsEditing(false);
  };

  return (
    <li
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#f0f0f0",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "6px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {isEditing && isOwner ? (
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            style={{ fontSize: "16px", flex: 1 }}
          />
        ) : (
          <strong style={{ fontSize: "18px" }}>{task.title}</strong>
        )}

        <div style={{ display: "flex", gap: "0.5rem" }}>
          {isOwner && (
            <>
              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                {isEditing ? "💾" : "✏️"}
              </button>
              <button
                onClick={handleDelete}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                ❌
              </button>
            </>
          )}
        </div>
      </div>

      {!isOwner && (
        <div style={{ fontSize: "12px", color: "blue", marginTop: 4 }}>
          🔄 Shared with you
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: "14px", color: "#555" }}>
        ⏳ Status: <strong>{task.status}</strong>
      </div>

      {isEditing && isOwner ? (
        <>
          <div style={{ marginTop: 8 }}>
            <label>🔥 Priority:</label>{" "}
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div style={{ marginTop: 8 }}>
            <label>📅 Due Date:</label>{" "}
            <input
              type="date"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
            />
          </div>

          <button
            onClick={handleSave}
            style={{
              marginTop: 10,
              padding: "6px 12px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              width: "fit-content",
            }}
          >
            Save
          </button>
        </>
      ) : (
        <>
          <div style={{ fontSize: "14px", color: "#555", marginTop: 8 }}>
            🔥 Priority: <strong>{task.priority}</strong>
          </div>
          {task.dueDate && (
            <div style={{ fontSize: "14px", color: "#555", marginTop: 5 }}>
              📅 Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </>
      )}

      <button
        onClick={handleStatusToggle}
        style={{
          marginTop: 10,
          padding: "6px 12px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          width: "fit-content",
        }}
      >
        Toggle Status
      </button>

      {isOwner && (
        <button
          onClick={() => {
            const email = prompt("Enter email to share with:");
            if (!email) return;

            fetch(`http://localhost:5000/api/tasks/share/${task._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ email }),
            })
              .then((res) => res.json())
              .then((data) => {
                alert(data.message || "Task shared.");
              })
              .catch((err) => {
                console.error("❌ Share Error:", err);
                alert("Failed to share task.");
              });
          }}
          style={{
            marginTop: 10,
            padding: "6px 12px",
            backgroundColor: "#6c63ff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            width: "fit-content",
          }}
        >
          Share
        </button>
      )}
    </li>
  );
}

export default TaskItem;
