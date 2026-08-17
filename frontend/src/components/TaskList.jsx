import TaskCard from "./TaskCard";

function TaskList({
    tasks,
    search,
    setSearch,
    filter,
    setFilter,
    onToggle,
    onDelete,
    onEdit
}) {
    // Make sure search is always treated as a string
    const searchValue = search || "";

    return (
        <section className="tasks">

            {/* =========================================
                TASKS HEADER
            ========================================= */}
            <div className="tasks-header">
                <h2>
                    Tasks ({tasks.length})
                </h2>
            </div>


            {/* =========================================
                SEARCH AND FILTER CONTROLS
            ========================================= */}
            <div className="task-controls">

                {/* Search Box */}
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchValue}
                    onChange={(event) => {
                        setSearch(event.target.value);
                    }}
                    aria-label="Search tasks"
                />


                {/* Filter Buttons */}
                <div className="filters">

                    {/* All */}
                    <button
                        type="button"
                        className={
                            filter === "all"
                                ? "active"
                                : ""
                        }
                        onClick={() => {
                            setFilter("all");
                        }}
                        aria-pressed={filter === "all"}
                    >
                        All
                    </button>


                    {/* Pending */}
                    <button
                        type="button"
                        className={
                            filter === "pending"
                                ? "active"
                                : ""
                        }
                        onClick={() => {
                            setFilter("pending");
                        }}
                        aria-pressed={filter === "pending"}
                    >
                        Pending
                    </button>


                    {/* Completed */}
                    <button
                        type="button"
                        className={
                            filter === "completed"
                                ? "active"
                                : ""
                        }
                        onClick={() => {
                            setFilter("completed");
                        }}
                        aria-pressed={filter === "completed"}
                    >
                        Completed
                    </button>

                </div>

            </div>


            {/* =========================================
                TASK RESULTS
            ========================================= */}

            {tasks.length === 0 ? (

                <p className="no-tasks">

                    {searchValue.trim()
                        ? `No tasks found for "${searchValue}".`

                        : filter === "pending"
                            ? "No pending tasks."

                            : filter === "completed"
                                ? "No completed tasks."

                                : "No tasks available."
                    }

                </p>

            ) : (

                <div className="task-list">

                    {tasks.map((task) => (

                        <TaskCard
                            key={task.id}
                            task={task}
                            onToggle={onToggle}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />

                    ))}

                </div>

            )}

        </section>
    );
}

export default TaskList;