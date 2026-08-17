import { useEffect, useState } from "react";

import Dashboard from "./components/Dashboard";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

import {
    getTasks,
    createTask,
    updateTask,
    deleteTask
} from "./services/api";

import "./App.css";


function App() {

    // ==========================================
    // TASKS
    // ==========================================

    const [tasks, setTasks] = useState([]);


    // ==========================================
    // SEARCH AND FILTER
    // ==========================================

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");


    // ==========================================
    // NEW TASK FORM
    // ==========================================

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");


    // ==========================================
    // EDIT TASK
    // ==========================================

    const [editingTask, setEditingTask] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");


    // ==========================================
    // APPLICATION STATE
    // ==========================================

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // LOAD ALL TASKS
    // ==========================================

    const loadTasks = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getTasks();

            if (data.success) {

                setTasks(data.tasks || []);

            } else {

                setError("Failed to load tasks.");

            }

        } catch (error) {

            console.error("Load tasks error:", error);

            setError(
                "Unable to connect to the backend."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // LOAD TASKS WHEN APPLICATION STARTS
    // ==========================================

    useEffect(() => {

        loadTasks();

    }, []);


    // ==========================================
    // ADD NEW TASK
    // ==========================================

    const handleAddTask = async (event) => {

        event.preventDefault();

        if (!title.trim()) {

            setError("Task title is required.");

            return;
        }

        try {

            setError("");

            const data = await createTask({
                title: title.trim(),
                description: description.trim()
            });

            if (data.success) {

                setTasks((currentTasks) => [
                    ...currentTasks,
                    data.task
                ]);

                // Clear form
                setTitle("");
                setDescription("");

            } else {

                setError("Failed to create task.");

            }

        } catch (error) {

            console.error(
                "Create task error:",
                error
            );

            setError("Failed to create task.");

        }
    };


    // ==========================================
    // COMPLETE / UNDO TASK
    // ==========================================

    const handleToggleTask = async (task) => {

        try {

            setError("");

            const data = await updateTask(
                task.id,
                {
                    completed: !task.completed
                }
            );

            if (data.success) {

                setTasks((currentTasks) =>
                    currentTasks.map((item) =>
                        item.id === task.id
                            ? data.task
                            : item
                    )
                );

            } else {

                setError(
                    "Failed to update task."
                );

            }

        } catch (error) {

            console.error(
                "Toggle task error:",
                error
            );

            setError(
                "Failed to update task."
            );

        }
    };


    // ==========================================
    // START EDITING TASK
    // ==========================================

    const handleEditTask = (task) => {

        setError("");

        setEditingTask(task);

        setEditTitle(
            task.title || ""
        );

        setEditDescription(
            task.description || ""
        );

        // Scroll to top so edit form is visible
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // ==========================================
    // CANCEL EDITING
    // ==========================================

    const handleCancelEdit = () => {

        setEditingTask(null);

        setEditTitle("");
        setEditDescription("");

        setError("");
    };


    // ==========================================
    // SAVE EDITED TASK
    // ==========================================

    const handleSaveEdit = async (event) => {

        event.preventDefault();

        if (!editingTask) {
            return;
        }

        if (!editTitle.trim()) {

            setError(
                "Task title is required."
            );

            return;
        }

        try {

            setError("");

            const data = await updateTask(
                editingTask.id,
                {
                    title: editTitle.trim(),
                    description: editDescription.trim()
                }
            );

            if (data.success) {

                setTasks((currentTasks) =>
                    currentTasks.map((item) =>
                        item.id === editingTask.id
                            ? data.task
                            : item
                    )
                );

                // Close edit form
                setEditingTask(null);

                setEditTitle("");
                setEditDescription("");

            } else {

                setError(
                    "Failed to edit task."
                );

            }

        } catch (error) {

            console.error(
                "Edit task error:",
                error
            );

            setError(
                "Failed to edit task."
            );

        }
    };


    // ==========================================
    // DELETE TASK
    // ==========================================

    const handleDeleteTask = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            const data = await deleteTask(id);

            if (data.success) {

                setTasks((currentTasks) =>
                    currentTasks.filter(
                        (task) => task.id !== id
                    )
                );

                // If currently editing this task,
                // close the edit form.
                if (
                    editingTask &&
                    editingTask.id === id
                ) {

                    setEditingTask(null);

                    setEditTitle("");
                    setEditDescription("");
                }

            } else {

                setError(
                    "Failed to delete task."
                );

            }

        } catch (error) {

            console.error(
                "Delete task error:",
                error
            );

            setError(
                "Failed to delete task."
            );

        }
    };


    // ==========================================
    // SEARCH + FILTER
    // ==========================================

    const filteredTasks = tasks.filter((task) => {

        const searchText =
            (search || "").toLowerCase().trim();

        const taskTitle =
            (task.title || "").toLowerCase();

        const taskDescription =
            (task.description || "").toLowerCase();

        const matchesSearch =
            taskTitle.includes(searchText) ||
            taskDescription.includes(searchText);

        const matchesFilter =
            filter === "all" ||
            (
                filter === "pending" &&
                !task.completed
            ) ||
            (
                filter === "completed" &&
                task.completed
            );

        return (
            matchesSearch &&
            matchesFilter
        );
    });


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="app">

            {/* ==================================
                HEADER
            ================================== */}

            <header className="header">

                <h1>
                    WSL Task Manager
                </h1>

                <p>
                    React + Express + PostgreSQL
                    running inside WSL
                </p>

            </header>


            {/* ==================================
                MAIN CONTENT
            ================================== */}

            <main>

                {/* ==================================
                    ERROR MESSAGE
                ================================== */}

                {error && (

                    <div className="error">
                        ⚠️ {error}
                    </div>

                )}


                {/* ==================================
                    DASHBOARD
                ================================== */}

                <Dashboard
                    tasks={tasks}
                />


                {/* ==================================
                    EDIT TASK FORM
                ================================== */}

                {editingTask && (

                    <section className="edit-form">

                        <h2>
                            Edit Task
                        </h2>

                        <form
                            onSubmit={handleSaveEdit}
                        >

                            {/* Task Title */}

                            <input
                                type="text"
                                placeholder="Task title"
                                value={editTitle}
                                onChange={(event) =>
                                    setEditTitle(
                                        event.target.value
                                    )
                                }
                                autoFocus
                            />


                            {/* Task Description */}

                            <textarea
                                placeholder="Task description"
                                value={editDescription}
                                onChange={(event) =>
                                    setEditDescription(
                                        event.target.value
                                    )
                                }
                            />


                            {/* Edit Buttons */}

                            <div className="edit-actions">

                                <button
                                    type="submit"
                                    className="save-button"
                                >
                                    Save Changes
                                </button>

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={
                                        handleCancelEdit
                                    }
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </section>

                )}


                {/* ==================================
                    ADD TASK FORM
                ================================== */}

                <TaskForm
                    title={title}
                    description={description}
                    setTitle={setTitle}
                    setDescription={setDescription}
                    onSubmit={handleAddTask}
                />


                {/* ==================================
                    TASK LIST
                ================================== */}

                {loading ? (

                    <section className="tasks">

                        <h2>
                            Tasks
                        </h2>

                        <p>
                            Loading tasks...
                        </p>

                    </section>

                ) : (

                    <TaskList
                        tasks={filteredTasks}
                        search={search}
                        setSearch={setSearch}
                        filter={filter}
                        setFilter={setFilter}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                    />

                )}

            </main>

        </div>
    );
}


export default App;