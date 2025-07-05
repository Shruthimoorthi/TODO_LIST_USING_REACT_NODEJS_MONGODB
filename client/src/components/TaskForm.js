import React, { useState } from "react";
function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title,priority,dueDate }),
    });
    const data = await res.json();
    onCreate(data);
    setTitle("");
    setPriority("medium");
    setDueDate("");
  };
  return (
   <form onSubmit={handleSubmit}>
  <input
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="New task title"
    required
  />
  <label style={{ marginLeft: "10px" }}>
    Priority:
    <select
      value={priority}
      onChange={(e) => setPriority(e.target.value)}
      style={{ marginLeft: "5px" }}
    >
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
  </label>
  <label>Due Date:</label>
  <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={{ marginRight: "8px" }}
      />
  <button type="submit" style={{ marginLeft: "10px" }}>Add</button>
</form>

  );
}
export default TaskForm;
