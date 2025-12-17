import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState("login");
  const token = localStorage.getItem("token");

  if (token) return <Dashboard />;

  return page === "login" ? (
    <Login goRegister={() => setPage("register")} />
  ) : (
    <Register goLogin={() => setPage("login")} />
  );
}
