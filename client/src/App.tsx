import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import RatePage from "@/pages/rate-page";
import ContactPage from "@/pages/contact-page";
import SearchPage from "@/pages/search-page";
import WorkplaceDetail from "@/pages/workplace-detail";
import AgencyDetail from "@/pages/agency-detail";
import FAQPage from "@/pages/faq-page";
import { ProtectedRoute } from "./lib/protected-route";
import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/workplace/:id" component={WorkplaceDetail} />
      <Route path="/agency/:id" component={AgencyDetail} />
      <ProtectedRoute path="/rate" component={RatePage} />
      <Route path="/contact" component={ContactPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Router />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
