import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { Checkbox } from "../../../components/ui/Checkbox";
import Icon from "../../../components/AppIcon";

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // 🔐 Step 1: create login token (username + password)
      const loginToken = btoa(`${formData.username}:${formData.password}`);

      const res = await fetch("https://gateway.aajneetiadvertising.com/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "create-token": loginToken,
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data?.message || "Invalid credentials");
      }

      // 🔐 Step 2: create login object from response
      const loginObj = {
        username: formData.username,
        token: data.token,
        secret: data.secret,
      };

      // 🔐 Step 3: stringify + base64 encode
      const jsonString = JSON.stringify(loginObj);
      const myToken = btoa(jsonString);

      // ✅ Store everything
      localStorage.setItem("auth_token", myToken); // MAIN TOKEN
      localStorage.setItem("login_object", jsonString); // optional (debug/use)
      localStorage.setItem("isAuthenticated", "true");

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setErrors({ general: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-red-500" />
            <p className="text-sm text-red-700">{errors.general}</p>
          </div>
        </div>
      )}

      <Input
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleInputChange}
        error={errors.username}
        disabled={isLoading}
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        error={errors.password}
        disabled={isLoading}
        required
      />

      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={formData.rememberMe}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </div>

      <Button type="submit" fullWidth loading={isLoading} disabled={isLoading}>
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
};

export default LoginForm;
