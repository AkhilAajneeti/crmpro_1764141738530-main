import React, { useEffect, useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Avatar from "react-avatar";

import Input from "../../../components/ui/Input";
import {
  accActivitesById,
  createAccount,
  createAccStream,
  updateAccount,
} from "services/account.service";
import { fetchUser } from "services/user.service";
import Select from "components/ui/Select";
import { fetchTeam } from "services/team.service";
import { fetchAccStreamById } from "services/account.service";
const AccountDrawer = ({
  account,
  isOpen,
  onClose,
  mode = "view",
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(account || {});
  const [drawerMode, setDrawerMode] = useState(mode);
  const [isLoading, setIsLoading] = useState(false);
  const [streams, setStreams] = useState([]);
  const [streamLoading, setStreamLoading] = useState(false);
  const [showStreamForm, setShowStreamForm] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [postingStream, setPostingStream] = useState(false);
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [expandedActivityId, setExpandedActivityId] = useState(null);

  const [users, setUsers] = useState([]);
  const [team, setTeam] = useState([]);
  // Form state for create/edit mode
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    industry: "",
    type: "",
    phoneNumber: "",
    emailAddress: "",
    description: "",
    assignedUserId: "",
    teamId: "",
    billingAddressStreet: "",
    billingAddressCity: "",
    billingAddressState: "",
    billingAddressPostalCode: "",
    billingAddressCountry: "",
    shippingAddressStreet: "",
    shippingAddressCity: "",
    shippingAddressState: "",
    shippingAddressCountry: "",
    shippingAddressPostalCode: "",
  });

  // industries options
  const INDUSTRIES = [
    "Advertising",
    "Aerospace",
    "Agriculture",
    "Apparel & Accessories",
    "Architecture",
    "Automotive",
    "Banking",
    "Biotechnology",
    "Building Materials & Equipment",
    "Chemical",
    "Computer",
    "Construction",
    "Consulting",
    "Creative",
    "Culture",
    "Defense",
    "Education",
    "Electric Power",
    "Electronics",
    "Energy",
    "Entertainment & Leisure",
    "Finance",
    "Food & Beverage",
    "Grocery",
    "Healthcare",
    "Hospitality",
    "Insurance",
    "Legal",
    "Manufacturing",
    "Marketing",
    "Mass Media",
    "Mining",
    "Music",
    "Petroleum",
    "Publishing",
    "Real Estate",
    "Retail",
    "Service",
    "Shipping",
    "Software",
    "Sports",
    "Support",
    "Technology",
    "Telecommunications",
    "Television",
    "Testing, Inspection & Certification",
    "Transportation",
    "Travel",
    "Venture Capital",
    "Water",
    "Wholesale",
  ];
  const TYPE = ["Customer", "Investor", "Partner", "Reseller"];

  useEffect(() => {
    if (account && (drawerMode === "view" || drawerMode === "edit")) {
      // Populate form with account data
      setFormData({
        name: account?.company || account?.name || "",
        website: account?.website || "",
        industry: account?.industry || "",
        phoneNumber: account?.phoneNumber || "",
      });
    } else if (drawerMode === "create") {
      // Reset form for new account
      setFormData({
        name: "",
        website: "",
        industry: "",
        type: "",
        phoneNumber: "",
        emailAddress: "",
        description: "",
        assignedUserId: "",
        teamId: "",
        billingAddressStreet: "",
        billingAddressCity: "",
        billingAddressState: "",
        billingAddressPostalCode: "",
        billingAddressCountry: "",
        shippingAddressStreet: "",
        shippingAddressCity: "",
        shippingAddressState: "",
        shippingAddressCountry: "",
        shippingAddressPostalCode: "",
        // versionNumber: account?.versionNumber|| null,
      });
    }
  }, [account, drawerMode]);
  useEffect(() => {
    if (!isOpen || !account?.id || activeTab !== "stream") return;

    const loadStream = async () => {
      try {
        setStreamLoading(true);
        const res = await fetchAccStreamById(account.id);
        console.log("ACCOUNT STREAM:", res);
        setStreams(res.list || []);
      } catch (err) {
        console.error("Failed to load account stream", err);
      } finally {
        setStreamLoading(false);
      }
    };

    loadStream();
  }, [isOpen, account?.id, activeTab]);
  const formatDateTime = (value) => {
    if (!value) return "—";
    const safe = value.replace(" ", "T");
    const d = new Date(safe);
    if (isNaN(d.getTime())) return "—";

    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  useEffect(() => {
    if (!isOpen || !account?.id || activeTab !== "activities") return;

    const loadActivities = async () => {
      try {
        setActivityLoading(true);
        const res = await accActivitesById(account.id);
        setActivities(res?.list || []);
      } catch (err) {
        console.error("Failed to load activities", err);
      } finally {
        setActivityLoading(false);
      }
    };

    loadActivities();
  }, [isOpen, account?.id, activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDrawerMode("view");
    // Reset form data to original account data
    if (account) {
      setFormData({
        name: account?.name || "",
        website: account?.website || "",
        industry: account?.industry || "",
        phoneNumber: account?.phoneNumber || "",
      });
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "Building2" },
    { id: "contacts", label: "Contacts", icon: "Users" },
    { id: "deals", label: "Deals", icon: "Target" },
    { id: "stream", label: "Stream", icon: "FileText" },
    { id: "activities", label: "Activities", icon: "Calendar" },
  ];

  const mockContacts = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Chief Technology Officer",
      email: "sarah.johnson@techcorp.com",
      phone: "+1 (555) 123-4567",
      avatar: "https://images.unsplash.com/photo-1637562772116-e01cda44fce8",
      avatarAlt:
        "Professional headshot of woman with shoulder-length brown hair in navy blazer",
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "VP of Engineering",
      email: "michael.chen@techcorp.com",
      phone: "+1 (555) 234-5678",
      avatar: "https://images.unsplash.com/photo-1629272039203-7d76fdaf1324",
      avatarAlt:
        "Professional headshot of Asian man with short black hair in dark suit",
    },
  ];

  const mockDeals = [
    {
      id: 1,
      name: "Enterprise Software License",
      value: "$125,000",
      stage: "Proposal",
      probability: 75,
      closeDate: "2025-01-15",
      owner: "John Doe",
    },
    {
      id: 2,
      name: "Cloud Migration Services",
      value: "$85,000",
      stage: "Qualified",
      probability: 60,
      closeDate: "2025-02-28",
      owner: "Jane Smith",
    },
  ];

  const mockActivities = [
    {
      id: 1,
      type: "call",
      title: "Discovery call with CTO",
      date: "2025-01-02",
      time: "2:00 PM",
      duration: "45 min",
      outcome: "Positive - interested in enterprise features",
    },
    {
      id: 2,
      type: "email",
      title: "Sent proposal document",
      date: "2025-01-01",
      time: "10:30 AM",
      outcome: "Proposal sent for technical review",
    },
    {
      id: 3,
      type: "meeting",
      title: "Product demo session",
      date: "2024-12-28",
      time: "3:00 PM",
      duration: "60 min",
      outcome: "Demo well received, requested custom integration details",
    },
  ];

  const mockNotes = [
    {
      id: 1,
      content: `Key decision makers identified:\n- Sarah Johnson (CTO) - Technical decision maker\n- Michael Chen (VP Eng) - Implementation lead\n- Budget approved for Q1 2025\n- Looking for scalable solution to support 500+ users`,
      author: "John Doe",
      date: "2025-01-02",
      time: "3:15 PM",
    },
    {
      id: 2,
      content: `Follow-up items from discovery call:\n1. Provide detailed security documentation\n2. Schedule technical deep-dive with engineering team\n3. Prepare custom integration proposal\n4. Share case studies from similar enterprise clients`,
      author: "Jane Smith",
      date: "2025-01-01",
      time: "11:00 AM",
    },
  ];
  const validateForm = () => {
    if (!formData?.name?.trim()) {
      alert("Account name is required");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersRes, teamRes] = await Promise.all([
          fetchUser(),
          fetchTeam(),
        ]);

        setUsers(usersRes.list || []);
        setTeam(teamRes.list || []);
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };

    loadData();
  }, []);

  const userOptions = users
    ?.filter((u) => u?.isActive) // ✅ only active users
    ?.map((u) => ({
      value: u.id,
      label: u.name || u.userName,
    }));
  const teamOptions = team?.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const payload = {
        name: formData.name,
      };

      console.log("UPDATE ACCOUNT PAYLOAD", payload);
      console.log("UPDATE versionNumber", account?.versionNumber);

      await updateAccount(account.id, payload, account?.versionNumber);

      onSuccess(); // refresh table
      onClose(); // close drawer
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update account");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const payload = {
        ...formData,
      };

      console.log("CREATE ACCOUNT PAYLOAD", payload);

      await createAccount(payload);

      onSuccess(); // refresh table
      onClose(); // close drawer
    } catch (err) {
      console.error("Create failed:", err);
      alert("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (drawerMode === "edit") {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleCancel = () => {
    setEditData(account);
    setIsEditing(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(parseFloat(value?.replace(/[$,]/g, "")) || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "call":
        return "Phone";
      case "email":
        return "Mail";
      case "meeting":
        return "Calendar";
      default:
        return "Activity";
    }
  };

  const getStageColor = (stage) => {
    switch (stage?.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "qualified":
        return "bg-yellow-100 text-yellow-800";
      case "proposal":
        return "bg-purple-100 text-purple-800";
      case "won":
        return "bg-green-100 text-green-800";
      case "lost":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStreamIcon = (type = "") => {
    switch (type) {
      case "Post":
        return "MessageSquare";
      case "Update":
        return "RefreshCcw";
      case "CreateRelated":
        return "Link";
      default:
        return "Activity";
    }
  };

  const getStreamIconColor = (type = "") => {
    switch (type) {
      case "Post":
        return "text-indigo-600";
      case "Update":
        return "text-blue-600";
      case "CreateRelated":
        return "text-purple-600";
      default:
        return "text-gray-500";
    }
  };

  const getStreamMessage = (item) => {
    if (item.type === "Post") return item.post;
    if (item.type === "Update" && item.data?.value)
      return `Status updated to ${item.data.value}`;
    if (item.type === "CreateRelated") return "Activity updated";
    return "Activity updated";
  };
  const createStream = async () => {
    //post activity
    setShowStreamForm(true);
  };

  const handlePostStream = async (e) => {
    e.preventDefault();

    if (!streamText.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      setPostingStream(true);

      const payload = {
        post: streamText,
        parentId: account.id, // ✅ ACCOUNT ID
        parentType: "Account", // ✅ IMPORTANT
        type: "Post",
        isInternal: false,
        attachmentsIds: [],
      };

      const newStream = await createAccStream(payload);

      // 🔥 Instantly update UI
      setStreams((prev) => [newStream, ...prev]);

      setStreamText("");
      setShowStreamForm(false);
    } catch (err) {
      console.error("Failed to post stream", err);
      alert("Failed to post activity");
    } finally {
      setPostingStream(false);
    }
  };

  const toggleActivity = (id) => {
    setExpandedActivityId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    setDrawerMode(mode);
  }, [mode]);
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
      {/* Drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full max-w-2xl bg-background border-l border-border z-50
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Building2" size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {drawerMode === "create"
                    ? "Add Account"
                    : drawerMode === "edit"
                    ? "Edit Account"
                    : account?.company}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {account?.website}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Save
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(true);
                    setDrawerMode("edit");
                  }}
                >
                  <Icon name="Edit" size={16} className="mr-2" />
                  Edit
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            {/* Tabs */}
            {/* Tabs */}
            {drawerMode !== "create" && (
              <div className="flex border-b border-border">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
          flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
          ${
            activeTab === tab.id
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }
        `}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "overview" && drawerMode === "create" && (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="name"
                    value={formData?.name}
                    onChange={handleInputChange}
                    placeholder="Acme Corporation"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Website
                  </label>
                  <Input
                    name="website"
                    type="url"
                    value={formData?.website}
                    onChange={handleInputChange}
                    placeholder="https://www.acme.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone
                    </label>
                    <Input
                      name="phoneNumber"
                      type="tel"
                      value={formData?.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="1234567891"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <Input
                      name="emailAddress"
                      type="email"
                      value={formData?.emailAddress}
                      onChange={handleInputChange}
                      placeholder="example123@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Billing Address
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        name="billingAddressStreet"
                        type="text"
                        value={formData?.billingAddressStreet}
                        onChange={handleInputChange}
                        placeholder="Street"
                      />
                    </div>
                    <div>
                      <Input
                        name="billingAddressCity"
                        type="text"
                        value={formData?.billingAddressCity}
                        onChange={handleInputChange}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Input
                        name="billingAddressState"
                        type="text"
                        value={formData?.billingAddressState}
                        onChange={handleInputChange}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Input
                        name="billingAddressPostalCode"
                        type="text"
                        value={formData?.billingAddressPostalCode}
                        onChange={handleInputChange}
                        placeholder="text"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        name="billingAddressCountry"
                        type="text"
                        value={formData?.billingAddressCountry}
                        onChange={handleInputChange}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Shipping Address
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        name="shippingAddressStreet"
                        type="text"
                        value={formData?.shippingAddressStreet}
                        onChange={handleInputChange}
                        placeholder="Street"
                      />
                    </div>
                    <div>
                      <Input
                        name="shippingAddressCity"
                        type="text"
                        value={formData?.shippingAddressCity}
                        onChange={handleInputChange}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Input
                        name="shippingAddressState"
                        type="text"
                        value={formData?.shippingAddressState}
                        onChange={handleInputChange}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Input
                        name="shippingAddressPostalCode"
                        type="text"
                        value={formData?.shippingAddressPostalCode}
                        onChange={handleInputChange}
                        placeholder="text"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        name="shippingAddressCountry"
                        type="text"
                        value={formData?.shippingAddressCountry}
                        onChange={handleInputChange}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Assigned User
                      </label>
                      <Select
                        name="assignedUserId"
                        value={formData.assignedUserId || ""}
                        options={userOptions} // 👉 later API se users
                        onChange={(value) =>
                          handleSelectChange("assignedUserId", value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Teams
                      </label>
                      <Select
                        name="teamId"
                        value={formData.teamId || ""}
                        options={teamOptions}
                        onChange={(value) =>
                          handleSelectChange("teamId", value)
                        }
                        placeholder="Select Team"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Details
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <select
                        name="type"
                        value={formData?.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="">Type</option>
                        {TYPE.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="">Select industry</option>
                        {INDUSTRIES.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <textarea
                        name="description"
                        value={formData?.description}
                        onChange={handleInputChange}
                        placeholder="Brief description of the company..."
                        rows={3}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading
                      ? "Saving..."
                      : drawerMode === "edit"
                      ? "Update Account"
                      : "Save Account"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={drawerMode === "edit" ? handleCancelEdit : onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "overview" &&
              (drawerMode === "view" || drawerMode === "edit") &&
              account && (
                <div className="space-y-6">
                  {/* Key Metrics */}

                  {/* Account Details update*/}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Account Details
                    </h3>

                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Account Name"
                          name="name"
                          value={formData.name || ""}
                          onChange={handleInputChange}
                        />

                        {/* <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="">Select Industry</option>
                        {INDUSTRIES.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>

                      

                      <Input
                        label="Phone"
                        name="phoneNumber"
                        value={formData.phoneNumber || ""}
                        onChange={handleInputChange}
                      /> */}

                        {/* <Input
                        label="Billing Street"
                        name="billingAddressStreet"
                        value={formData.billingAddressStreet || ""}
                        onChange={handleInputChange}
                        className="md:col-span-2"
                      />

                      <Input
                        label="City"
                        name="billingAddressCity"
                        value={formData.billingAddressCity || ""}
                        onChange={handleInputChange}
                      />

                      <Input
                        label="State"
                        name="billingAddressState"
                        value={formData.billingAddressState || ""}
                        onChange={handleInputChange}
                      />

                      <Input
                        label="Postal Code"
                        name="billingAddressPostalCode"
                        value={formData.billingAddressPostalCode || ""}
                        onChange={handleInputChange}
                      />

                      <Input
                        label="Country"
                        name="billingAddressCountry"
                        value={formData.billingAddressCountry || ""}
                        onChange={handleInputChange}
                      /> */}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Website
                          </div>
                          <div className="text-foreground">
                            https://techcorp.com
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Phone
                          </div>
                          <div className="text-foreground">
                            +1 (555) 123-4567
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <div className="text-sm text-muted-foreground">
                            Address
                          </div>
                          <div className="text-foreground">
                            123 Tech Street, San Francisco, CA 94105
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Account Owner
                          </div>
                          <div className="text-foreground">
                            {account?.assignedUserName || "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Last Activity
                          </div>
                          <div className="text-foreground">
                            {formatDate(account?.modifiedAt)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {activeTab === "contacts" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Contacts
                  </h3>
                  <Button size="sm">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Add Contact
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockContacts?.map((contact) => (
                    <div
                      key={contact?.id}
                      className="flex items-center space-x-4 p-4 border border-border rounded-lg"
                    >
                      <img
                        src={contact?.avatar}
                        alt={contact?.avatarAlt}
                        className="w-12 h-12 rounded-full object-cover"
                      />

                      <div className="flex-1">
                        <div className="font-medium text-foreground">
                          {contact?.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contact?.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contact?.email}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Icon name="Phone" size={16} />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Icon name="Mail" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "deals" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Active Deals
                  </h3>
                  <Button size="sm">
                    <Icon name="Plus" size={16} className="mr-2" />
                    New Deal
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockDeals?.map((deal) => (
                    <div
                      key={deal?.id}
                      className="p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium text-foreground">
                            {deal?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Owner: {deal?.owner}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground">
                            {deal?.value}
                          </div>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStageColor(
                              deal?.stage
                            )}`}
                          >
                            {deal?.stage}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="text-muted-foreground">
                          Close Date: {formatDate(deal?.closeDate)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-muted-foreground">
                            Probability:
                          </div>
                          <div className="font-medium text-foreground">
                            {deal?.probability}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "stream" && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-foreground">
                    Recent Stream
                  </h3>

                  <Button size="sm" variant="outline" onClick={createStream}>
                    <Icon name="Plus" size={16} className="mr-1" />
                    Add Stream
                  </Button>
                </div>

                {showStreamForm && (
                  <form onSubmit={handlePostStream} className="space-y-2">
                    <textarea
                      className="w-full px-3 py-2 border border-border rounded-lg"
                      rows={4}
                      placeholder="Write your comment..."
                      value={streamText}
                      onChange={(e) => setStreamText(e.target.value)}
                    />

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowStreamForm(false);
                          setStreamText("");
                        }}
                      >
                        Cancel
                      </Button>

                      <Button type="submit" size="sm" disabled={postingStream}>
                        {postingStream ? "Posting..." : "Post"}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Stream List */}
                {streams?.map((item) => (
                  <div
                    key={item.id}
                    className="flex space-x-3 p-4 bg-muted/30 rounded-lg group"
                  >
                    {/* Avatar */}
                    <Avatar
                      name={item.createdByName || "System"}
                      size="36"
                      round
                      textSizeRatio={2}
                    />

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-foreground">
                            {item.createdByName || "System"}
                          </h4>

                          <Icon
                            name={getStreamIcon(item.type)}
                            size={14}
                            className={getStreamIconColor(item.type)}
                          />

                          <span className="text-xs text-muted-foreground">
                            {item.type}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(item.createdAt)}
                          </span>

                          {/* Actions (hover only) */}
                          <div className="opacity-0 group-hover:opacity-100 transition">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Icon name="Edit" size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                            >
                              <Icon name="Trash2" size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <p className="text-sm text-muted-foreground mt-1">
                        {getStreamMessage(item)}
                      </p>

                      {/* Status Badge */}
                      {item.data?.value && (
                        <span
                          className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${getStageColor(
                            item.data.value
                          )}`}
                        >
                          {item.data.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "activities" && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Activities
                  </h3>

                  <Button size="sm">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Log Activity
                  </Button>
                </div>

                {activityLoading && (
                  <p className="text-sm text-muted-foreground">
                    Loading activities…
                  </p>
                )}

                {!activityLoading && activities.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No activities found
                  </p>
                )}

                {/* Activity List */}
                {activities.map((activity) => {
                  const isOpen = expandedActivityId === activity.id;

                  return (
                    <div
                      key={activity.id}
                      onClick={() => toggleActivity(activity.id)}
                      className="cursor-pointer rounded-lg bg-muted/30 p-4 transition hover:bg-muted/50"
                    >
                      {/* COLLAPSED HEADER */}
                      <div className="flex gap-3">
                        <Avatar
                          name={activity.assignedUserName || "System"}
                          size="36"
                          round
                        />

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-medium text-foreground">
                              {activity.name || "Activity"}
                            </h4>

                            <span className="text-xs text-muted-foreground">
                              {activity._scope}
                            </span>

                            {activity.status && (
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full ${getStageColor(
                                  activity.status
                                )}`}
                              >
                                {activity.status}
                              </span>
                            )}
                          </div>

                          <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Icon name="Clock" size={12} />
                              {formatDateTime(activity.dateStart)}
                            </span>

                            {activity.duration && (
                              <span className="flex items-center gap-1">
                                <Icon name="Timer" size={12} />
                                {Math.round(activity.duration / 60)} min
                              </span>
                            )}

                            {activity.parentType && (
                              <span className="flex items-center gap-1">
                                <Icon name="Link" size={12} />
                                {activity.parentType}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* EXPANDED CONTENT */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen
                            ? "max-h-[500px] opacity-100 mt-4"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Direction
                            </p>
                            <p className="font-medium">
                              {activity.direction || "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Assigned User
                            </p>
                            <p className="font-medium">
                              {activity.assignedUserName || "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Start
                            </p>
                            <p className="font-medium">
                              {formatDateTime(activity.dateStart)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">End</p>
                            <p className="font-medium">
                              {formatDateTime(activity.dateEnd)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Created
                            </p>
                            <p className="font-medium">
                              {formatDateTime(activity.createdAt)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Parent
                            </p>
                            <p className="font-medium text-primary">
                              {activity.parentType}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountDrawer;
