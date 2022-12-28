import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, createContext } from "react";
import Layout from "./pages/Layout";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Author from "./pages/Author";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import Profile from "./pages/Profile";
import Project from "./pages/Project";

export const AppContext = createContext();

function App() {
  const [username, setUsername] = useState("");
  const [project, setProject] = useState("");

  return (
    <AppContext.Provider value={{ username, setUsername, project, setProject }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Blog />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="author/:name" element={<Author />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="reports" element={<Report />} />
              <Route path="projects/:projectId" element={<Project />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </AppContext.Provider>
  );
}

export default App;
