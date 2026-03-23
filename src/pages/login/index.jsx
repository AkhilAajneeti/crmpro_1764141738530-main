import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import LoginHeader from "./components/LoginHeader";
import LoginForm from "./components/LoginForm";
import { motion } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-screen bg-background grid grid-cols-1 lg:grid-cols-2"
      >
        {/* LEFT SIDE - LOGIN */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex items-center justify-center p-6 lg:p-12"
        >
          <div className="w-full max-w-md">
            {/* Logo / Branding */}

            {/* Card */}
            <div className="bg-card border border-border rounded-2xl shadow-xl p-8 space-y-6 ">
              <LoginHeader />
              <LoginForm />
            </div>

            {/* Footer */}
            <p className="mt-6 text-xs text-center text-muted-foreground">
              © {new Date().getFullYear()} Aajneeti Connect Ltd. All rights
              reserved.
            </p>
          </div>
        </motion.div>

        {/* RIGHT SIDE - VISUAL */}
        <div className="hidden lg:flex relative items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 text-white overflow-hidden">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(#ffffff20_1px,transparent_1px),linear-gradient(90deg,#ffffff20_1px,transparent_1px)] bg-[size:40px_40px]" />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative z-10 text-center max-w-md px-6"
          >
            <div className="text-4xl font-bold mb-4">
              Smarter CRM. Better Growth.
            </div>
            <p className="text-sm text-white/80">
              Streamline your workflow, manage customer relationships, and
              unlock data-driven insights — all in one place.
            </p>
          </motion.div>
          <motion.img
            src="/assets/images/rocket.png"
            alt="spiral"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute bottom-16 right-16 w-32 opacity-25 pointer-events-none"
          />
          {/* Glow Effects */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-20 right-20 w-40 h-40 blur-3xl "
          />

          <motion.div
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute bottom-20 right-20 w-52 h-52 bg-indigo-500/30 rounded-full blur-3xl"
          />
        </div>
      </motion.div>
    </>
  );
};

export default LoginPage;
