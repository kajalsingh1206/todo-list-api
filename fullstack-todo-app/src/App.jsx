import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useNavigate
} from "react-router-dom";

import { useState, useEffect } from "react";

import Shop from "./Shop";
import Cart from "./Cart";

// ================= HOME =================

function Home() {
    return (
        <div>
            <h1>Full Stack To-Do App</h1>

            <p>Welcome to your To-Do application!</p>

            <Link to="/login">Login</Link>
            {" | "}
            <Link to="/register">Register</Link>
            {" | "}
            <Link to="/upload">Image Upload</Link>
        </div>
    );
}

// ================= REGISTER =================

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                "https://todo-auth-api-ag0a.onrender.com/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Registration successful!");
                navigate("/login");
            } else {
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            console.error(error);
            alert("Cannot connect to authentication server");
        }
    };

    return (
        <div>
            <h1>Register</h1>

            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <br />
                <br />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <br />
                <br />

                <button type="submit">
                    Register
                </button>
            </form>

            <p>
                Already have an account?{" "}
                <Link to="/login">Login</Link>
            </p>

            <p>
                <Link to="/">Back to Home</Link>
            </p>
        </div>
    );
}

// ================= LOGIN =================

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("https://todo-auth-api-ag0a.onrender.com/api/auth/login", 
                {

                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);

                alert("Login successful!");

                navigate("/dashboard");
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.error(error);
            alert("Cannot connect to authentication server");
        }
    };

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <br />
                <br />

                <button type="submit">
                    Login
                </button>
            </form>

            <p>
                Don't have an account?{" "}
                <Link to="/register">Register</Link>
            </p>

            <p>
                <Link to="/">Back to Home</Link>
            </p>
        </div>
    );
}

// ================= DASHBOARD =================

function Dashboard() {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const token = localStorage.getItem("token");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editCompleted, setEditCompleted] = useState(false);

    // ================= FETCH TASKS =================

    const fetchTasks = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/tasks",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setTasks(data.tasks || data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchTasks();
    }, []);

    // ================= CREATE TASK =================

    const addTask = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/tasks",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title,
                        description
                    })
                }
            );

            if (response.ok) {
                setTitle("");
                setDescription("");

                fetchTasks();
            } else if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                alert("Failed to create task");
            }
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    // ================= START EDIT =================

    const startEdit = (task) => {
        setEditingId(task._id);
        setEditTitle(task.title);
        setEditDescription(task.description || "");
        setEditCompleted(task.completed);
    };

    // ================= UPDATE TASK =================

    const updateTask = async (id) => {
        try {
            const response = await fetch(
                `https://todo-list-api-o9pj.onrender.com/api/tasks/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title: editTitle,
                        description: editDescription,
                        completed: editCompleted
                    })
                }
            );

            if (response.ok) {
                setEditingId(null);
                fetchTasks();
            } else if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                alert("Failed to update task");
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // ================= DELETE TASK =================

    const deleteTask = async (id) => {
        try {
            const response = await fetch(
                `https://todo-list-api-o9pj.onrender.com/api/tasks/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                fetchTasks();
            } else if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                alert("Failed to delete task");
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // ================= LOGOUT =================

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div>
            <h1>To-Do Dashboard</h1>

            <button onClick={logout}>
                Logout
            </button>

            {" "}

            <Link to="/upload">
                <button>
                    Image Upload
                </button>
            </Link>

            <hr />

            <h2>Add New Task</h2>

            <form onSubmit={addTask}>
                <input
                    type="text"
                    placeholder="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <br />
                <br />

                <textarea
                    placeholder="Task description"
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                />

                <br />
                <br />

                <button type="submit">
                    Add Task
                </button>
            </form>

            <hr />

            <h2>My Tasks</h2>

            {tasks.length === 0 ? (
                <p>No tasks found.</p>
            ) : (
                tasks.map((task) => (
                    <div key={task._id}>

                        {editingId === task._id ? (

                            <div>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(e.target.value)
                                    }
                                />

                                <br />
                                <br />

                                <textarea
                                    value={editDescription}
                                    onChange={(e) =>
                                        setEditDescription(
                                            e.target.value
                                        )
                                    }
                                />

                                <br />
                                <br />

                                <label>
                                    <input
                                        type="checkbox"
                                        checked={editCompleted}
                                        onChange={(e) =>
                                            setEditCompleted(
                                                e.target.checked
                                            )
                                        }
                                    />

                                    {" "}Completed
                                </label>

                                <br />
                                <br />

                                <button
                                    onClick={() =>
                                        updateTask(task._id)
                                    }
                                >
                                    Save Changes
                                </button>

                                {" "}

                                <button
                                    onClick={() =>
                                        setEditingId(null)
                                    }
                                >
                                    Cancel
                                </button>
                            </div>

                        ) : (

                            <div>
                                <h3>{task.title}</h3>

                                <p>{task.description}</p>

                                <p>
                                    Status:{" "}
                                    {task.completed
                                        ? "Completed"
                                        : "Pending"}
                                </p>

                                <button
                                    onClick={() =>
                                        startEdit(task)
                                    }
                                >
                                    Edit
                                </button>

                                {" "}

                                <button
                                    onClick={() =>
                                        deleteTask(task._id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        )}

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}

// ================= IMAGE UPLOAD =================

function ImageUpload() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [message, setMessage] = useState("");

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setUploadedImage(null);
            setMessage("");
        }
    };

    const handleUpload = async () => {
        if (!image) {
            setMessage("Please select an image first.");
            return;
        }

        const formData = new FormData();

        formData.append("image", image);

        try {
            const response = await fetch(
                "http://localhost:5002/api/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage("Image uploaded successfully!");
                setUploadedImage(data.imageUrl);
            } else {
                setMessage(data.message || "Upload failed");
            }
        } catch (error) {
            console.error(error);
            setMessage(
                "Cannot connect to image upload server."
            );
        }
    };

    return (
        <div>
            <h1>Image Upload</h1>

            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />

            {preview && (
                <div>
                    <h2>Preview</h2>

                    <img
                        src={preview}
                        alt="Preview"
                        width="300"
                    />
                </div>
            )}

            <br />

            <button onClick={handleUpload}>
                Upload Image
            </button>

            <p>{message}</p>

            {uploadedImage && (
                <div>
                    <h2>Uploaded Image</h2>

                    <img
                        src={uploadedImage}
                        alt="Uploaded"
                        width="300"
                    />
                </div>
            )}

            <br />

            <Link to="/dashboard">
                Back to Dashboard
            </Link>

            {" | "}

            <Link to="/">
                Home
            </Link>
        </div>
    );
}

// ================= APP =================

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/upload"
                    element={<ImageUpload />}
                />
                    <Route
                        path="/shop"
                        element={<Shop />}
                    />
                    <Route path="/cart" element={<Cart />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;