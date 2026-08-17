function Dashboard({ tasks }) {
    const total = tasks.length;

    const completed = tasks.filter(
        (task) => task.completed
    ).length;

    const pending = total - completed;

    return (
        <section className="dashboard">

            <div className="stat-card">
                <h3>Total Tasks</h3>
                <strong>{total}</strong>
            </div>

            <div className="stat-card">
                <h3>Pending</h3>
                <strong>{pending}</strong>
            </div>

            <div className="stat-card">
                <h3>Completed</h3>
                <strong>{completed}</strong>
            </div>

        </section>
    );
}

export default Dashboard;