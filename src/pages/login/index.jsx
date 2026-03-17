import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import LoginHeader from "./components/LoginHeader";
import LoginForm from "./components/LoginForm";
import SecurityBadges from "./components/SecurityBadges";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem("auth_token");
    if (isAuthenticated === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Sign In - CRM</title>
        <meta
          name="description"
          content="Sign in to your CRMPro account to access your sales pipeline, customer data, and CRM tools."
        />
      </Helmet>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="grid grid-cols-2">
          {/* left  */}
          <div className="bg-slate-500">
            <div className="relative w-full max-w-md ">
              {/* Main Login Card */}
              <div className="bg-card border border-border rounded-xl shadow-elevation-2 p-8">
                {/* Header Section */}
                <LoginHeader />

                {/* Login Form */}
                <LoginForm />

                {/* Security Badges */}
                {/* <SecurityBadges /> */}
              </div>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  © {new Date()?.getFullYear()} Aajneeti CRM. All rights
                  reserved.
                </p>
              </div>
            </div>
          </div>
          {/* right */}
          <div className="flex justify-center items-center bg-orange-400">
           <div className="h2">CRM</div>
          </div>
        </div>
        {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" /> */}

        {/* Login Container */}

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl" />
      </div>
    </>
  );
};

export default LoginPage;
