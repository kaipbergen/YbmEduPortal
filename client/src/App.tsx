import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";

import Navbar from "@/components/navigation/navbar";
import Home from "@/pages/home";
import Courses from "@/pages/courses";
import Materials from "@/pages/materials";
import UniversityGuide from "@/pages/university-guide";
import Contact from "@/pages/contact";
import PaymentSuccess from "@/pages/payment/success";
import PaymentCancel from "@/pages/payment/cancel";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/courses" component={Courses} />
          <Route path="/materials" component={Materials} />
          <Route path="/university-guide" component={UniversityGuide} />
          <Route path="/contact" component={Contact} />
          <Route path="/payment/success" component={PaymentSuccess} />
          <Route path="/payment/cancel" component={PaymentCancel} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;