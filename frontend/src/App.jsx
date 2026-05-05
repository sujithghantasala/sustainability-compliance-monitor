import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ListPage from "./pages/ListPage";
import DetailPage from "./pages/DetailPage";
import FormPage from "./pages/FormPage";
import EditPage from "./pages/EditPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      {/* ✅ Navbar OUTSIDE Routes */}
      {localStorage.getItem("token") && <Navbar />}

      <Routes>
  <Route path="/" element={<LoginPage />} />

  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />

  <Route path="/list" element={
    <ProtectedRoute>
      <ListPage />
    </ProtectedRoute>
  } />

  <Route path="/details/:id" element={
    <ProtectedRoute>
      <DetailPage />
    </ProtectedRoute>
  } />

  <Route path="/add" element={
    <ProtectedRoute>
      <FormPage />
    </ProtectedRoute>
  } />

  <Route path="/edit/:id" element={
    <ProtectedRoute>
      <EditPage />
    </ProtectedRoute>
  } />

  <Route path="/analytics" element={
    <ProtectedRoute>
      <AnalyticsPage />
    </ProtectedRoute>
  } />
</Routes>
    </>
  );
}

export default App;