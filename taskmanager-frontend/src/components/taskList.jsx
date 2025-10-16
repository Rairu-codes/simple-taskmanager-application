import React from 'react'
import {useState, useEffect} from "react";
import {getAllTasks, createTask, updateTask, deleteTask} from "../services/taskService.js";
import '../App.css';
import Toast from './Toast';

function TaskList ()  {
    // State for storing array of tasks from backend
    const [tasks, setTasks] = useState([]);
    // State for form inputs (title, description, completed status)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        completed: false,
        deadline: "",
    });

    // State to track if we're editing (stores task ID) or creating (null)
    const [editingId, setEditingId] = useState(null);

    // State for toast notifications
    const [toast, setToast] = useState(null);

    // State for loading indicator
    const [loading, setLoading] = useState(false);

    // Function to show toast notification
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    // Function to close toast
    const closeToast = () => {
        setToast(null);
    };

    // Fetches all tasks from backend on initial load
    useEffect(() => {
        fetchTasks()
    }, [])

    // Async function to fetch all tasks from backend
    const fetchTasks = async () => {
        try{
            setLoading(true);
            const response = await getAllTasks();
            setTasks(response.data);
            console.log('Fetched tasks:', response.data);
        }catch(error){
            console.log('Error fetching tasks:', error);
            showToast('Failed to fetch tasks', 'error');
        }finally {
        setLoading(false);
    }
    };

    // Handle form submission for both create and update operations
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            showToast('Task title is required', 'error');
            return;
        }
        setLoading(true);

        try{
            if(editingId){
                console.log('Updating task ID:', editingId); // DEBUG
                console.log('Update data:', formData); // DEBUG

                const response = await updateTask(editingId, formData);
                console.log('Update response:', response.data); // DEBUG

                showToast('Task updated successfully!', 'success');
                setEditingId(null);

            }else{
                console.log('Creating task:', formData); // DEBUG

                const response = await createTask(formData);
                console.log('Create response:', response.data); // DEBUG

                showToast('Task created successfully!', 'success');
            }
            setFormData({
                title:'', description: '', completed: false,  deadline: "" // Reset deadline
            })
            await fetchTasks();

        }catch(error){
            console.error('Error saving task:', error);
            console.error('Error details:', error.response); // DEBUG

            // More detailed error message
            const errorMessage = error.response?.data?.message || 'Failed to save task';
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    }

    const handleEdit = async (task) => {
        console.log('Editing task:', task); // DEBUG

        // Format deadline for input if it exists
        let deadlineValue = '';
        if (task.deadline) {
            // Convert ISO format to datetime-local format
            deadlineValue = task.deadline.slice(0, 16); // YYYY-MM-DDTHH:mm
        }

        setFormData({
            title: task.title, description: task.description, completed: task.completed,  deadline: deadlineValue
        })
        setEditingId(task.id);
        showToast('Edit mode activated', 'info');

        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }
        setLoading(true);
        try{
            console.log('Deleting task ID:', id); // DEBUG
            await deleteTask(id);
            showToast('Task deleted successfully!', 'success');
            await fetchTasks();
        }catch(error){
            console.log('Error deleting task: ', error);
            showToast('Failed to delete task', 'error');
        }finally {
            setLoading(false);
        }
    }

    // Cancel edit mode
    const handleCancel = () => {
        setEditingId(null);
        setFormData({
            title: '',
            description: '',
            completed: false,
            deadline: "", // Reset deadline
        });
        showToast('Edit cancelled', 'info');
    }

    // Format deadline for display
    const formatDeadline = (deadline) => {
        if (!deadline) return null;
        const date = new Date(deadline);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
// Get status badge style
    const getStatusBadgeClass = (status) => {
        switch(status) {
            case 'on-time':
                return 'status-badge status-on-time';
            case 'late':
                return 'status-badge status-late';
            case 'completed-on-time':
                return 'status-badge status-completed-on-time';
            case 'completed-late':
                return 'status-badge status-completed-late';
            case 'pending':
                return 'status-badge status-pending';
            case 'completed':
                return 'status-badge status-completed';
            default:
                return 'status-badge status-pending';
        }
    }

    // Get status badge text
    const getStatusBadgeText = (status) => {
        switch(status) {
            case 'on-time':
                return '⏳ On Time';
            case 'late':
                return '⚠️ Late';
            case 'completed-on-time':
                return '✅ Completed On Time';
            case 'completed-late':
                return '⏰ Completed Late';
            case 'pending':
                return '📝 Pending';
            case 'completed':
                return '✅ Completed';
            default:
                return status;
        }
    }

    return (
        <>
            {/* Toast notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}

            {/* Main page container */}
            <div className="page-container">
                {/* Centered content wrapper */}
                <div className="content-wrapper">
                    {/* Page title */}
                    <h1 className="page-title">Task Manager</h1>

                    {/* Form card */}
                    <div className="form-card">
                        <h2 className="section-title">
                            {editingId ? '✏️ Edit Task' : '➕ Add New Task'}
                        </h2>

                        {/* Form with vertical spacing */}
                        <form onSubmit={handleSubmit} className="form-container">
                            {/* Title input */}
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Task Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input-field"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Description textarea */}
                            <div className="form-group">
                                <textarea
                                    placeholder="Task Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="textarea-field"
                                    rows="3"
                                    disabled={loading}
                                />
                            </div>

                            {/* NEW: Deadline input */}
                            <div className="deadline-container">
                                <label className="deadline-label">📅 Deadline (Optional)</label>
                                <input
                                    type="datetime-local"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    className="deadline-input"
                                    disabled={loading}
                                />
                            </div>

                            {/* Completed checkbox */}
                            <div className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id="completed"
                                    checked={formData.completed}
                                    onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                                    className="checkbox-input"
                                    disabled={loading}
                                />
                                <label htmlFor="completed" className="checkbox-label">
                                    Mark as Completed
                                </label>
                            </div>

                            {/* Submit and Cancel buttons */}
                            <div className="button-group">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : (editingId ? 'Update Task' : 'Add Task')}
                                </button>

                                {/* Cancel button only in edit mode */}
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="btn btn-secondary"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Loading indicator */}
                    {loading && (
                        <div className="loading-indicator">
                            <p>Loading...</p>
                        </div>
                    )}

                    {/* Task list section */}
                    <div className="task-list">
                        {/* Empty state */}
                        {tasks.length === 0 && !loading && (
                            <div className="empty-state">
                                <p>📝 No tasks yet. Create your first task above!</p>
                            </div>
                        )}

                        {/* Tasks */}
                        {tasks.map((task) => (
                            <div key={task.id} className="task-card">
                                <div className="task-item">
                                    {/* Task details */}
                                    <div className="task-content">
                                        <h3 className="task-title">{task.title}</h3>
                                        <p className="task-description">{task.description || 'No description'}</p>

                                        {/* Deadline display */}
                                        {task.deadline && (
                                            <div className="task-deadline">
                                                <span className="task-deadline-label">📅 Deadline:</span>
                                                <span className="task-deadline-time"> {formatDeadline(task.deadline)}</span>
                                            </div>
                                        )}

                                        {/* Status badges */}
                                        <span className={getStatusBadgeClass(task.status)}>
                                            {getStatusBadgeText(task.status)}
                                        </span>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="task-actions">
                                        <button
                                            onClick={() => handleEdit(task)}
                                            className="btn btn-warning"
                                            disabled={loading}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="btn btn-danger"
                                            disabled={loading}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TaskList