// src/App.jsx
import { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

const App = () => {
    // Estado para guardar la lista de tareas.
    // Inicialmente, intenta cargar las tareas de localStorage.
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    // Estado para guardar los datos del formulario de nueva tarea.
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    // Estado para la tarea que se está editando.
    const [editingTask, setEditingTask] = useState(null);
    // Estado para el modo del tema.
    const [theme, setTheme] = useState('light');
    // inicializar la variable 'filter'
    const [filter, setFilter] = useState('all'); 

    // Efecto para guardar las tareas en localStorage cada vez que el estado 'tasks' cambia.
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Función para alternar el tema.
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    // Función para crear una nueva tarea (sin backend).
    const handleCreateTask = (e) => {
        e.preventDefault();
        if (newTask.title.trim()) {
            const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
            const taskWithId = { ...newTask, id: newId, completed: false };
            setTasks([taskWithId, ...tasks]);
            setNewTask({ title: '', description: '' });
        }
    };

    // Función para actualizar una tarea (sin backend).
    const handleUpdateTask = (task) => {
        setTasks(tasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)));
    };

    // Función para borrar una tarea (sin backend).
    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter((task) => task.id !== taskId));
    };

    // Función para editar una tarea (sin backend).
    const handleEditTask = (e) => {
        e.preventDefault();
        setTasks(tasks.map((t) => (t.id === editingTask.id ? editingTask : t)));
        setEditingTask(null);
    };
    
    // Filtramos las tareas basadas en el estado del filtro (sin necesidad de llamadas a la API)
    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    });

    return (
        <div className={`${theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gray-800 text-gray-100'} min-h-screen p-4`}>
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl font-extrabold mb-8 text-center">
                    Gestor de Tareas Estático
                </h1>

                <div className="flex justify-end mb-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full transition duration-300 ease-in-out focus:outline-none"
                    >
                        {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
                    </button>
                </div>
                
                <TaskForm 
                    newTask={newTask} 
                    setNewTask={setNewTask} 
                    handleCreateTask={handleCreateTask} 
                    theme={theme}
                />

                <div className="flex justify-center space-x-4 mb-8">
                    {/* ... (Botones de filtro) ... */}
                </div>

                <TaskList
                    tasks={filteredTasks}
                    theme={theme}
                    editingTask={editingTask}
                    setEditingTask={setEditingTask}
                    handleUpdateTask={handleUpdateTask}
                    handleDeleteTask={handleDeleteTask}
                    handleEditTask={handleEditTask}
                />
            </div>
        </div>
    );
};

export default App;