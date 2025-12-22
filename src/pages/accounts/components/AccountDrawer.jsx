import React, { useEffect, useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

const AccountDrawer = ({ account, isOpen, onClose, mode = "view" }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(account || {});
  const [drawerMode, setDrawerMode] = useState(mode);
  const [isLoading, setIsLoading] = useState(false);
  // Form state for create/edit mode
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    industry: "",
    description: "",
    annualRevenue: "",
    employeeCount: "",
    billingAddress: "",
    shippingAddress: "",
  });

  useEffect(() => {
    if (account && (drawerMode === "view" || drawerMode === "edit")) {
      // Populate form with account data
      setFormData({
        name: account?.company || account?.name || "",
        website: account?.website || "",
        industry: account?.industry || "",
        description: account?.description || "",
        phoneNumber: account?.phoneNumber || "",
        emailAddress: account?.emailAddress || "",
        billingAddress: account?.billingAddress || "",
        shippingAddress: account?.shippingAddress || "",
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
        team: "",
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
    }
  }, [account, drawerMode]);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelEdit = () => {
    setDrawerMode("view");
    // Reset form data to original account data
    if (account) {
      setFormData({
        name: account?.company || account?.name || "",
        website: account?.website || "",
        industry: account?.industry || "",
        description: account?.description || "",
        annualRevenue: account?.annualRevenue || "",
        employeeCount: account?.employeeCount || "",
        billingAddress: account?.billingAddress || "",
        shippingAddress: account?.shippingAddress || "",
      });
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "Building2" },
    { id: "contacts", label: "Contacts", icon: "Users" },
    { id: "deals", label: "Deals", icon: "Target" },
    { id: "activities", label: "Activities", icon: "Calendar" },
    { id: "notes", label: "Notes", icon: "FileText" },
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

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving account data:", editData);
    setIsEditing(false);
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
                  onClick={() => setIsEditing(true)}
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
            {activeTab === "overview" &&
              (drawerMode === "create" || drawerMode === "edit") && (
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

                  {/* <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Industry
                    </label>
                    <Input
                      name="industry"
                      value={formData?.industry}
                      onChange={handleInputChange}
                      placeholder="Technology"
                    />
                  </div> */}
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
                          name="phoneNumber"
                          type="text"
                          value={formData?.billingAddressStreet}
                          onChange={handleInputChange}
                          placeholder="Street"
                        />
                      </div>
                      <div>
                        <Input
                          name="City"
                          type="text"
                          value={formData?.billingAddressCity}
                          onChange={handleInputChange}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <Input
                          name="State"
                          type="text"
                          value={formData?.billingAddressState}
                          onChange={handleInputChange}
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <Input
                          name="Postal"
                          type="text"
                          value={formData?.billingAddressPostalCode}
                          onChange={handleInputChange}
                          placeholder="text"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          name="Country"
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
                          name="phoneNumber"
                          type="text"
                          value={formData?.shippingAddressStreet}
                          onChange={handleInputChange}
                          placeholder="Street"
                        />
                      </div>
                      <div>
                        <Input
                          name="City"
                          type="text"
                          value={formData?.shippingAddressCity}
                          onChange={handleInputChange}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <Input
                          name="State"
                          type="text"
                          value={formData?.shippingAddressState}
                          onChange={handleInputChange}
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <Input
                          name="Postal"
                          type="text"
                          value={formData?.shippingAddressPostalCode}
                          onChange={handleInputChange}
                          placeholder="text"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          name="Country"
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
                        <Input
                          name="Assigned UserName"
                          type="text"
                          value={formData?.assignedUserName}
                          onChange={handleInputChange}
                          placeholder="Assigned User"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Teams
                        </label>
                        <Input
                          name="City"
                          type="text"
                          value={formData?.team}
                          onChange={handleInputChange}
                          placeholder="Developer"
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
                        <Input
                          name="phoneNumber"
                          type="text"
                          value={formData?.type}
                          onChange={handleInputChange}
                          placeholder="Type"
                        />
                      </div>
                      <div>
                        <Input
                          name="industry"
                          type="text"
                          value={formData?.industry}
                          onChange={handleInputChange}
                          placeholder="Industry"
                        />
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
                      onClick={
                        drawerMode === "edit" ? handleCancelEdit : onClose
                      }
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

            {activeTab === "overview" && drawerMode === "view" && account && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">
                      Annual Revenue
                    </div>
                    <div className="text-2xl font-semibold text-foreground">
                      {formatCurrency(account?.revenue)}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">
                      Total Contacts
                    </div>
                    <div className="text-2xl font-semibold text-foreground">
                      {account?.contactCount}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">
                      Deal Value
                    </div>
                    <div className="text-2xl font-semibold text-foreground">
                      {formatCurrency(account?.dealValue)}
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Account Details
                  </h3>

                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Company Name"
                        value={editData?.company || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            company: e?.target?.value,
                          })
                        }
                      />

                      <Input
                        label="Industry"
                        value={editData?.industry || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            industry: e?.target?.value,
                          })
                        }
                      />

                      <Input
                        label="Website"
                        value={editData?.website || "https://techcorp.com"}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            website: e?.target?.value,
                          })
                        }
                      />

                      <Input
                        label="Phone"
                        value={editData?.phone || "+1 (555) 123-4567"}
                        onChange={(e) =>
                          setEditData({ ...editData, phone: e?.target?.value })
                        }
                      />

                      <Input
                        label="Address"
                        value={
                          editData?.address ||
                          "123 Tech Street, San Francisco, CA 94105"
                        }
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            address: e?.target?.value,
                          })
                        }
                        className="md:col-span-2"
                      />
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
                        <div className="text-foreground">+1 (555) 123-4567</div>
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
                        <div className="text-foreground">{account?.owner}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Last Activity
                        </div>
                        <div className="text-foreground">
                          {formatDate(account?.lastActivity)}
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

            {activeTab === "activities" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Recent Activities
                  </h3>
                  <Button size="sm">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Log Activity
                  </Button>
                </div>

                <div className="space-y-4">
                  {mockActivities?.map((activity) => (
                    <div
                      key={activity?.id}
                      className="flex space-x-4 p-4 border border-border rounded-lg"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon
                          name={getActivityIcon(activity?.type)}
                          size={16}
                          className="text-primary"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">
                          {activity?.title}
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {formatDate(activity?.date)} at {activity?.time}
                          {activity?.duration && ` • ${activity?.duration}`}
                        </div>
                        <div className="text-sm text-foreground">
                          {activity?.outcome}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Notes
                  </h3>
                  <Button size="sm">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Add Note
                  </Button>
                </div>

                <div className="space-y-4">
                  {mockNotes?.map((note) => (
                    <div
                      key={note?.id}
                      className="p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium text-foreground">
                          {note?.author}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(note?.date)} at {note?.time}
                        </div>
                      </div>
                      <div className="text-foreground whitespace-pre-line">
                        {note?.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountDrawer;
