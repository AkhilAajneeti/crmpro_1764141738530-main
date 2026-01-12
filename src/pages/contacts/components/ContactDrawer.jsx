import React, { useEffect, useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "components/ui/Select";
import { createContact, updateContact } from "services/contact.service";
import { fetchAccounts } from "services/account.service";
import { fetchUser } from "services/user.service";
import { fetchTeam } from "services/team.service";

const ContactDrawer = ({ mode, contact, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [newNote, setNewNote] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [team, setTeam] = useState([]);
  useEffect(() => {
    if (isOpen) {
      fetchAccounts()
        .then((res) => setAccounts(res.list || []))
        .catch((err) => console.error("Account fetch failed", err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (contact && mode === "edit") {
      setFormData({
        salutationName: contact.salutationName || "",
        firstName: contact.firstName || "",
        lastname: contact.lastName || "",
        phoneNumber: contact.phoneNumber || "",
        emailAddress: contact.emailAddress || "",
        description: contact.description || "",
        accountId: contact.accountId || "",
        addressStreet: contact.addressStreet || "",
        addressCity: contact.addressCity || "",
        addressState: contact.addressState || "",
        addressPostalCode: contact.addressPostalCode || "",
        addressCountry: contact.addressCountry || "",
        assignedUserId: contact.assignedUserId || "",
        teamId: contact.teamId || "",
      });
    }
  }, [contact, mode]);

  // if (!contact) return null;
  const [formData, setFormData] = useState({
    salutationName: "",
    firstName: "",
    lastname: "",
    phoneNumber: "",
    emailAddress: "",
    accountId: "",
    addressStreet: "",
    addressCity: "",
    addressState: "",
    addressPostalCode: "",
    addressCountry: "",
    assignedUserId: "",
    teamId: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        salutationName: formData.salutationName,
        firstName: formData.firstName,
        lastName: formData.lastname,

        phoneNumber: formData.phoneNumber,
        emailAddress: formData.emailAddress,
        description: formData.description,
        accountId: formData.accountId,

        addressStreet: formData.addressStreet,
        addressCity: formData.addressCity,
        addressState: formData.addressState,
        addressPostalCode: formData.addressPostalCode,
        addressCountry: formData.addressCountry,
      };
      console.log(payload);
      if (mode === "edit") {
        await updateContact(contact.id, payload);
      } else {
        await createContact(payload);
      }
      console.log("created contact");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const mockDeals = [
    {
      id: 1,
      name: "Enterprise Software License",
      value: 125000,
      stage: "Proposal",
      probability: 75,
      closeDate: "2025-01-15",
    },
    {
      id: 2,
      name: "Cloud Migration Project",
      value: 85000,
      stage: "Qualified",
      probability: 60,
      closeDate: "2025-02-28",
    },
  ];

  const mockActivities = [
    {
      id: 1,
      type: "call",
      title: "Follow-up call regarding proposal",
      date: "2025-01-02",
      time: "2:30 PM",
      duration: "25 min",
      outcome: "Positive response, scheduling demo next week",
    },
    {
      id: 2,
      type: "email",
      title: "Sent pricing proposal",
      date: "2024-12-28",
      time: "10:15 AM",
      outcome: "Proposal delivered successfully",
    },
    {
      id: 3,
      type: "meeting",
      title: "Initial discovery meeting",
      date: "2024-12-20",
      time: "3:00 PM",
      duration: "45 min",
      outcome: "Identified key requirements and pain points",
    },
  ];

  const mockNotes = [
    {
      id: 1,
      content:
        "Very interested in our enterprise solution. Mentioned budget approval process takes 2-3 weeks. Key decision maker but needs CFO sign-off for deals over $100k.",
      author: "Sarah Johnson",
      date: "2025-01-02",
      time: "3:45 PM",
    },
    {
      id: 2,
      content:
        "Prefers email communication over phone calls. Available for meetings on Tuesdays and Thursdays after 2 PM EST.",
      author: "Mike Chen",
      date: "2024-12-28",
      time: "11:30 AM",
    },
  ];
  const TYPE = ["Mr.", "Ms.", "Mrs.", "Dr."];
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
   const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getActivityIcon = (type) => {
    const icons = {
      call: "Phone",
      email: "Mail",
      meeting: "Calendar",
      task: "CheckSquare",
    };
    return icons?.[type] || "Circle";
  };

  const getActivityColor = (type) => {
    const colors = {
      call: "text-blue-500",
      email: "text-green-500",
      meeting: "text-purple-500",
      task: "text-orange-500",
    };
    return colors?.[type] || "text-muted-foreground";
  };

  const handleAddNote = () => {
    if (newNote?.trim()) {
      console.log("Adding note:", newNote);
      setNewNote("");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "User" },
    { id: "deals", label: "Deals", icon: "Target" },
    { id: "activities", label: "Activities", icon: "Clock" },
    { id: "notes", label: "Notes", icon: "FileText" },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
      {/* Drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full sm:w-96 lg:w-[480px] bg-background border-l border-border z-50
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              {mode === "create"
                ? "Add Contact"
                : mode === "edit"
                ? "Edit Contact"
                : "Contact Details"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close contact details"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {/* CREATE CONTACT FORM */}
            {mode === "create" && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Salutation
                    </label>
                    <select
                      name="salutationName"
                      value={formData?.salutationName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Select</option>
                      {TYPE.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      First Name
                    </label>
                    <Input
                      name="firstName"
                      value={formData?.firstName}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Last name
                    </label>
                    <Input
                      name="lastname"
                      type="text"
                      value={formData?.lastname}
                      onChange={handleInputChange}
                      placeholder="Developer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <Input
                    name="emailAddress"
                    type="text"
                    value={formData?.emailAddress}
                    onChange={handleInputChange}
                    placeholder="example@gmail.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Account Name
                    </label>
                    <select
                      name="accountId"
                      value={formData?.accountId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Select</option>
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <Input
                      name="phoneNumber"
                      type="tel"
                      value={formData?.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+919807809876"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Address
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        name="addressStreet"
                        type="text"
                        value={formData?.addressStreet}
                        onChange={handleInputChange}
                        placeholder="Street"
                      />
                    </div>
                    <div>
                      <Input
                        name="addressCity"
                        type="text"
                        value={formData?.addressCity}
                        onChange={handleInputChange}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Input
                        name="addressState"
                        type="text"
                        value={formData?.addressState}
                        onChange={handleInputChange}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Input
                        name="addressPostalCode"
                        type="text"
                        value={formData?.addressPostalCode}
                        onChange={handleInputChange}
                        placeholder="Postal Code"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        name="addressCountry"
                        type="text"
                        value={formData?.addressCountry}
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

                <textarea
                  name="description"
                  value={formData?.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the company..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Account"}
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* VIEW CONTACT */}
            {mode === "view" && contact && (
              <>
                {/* Contact Info */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={contact?.avatar}
                        alt={contact?.avatarAlt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground">
                        {contact?.name}
                      </h3>
                      <p className="text-muted-foreground">{contact?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {contact?.company}
                      </p>
                      <div className="flex items-center space-x-4 mt-3">
                        <Button variant="outline" size="sm">
                          <Icon name="Phone" size={16} className="mr-2" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm">
                          <Icon name="Mail" size={16} className="mr-2" />
                          Email
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-border">
                  <nav className="flex space-x-1 px-6">
                    {tabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={`
                    flex items-center space-x-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors
                    ${
                      activeTab === tab?.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }
                  `}
                      >
                        <Icon name={tab?.icon} size={16} />
                        <span>{tab?.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  {activeTab === "overview" && (
                    <div className="p-6 space-y-6">
                      <div>
                        <h4 className="font-medium text-foreground mb-3">
                          Contact Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Icon
                              name="Mail"
                              size={16}
                              className="text-muted-foreground"
                            />
                            <span className="text-sm text-primary hover:underline cursor-pointer">
                              {contact?.email}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Icon
                              name="Phone"
                              size={16}
                              className="text-muted-foreground"
                            />
                            <span className="text-sm text-foreground">
                              {contact?.phone}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Icon
                              name="Building2"
                              size={16}
                              className="text-muted-foreground"
                            />
                            <span className="text-sm text-foreground">
                              {contact?.company}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Icon
                              name="MapPin"
                              size={16}
                              className="text-muted-foreground"
                            />
                            <span className="text-sm text-foreground">
                              New York, NY
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-foreground mb-3">
                          Relationship Status
                        </h4>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                            contact?.status === "Active"
                              ? "bg-success/10 text-success border-success/20"
                              : contact?.status === "Customer"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : contact?.status === "Prospect"
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {contact?.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-medium text-foreground mb-3">
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-accent/10 text-accent-foreground text-xs rounded-md border border-accent/20">
                            Decision Maker
                          </span>
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20">
                            Enterprise
                          </span>
                          <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-md border border-secondary/20">
                            High Value
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "deals" && (
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-foreground">
                          Associated Deals
                        </h4>
                        <Button variant="outline" size="sm">
                          <Icon name="Plus" size={16} className="mr-2" />
                          Add Deal
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {mockDeals?.map((deal) => (
                          <div
                            key={deal?.id}
                            className="p-4 border border-border rounded-lg"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="font-medium text-foreground">
                                  {deal?.name}
                                </h5>
                                <p className="text-sm text-muted-foreground mt-1">
                                  ${deal?.value?.toLocaleString()} •{" "}
                                  {deal?.probability}% probability
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Close date:{" "}
                                  {new Date(
                                    deal.closeDate
                                  )?.toLocaleDateString()}
                                </p>
                              </div>
                              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20">
                                {deal?.stage}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "activities" && (
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-foreground">
                          Recent Activities
                        </h4>
                        <Button variant="outline" size="sm">
                          <Icon name="Plus" size={16} className="mr-2" />
                          Log Activity
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {mockActivities?.map((activity) => (
                          <div
                            key={activity?.id}
                            className="flex items-start space-x-3"
                          >
                            <div
                              className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${getActivityColor(
                                activity?.type
                              )}`}
                            >
                              <Icon
                                name={getActivityIcon(activity?.type)}
                                size={16}
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-foreground text-sm">
                                {activity?.title}
                              </h5>
                              <p className="text-xs text-muted-foreground">
                                {activity?.date} at {activity?.time}
                                {activity?.duration &&
                                  ` • ${activity?.duration}`}
                              </p>
                              {activity?.outcome && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {activity?.outcome}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "notes" && (
                    <div className="p-6">
                      <div className="mb-4">
                        <h4 className="font-medium text-foreground mb-3">
                          Notes
                        </h4>
                        <div className="space-y-3">
                          <Input
                            placeholder="Add a note about this contact..."
                            value={newNote}
                            onChange={(e) => setNewNote(e?.target?.value)}
                          />
                          <Button
                            onClick={handleAddNote}
                            disabled={!newNote?.trim()}
                            size="sm"
                          >
                            <Icon name="Plus" size={16} className="mr-2" />
                            Add Note
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {mockNotes?.map((note) => (
                          <div
                            key={note?.id}
                            className="p-4 border border-border rounded-lg"
                          >
                            <p className="text-sm text-foreground mb-2">
                              {note?.content}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{note?.author}</span>
                              <span>
                                {note?.date} at {note?.time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* for edit */}
            {mode === "edit" && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Salutation
                    </label>
                    <select
                      name="salutationName"
                      value={formData?.salutationName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Select</option>
                      {TYPE.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      First Name
                    </label>
                    <Input
                      name="firstName"
                      value={formData?.firstName}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Last name
                    </label>
                    <Input
                      name="lastname"
                      type="text"
                      value={formData?.lastname}
                      onChange={handleInputChange}
                      placeholder="Developer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <Input
                    name="emailAddress"
                    type="text"
                    value={formData?.emailAddress}
                    onChange={handleInputChange}
                    placeholder="example@gmail.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Account Name
                    </label>
                    <select
                      name="accountId"
                      value={formData?.accountId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Select</option>
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <Input
                      name="phoneNumber"
                      type="tel"
                      value={formData?.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+919807809876"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Address
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        name="addressStreet"
                        type="text"
                        value={formData?.addressStreet}
                        onChange={handleInputChange}
                        placeholder="Street"
                      />
                    </div>
                    <div>
                      <Input
                        name="addressCity"
                        type="text"
                        value={formData?.addressCity}
                        onChange={handleInputChange}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Input
                        name="addressState"
                        type="text"
                        value={formData?.addressState}
                        onChange={handleInputChange}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Input
                        name="addressPostalCode"
                        type="text"
                        value={formData?.addressPostalCode}
                        onChange={handleInputChange}
                        placeholder="Postal Code"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        name="addressCountry"
                        type="text"
                        value={formData?.addressCountry}
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
                        Teams
                      </label>
                      <Input
                        name="team"
                        value={formData?.team}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Developer"
                      />
                    </div>
                  </div>
                </div>

                <textarea
                  name="description"
                  value={formData?.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the company..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Contact"}
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactDrawer;
