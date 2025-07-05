import React from "react";
import TaskItem from "./TaskItem";

function TaskList({ tasks, onDelete, onStatusChange }) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return <p>⚠️ No tasks to show.</p>;
  }
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {tasks
        .filter((task) => task && task._id) 
        .map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
    </ul>
  );
}
export default TaskList;
