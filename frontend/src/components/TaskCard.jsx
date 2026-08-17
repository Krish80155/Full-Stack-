function TaskCard({
    task,
    onToggle,
    onDelete,
    onEdit
}) {
    const handleDelete = () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${task.title}"?`
        );

        if (confirmed) {
            onDelete(task.id);
        }
    };

    return (
        <article
            className={`task ${
                task.completed ? "completed" : ""
            }`}
        >
            {/* ==============================
                TASK INFORMATION
            ============================== */}
            <div className="task-content">

                <h3>{task.title}</h3>

                {task.description && (
                    <p>{task.description}</p>
                )}

                <small>
                    ID: {task.id}
                </small>

                <p className="task-status">
                    Status:{" "}
                    {task.completed
                        ? "Completed"
                        : "Pending"}
                </p>

            </div>

            {/* ==============================
                TASK ACTIONS
            ============================== */}
            <div className="actions">

                {/* Complete / Undo */}
                <button
                    type="button"
                    className="complete-button"
                    onClick={() => onToggle(task)}
                    aria-label={
                        task.completed
                            ? `Undo task ${task.title}`
                            : `Complete task ${task.title}`
                    }
                >
                    {task.completed
                        ? "Undo"
                        : "Complete"}
                </button>

                {/* Edit */}
                <button
                    type="button"
                    className="edit-button"
                    onClick={() => {
                        if (onEdit) {
                            onEdit(task);
                        }
                    }}
                    aria-label={`Edit task ${task.title}`}
                >
                    Edit
                </button>

                {/* Delete */}
                <button
                    type="button"
                    className="delete-button"
                    onClick={handleDelete}
                    aria-label={`Delete task ${task.title}`}
                >
                    Delete
                </button>

            </div>
        </article>
    );
}

export default TaskCard;