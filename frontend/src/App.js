import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { AuthProvider } from "./auth/AuthContext";
import EventsList from "./pages/EventsList";
import EventForm from "./pages/EventForm";
import ProtectedRoute from "./auth/ProtectedRoute";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Route */}
          {/* 
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          */}
           <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/new"
            element={
              <ProtectedRoute>
                <EventForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id/edit"
            element={
              <ProtectedRoute>
                <EventForm />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
