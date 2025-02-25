import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import "./lib/i18n"; // Import i18n configuration

import Navbar from "@/components/navigation/navbar";
import Home from "@/pages/home";
import Courses from "@/pages/courses";
import Materials from "@/pages/materials";
import UniversityGuide from "@/pages/university-guide";
import Contact from "@/pages/contact";
import PaymentSuccess from "@/pages/payment/success";
import PaymentCancel from "@/pages/payment/cancel";
import Login from "@/pages/login";
import Register from "@/pages/register";
import NotFound from "@/pages/not-found";

function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/university-guide" element={<UniversityGuide />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />

          {/* New routes for login and register */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Catch-all 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Toaster />
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}

export default App;