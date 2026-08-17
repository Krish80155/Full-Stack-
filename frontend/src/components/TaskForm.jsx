function TaskForm({
    title,
    description,
    setTitle,
    setDescription,
    onSubmit
}) {
    return (
        <section className="task-form">

            <h2>Add New Task</h2>

            <form onSubmit={onSubmit}>

                <input
                    type="text"
                    placeholder="Task title"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                />

                <textarea
                    placeholder="Task description"
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                />

                <button type="submit">
                    Add Task
                </button>

            </form>

        </section>
    );
}

export default TaskForm;