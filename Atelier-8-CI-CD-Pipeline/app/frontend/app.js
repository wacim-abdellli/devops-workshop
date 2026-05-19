// API Configuration
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : '/api';

const HEALTH_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/health'
    : '/health';

// State
let tasks = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkAPIHealth();
    loadTasks();
    
    // Add enter key support for task input
    document.getElementById('task-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

// Check API health
async function checkAPIHealth() {
    const statusBadge = document.getElementById('api-status');
    const versionBadge = document.getElementById('version');
    
    try {
        const response = await fetch(HEALTH_URL);
        const data = await response.json();
        
        if (data.status === 'healthy') {
            statusBadge.innerHTML = '<span class="status-dot"></span>Connected';
            statusBadge.classList.remove('checking', 'error');
            statusBadge.classList.add('healthy');
            versionBadge.textContent = `v${data.version}`;
        }
    } catch (error) {
        statusBadge.innerHTML = '<span class="status-dot"></span>Offline';
        statusBadge.classList.remove('checking', 'healthy');
        statusBadge.classList.add('error');
        console.error('API health check failed:', error);
    }
}

// Clear completed tasks
async function clearCompleted() {
    const completedTasks = tasks.filter(t => t.completed);
    
    if (completedTasks.length === 0) return;
    
    if (!confirm(`Delete ${completedTasks.length} completed task(s)?`)) {
        return;
    }
    
    try {
        await Promise.all(
            completedTasks.map(task => 
                fetch(`${API_URL}/tasks/${task.id}`, { method: 'DELETE' })
            )
        );
        
        tasks = tasks.filter(t => !t.completed);
        renderTasks();
        updateStats();
    } catch (error) {
        alert('Failed to clear completed tasks: ' + error.message);
        console.error('Error clearing completed tasks:', error);
    }
}

// Load tasks from API
async function loadTasks() {
    const tasksList = document.getElementById('tasks-list');
    
    try {
        const response = await fetch(`${API_URL}/tasks`);
        
        if (!response.ok) {
            throw new Error('Failed to load tasks');
        }
        
        tasks = await response.json();
        renderTasks();
        updateStats();
    } catch (error) {
        tasksList.innerHTML = `
            <div class="error">
                <p>❌ Failed to load tasks</p>
                <p>${error.message}</p>
            </div>
        `;
        console.error('Error loading tasks:', error);
    }
}

// Render tasks
function renderTasks() {
    const tasksList = document.getElementById('tasks-list');
    const clearBtn = document.getElementById('clear-completed');
    
    if (tasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✨</div>
                <p>No tasks yet. Add your first task above!</p>
            </div>
        `;
        clearBtn.style.display = 'none';
        return;
    }
    
    const hasCompleted = tasks.some(t => t.completed);
    clearBtn.style.display = hasCompleted ? 'block' : 'none';
    
    tasksList.innerHTML = tasks
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="toggleTask(${task.id})"
                />
                <div class="task-content">
                    <div class="task-title">${escapeHtml(task.title)}</div>
                    <div class="task-date">${formatDate(task.createdAt)}</div>
                </div>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `).join('');
}

// Add new task
async function addTask() {
    const input = document.getElementById('task-input');
    const title = input.value.trim();
    
    if (!title) {
        alert('Please enter a task title');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });
        
        if (!response.ok) {
            throw new Error('Failed to create task');
        }
        
        const newTask = await response.json();
        tasks.push(newTask);
        
        input.value = '';
        renderTasks();
        updateStats();
    } catch (error) {
        alert('Failed to add task: ' + error.message);
        console.error('Error adding task:', error);
    }
}

// Toggle task completion
async function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    
    if (!task) return;
    
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: !task.completed })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update task');
        }
        
        const updatedTask = await response.json();
        const index = tasks.findIndex(t => t.id === id);
        tasks[index] = updatedTask;
        
        renderTasks();
        updateStats();
    } catch (error) {
        alert('Failed to update task: ' + error.message);
        console.error('Error updating task:', error);
        loadTasks(); // Reload to sync state
    }
}

// Delete task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
        updateStats();
    } catch (error) {
        alert('Failed to delete task: ' + error.message);
        console.error('Error deleting task:', error);
    }
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    document.getElementById('total-tasks').textContent = total;
    document.getElementById('completed-tasks').textContent = completed;
    document.getElementById('pending-tasks').textContent = pending;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
