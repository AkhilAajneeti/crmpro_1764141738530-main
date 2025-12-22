import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { Checkbox } from "../../../components/ui/Checkbox";

const ProfileTab = () => {
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    jobTitle: "Sales Manager",
    department: "Sales",
    timezone: "America/New_York",
    language: "en",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  });

  const [notifications, setNotifications] = useState({
    emailDeals: true,
    emailActivities: true,
    emailReports: false,
    pushDeals: true,
    pushActivities: false,
    pushReports: false,
    smsReminders: true,
    weeklyDigest: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const timezoneOptions = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
    { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
  ];

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
  ];

  const departmentOptions = [
    { value: "Sales", label: "Sales" },
    { value: "Marketing", label: "Marketing" },
    { value: "Customer Success", label: "Customer Success" },
    { value: "Operations", label: "Operations" },
    { value: "Finance", label: "Finance" },
    { value: "HR", label: "Human Resources" },
    { value: "IT", label: "Information Technology" },
  ];

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (field, checked) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleAvatarUpload = () => {
    // Mock avatar upload functionality
    console.log("Avatar upload clicked");
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Mock save functionality
    setTimeout(() => {
      setIsLoading(false);
      console.log("Profile saved successfully");
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Profile Information */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Icon name="User" size={24} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Profile Information
            </h3>
            <p className="text-sm text-muted-foreground">
              Update your personal details and preferences
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
                <Image
                  src={profileData?.avatar}
                  alt="Professional headshot of John Doe in business attire"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={handleAvatarUpload}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-smooth"
                aria-label="Upload new avatar"
              >
                <Icon name="Camera" size={16} />
              </button>
            </div>
            <div>
              <h4 className="font-medium text-card-foreground">
                Profile Photo
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                JPG, PNG or GIF. Max size 2MB.
              </p>
              <Button variant="outline" size="sm" onClick={handleAvatarUpload}>
                <Icon name="Upload" size={16} className="mr-2" />
                Upload New Photo
              </Button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              value={profileData?.firstName}
              onChange={(e) =>
                handleProfileChange("firstName", e?.target?.value)
              }
              required
            />
            <Input
              label="Last Name"
              type="text"
              value={profileData?.lastName}
              onChange={(e) =>
                handleProfileChange("lastName", e?.target?.value)
              }
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={profileData?.email}
              onChange={(e) => handleProfileChange("email", e?.target?.value)}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              value={profileData?.phone}
              onChange={(e) => handleProfileChange("phone", e?.target?.value)}
            />
            <Input
              label="Job Title"
              type="text"
              value={profileData?.jobTitle}
              onChange={(e) =>
                handleProfileChange("jobTitle", e?.target?.value)
              }
            />
            <Select
              label="Department"
              options={departmentOptions}
              value={profileData?.department}
              onChange={(value) => handleProfileChange("department", value)}
            />
          </div>

          {/* Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Timezone"
              options={timezoneOptions}
              value={profileData?.timezone}
              onChange={(value) => handleProfileChange("timezone", value)}
              searchable
            />
            <Select
              label="Language"
              options={languageOptions}
              value={profileData?.language}
              onChange={(value) => handleProfileChange("language", value)}
            />
          </div>

          <div className="flex justify-end">
            <Button
              variant="default"
              onClick={handleSaveProfile}
              loading={isLoading}
              iconName="Save"
              iconPosition="left"
            >
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
