import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");

  // ✅ Fetch all tasks from Flask backend
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/todos");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // ✅ Load tasks on page load
  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Add Task (POST)
  const addTask = async () => {
    if (!newTask.trim()) return;
    const task = {
      text: newTask,
      completed: false,
      dueDate,
      priority,
    };
    await fetch("http://127.0.0.1:5000/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    setNewTask("");
    setDueDate("");
    setPriority("Low");
    fetchTasks(); // refresh list
  };

  // ✅ Update Task (PUT)
  const updateTask = async (id, newText) => {
    const taskToUpdate = tasks.find((t) => t.id === id);
    await fetch(`http://127.0.0.1:5000/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...taskToUpdate,
        text: newText,
      }),
    });
    setEditId(null);
    fetchTasks();
  };

  // ✅ Delete Task (DELETE)
  const deleteTask = async (id) => {
    await fetch(`http://127.0.0.1:5000/api/todos/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  // ✅ Toggle Complete (PUT)
  const toggleComplete = async (id) => {
    const taskToToggle = tasks.find((t) => t.id === id);
    await fetch(`http://127.0.0.1:5000/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...taskToToggle,
        completed: !taskToToggle.completed,
      }),
    });
    fetchTasks();
  };

  // ✅ Filter + Search + Sort
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "Active") return !task.completed;
      if (filter === "Completed") return task.completed;
      return true;
    })
    .filter((task) => task.text.toLowerCase().includes(search.toLowerCase()));

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    if (a.priority === b.priority) {
      return new Date(a.due_date) - new Date(b.due_date);
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="app">
      <h1>📝 React + Flask Todo App</h1>

      {/* Add Task Section */}
      <div className="add-task">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button onClick={addTask}>Add</button>
      </div>

      {/* Search & Filter */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Active</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Task List */}
      <ul>
        {sortedTasks.map((task) => (
          <li key={task.id} className={`task ${task.completed ? "completed" : ""}`}>
            {editId === task.id ? (
              <input
                type="text"
                defaultValue={task.text}
                onBlur={(e) => updateTask(task.id, e.target.value)}
                autoFocus
              />
            ) : (
              <span onClick={() => toggleComplete(task.id)}>
                {task.text} <small>({task.priority})</small>
              </span>
            )}
            <div className="actions">
              <button onClick={() => setEditId(task.id)}>✏️</button>
              <button onClick={() => deleteTask(task.id)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

