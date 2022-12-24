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

export const AppContext = createContext();

function App() {
  const [username, setUsername] = useState("");

  return (
    <AppContext.Provider value={{ username, setUsername }}>
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
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </AppContext.Provider>
  );
}

export default App;
