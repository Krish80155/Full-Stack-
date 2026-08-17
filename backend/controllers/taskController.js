const pool = require("../config/db");

// ======================================================
// HELPER — Validate Task ID
// ======================================================
const validateTaskId = (id) => {
    return /^\d+$/.test(id);
};


// ======================================================
// GET ALL TASKS
// Supports:
//   ?sort=newest
//   ?sort=oldest
//   ?sort=priority
//   ?sort=dueDate
// ======================================================
const getTasks = async (req, res) => {
    try {
        const { sort = "newest" } = req.query;

        let orderBy = "id DESC";

        switch (sort) {
            case "oldest":
                orderBy = "id ASC";
                break;

            case "priority":
                orderBy = `
                    CASE priority
                        WHEN 'high' THEN 1
                        WHEN 'medium' THEN 2
                        WHEN 'low' THEN 3
                        ELSE 4
                    END ASC,
                    id DESC
                `;
                break;

            case "dueDate":
                orderBy = `
                    CASE
                        WHEN due_date IS NULL THEN 1
                        ELSE 0
                    END ASC,
                    due_date ASC,
                    id DESC
                `;
                break;

            case "newest":
            default:
                orderBy = "id DESC";
                break;
        }

        const result = await pool.query(
            `SELECT
                id,
                title,
                description,
                completed,
                priority,
                due_date,
                created_at,
                updated_at
             FROM tasks
             ORDER BY ${orderBy}`
        );

        res.json({
            success: true,
            count: result.rows.length,
            tasks: result.rows
        });

    } catch (error) {
        console.error(
            "Error fetching tasks:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch tasks"
        });
    }
};


// ======================================================
// GET ONE TASK
// ======================================================
const getTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!validateTaskId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID"
            });
        }

        const result = await pool.query(
            `SELECT
                id,
                title,
                description,
                completed,
                priority,
                due_date,
                created_at,
                updated_at
             FROM tasks
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.json({
            success: true,
            task: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Error fetching task:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch task"
        });
    }
};


// ======================================================
// CREATE TASK
// ======================================================
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority = "medium",
            due_date = null
        } = req.body;

        // ----------------------------------------------
        // Basic validation
        // ----------------------------------------------

        if (
            typeof title !== "string" ||
            !title.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Task title is required"
            });
        }

        if (title.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message:
                    "Task title cannot exceed 100 characters"
            });
        }

        if (
            description !== undefined &&
            description !== null &&
            typeof description !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Description must be a string"
            });
        }

        // ----------------------------------------------
        // Priority validation
        // ----------------------------------------------

        const allowedPriorities = [
            "low",
            "medium",
            "high"
        ];

        if (
            !allowedPriorities.includes(priority)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Priority must be low, medium, or high"
            });
        }

        // ----------------------------------------------
        // Due date validation
        // ----------------------------------------------

        if (
            due_date !== null &&
            due_date !== "" &&
            !/^\d{4}-\d{2}-\d{2}$/.test(
                due_date
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Due date must use YYYY-MM-DD format"
            });
        }

        // ----------------------------------------------
        // Insert task
        // ----------------------------------------------

        const result = await pool.query(
            `INSERT INTO tasks
                (
                    title,
                    description,
                    completed,
                    priority,
                    due_date,
                    updated_at
                )
             VALUES
                (
                    $1,
                    $2,
                    false,
                    $3,
                    $4,
                    CURRENT_TIMESTAMP
                )
             RETURNING *`,
            [
                title.trim(),
                description
                    ? description.trim()
                    : "",
                priority,
                due_date || null
            ]
        );

        res.status(201).json({
            success: true,
            task: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Error creating task:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to create task"
        });
    }
};


// ======================================================
// UPDATE TASK
// ======================================================
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!validateTaskId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID"
            });
        }

        const {
            title,
            description,
            completed,
            priority,
            due_date
        } = req.body;

        // ----------------------------------------------
        // Validate title if provided
        // ----------------------------------------------

        if (title !== undefined) {

            if (
                typeof title !== "string" ||
                !title.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Task title cannot be empty"
                });
            }

            if (title.trim().length > 100) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Task title cannot exceed 100 characters"
                });
            }
        }

        // ----------------------------------------------
        // Validate description
        // ----------------------------------------------

        if (
            description !== undefined &&
            description !== null &&
            typeof description !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Description must be a string"
            });
        }

        // ----------------------------------------------
        // Validate completed
        // ----------------------------------------------

        if (
            completed !== undefined &&
            typeof completed !== "boolean"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Completed must be true or false"
            });
        }

        // ----------------------------------------------
        // Validate priority
        // ----------------------------------------------

        const allowedPriorities = [
            "low",
            "medium",
            "high"
        ];

        if (
            priority !== undefined &&
            !allowedPriorities.includes(priority)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Priority must be low, medium, or high"
            });
        }

        // ----------------------------------------------
        // Validate due date
        // ----------------------------------------------

        if (
            due_date !== undefined &&
            due_date !== null &&
            due_date !== "" &&
            !/^\d{4}-\d{2}-\d{2}$/.test(
                due_date
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Due date must use YYYY-MM-DD format"
            });
        }

        // ----------------------------------------------
        // Update task
        // ----------------------------------------------

        const result = await pool.query(
            `UPDATE tasks
             SET
                title = COALESCE($1, title),

                description =
                    COALESCE($2, description),

                completed =
                    COALESCE($3, completed),

                priority =
                    COALESCE($4, priority),

                due_date =
                    CASE
                        WHEN $5::text IS NULL
                            THEN due_date

                        WHEN $5::text = ''
                            THEN NULL

                        ELSE $5::date
                    END,

                updated_at =
                    CURRENT_TIMESTAMP

             WHERE id = $6

             RETURNING *`,
            [
                title !== undefined
                    ? title.trim()
                    : null,

                description !== undefined
                    ? description.trim()
                    : null,

                completed !== undefined
                    ? completed
                    : null,

                priority !== undefined
                    ? priority
                    : null,

                due_date !== undefined
                    ? due_date
                    : null,

                id
            ]
        );

        // ----------------------------------------------
        // Task not found
        // ----------------------------------------------

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.json({
            success: true,
            task: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Error updating task:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to update task"
        });
    }
};


// ======================================================
// DELETE TASK
// ======================================================
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!validateTaskId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID"
            });
        }

        const result = await pool.query(
            `DELETE FROM tasks
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.json({
            success: true,
            message:
                "Task deleted successfully",
            task: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Error deleting task:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to delete task"
        });
    }
};


// ======================================================
// EXPORT CONTROLLERS
// ======================================================

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
};