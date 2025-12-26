import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import Settings from "./pages/settings";
import IntegrationsPage from "./pages/integrations";
import BillingPage from "./pages/billing";
import DealsPage from "./pages/deals";
import ContactsPage from "./pages/contacts";
import LoginPage from "./pages/login";
import EmailsPage from "./pages/emails";
import AccountsPage from "./pages/accounts";
import Dashboard from "./pages/dashboard";
import Pipeline from "./pages/pipeline";
import Reports from "./pages/reports";
import Activities from "./pages/activities";
import Profile from "pages/profile";
import Login from "./pages/login";
import ProtectedRoute from "routes/ProtectedRoute";
const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {" "}
                <Dashboard />{" "}
              </ProtectedRoute>
            }
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/emails" element={<EmailsPage />} />
          <Route
            path="/accounts"
            element={
              <ProtectedRoute>
                <AccountsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
