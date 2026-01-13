import React, { useEffect, useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Input from "components/ui/Input";
import toast from "react-hot-toast";
import Avatar from "react-avatar";
import { fetchUser } from "services/user.service";
import { fetchTeam } from "services/team.service";
import {
  createLeadActivity,
  leadActivitesById,
  leadStreamById,
} from "services/leads.service";

const DealDrawer = ({
  deal,
  isOpen,
  onClose,
  mode,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]);
  const [team, setTeam] = useState([]);
  const [mockStream, setmockStream] = useState([]);
  const [mockActivities, setActivities] = useState([]);
  const [showActivityForm, setActivityForm] = useState(false);
  const [activityText, setActivityText] = useState("");
  const [postingActivity, setPostingActivity] = useState(false);
  const [expandedActivityId, setExpandedActivityId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailAddress: "",
    whatsapp: "",
    addressCity: "",
    cProjectName: "",
    cNextContact: "",
    cQuestion: "",
    assignedUserId: "",
    teamId: "",
    status: "",
    source: "",
    description: "",
  });
  useEffect(() => {
    if (mode === "add") {
      setFormData({
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        phoneNumber: formData.phoneNumber || "",
        emailAddress: formData.emailAddress || "",
        whatsapp: formData.whatsapp || "",
        addressCity: formData.addressCity || "",
        cProjectName: formData.cProjectName || "",
        cNextContact: formData.cNextContact || "",

        cQuestion: formData.cQuestion || "",
        assignedUserId: formData.assignedUserId || "",
        teamId: formData.teamId || "",
        status: formData.status || "",
        source: formData.source || "",
        description: formData.description || "",
      });
    } else if (deal) {
      setFormData(deal);
    }
  }, [deal, mode]);

  const STATUS_OPTIONS = [
    { value: "New", label: "New" },
    { value: "Converted", label: "Converted" },
    { value: "Dead", label: "Dead" },
    { value: "Call Later", label: "Call Later" },
    { value: "Call Not Connecting", label: "Call Not Connecting" },
    { value: "Call Not Picked", label: "Call Not Picked" },
    { value: "Follow up", label: "Follow up" },
    { value: "Interested", label: "Interested" },
    { value: "Low Budget | Low Intent", label: "Low Budget | Low Intent" },
  ];
  const SOURCE_OPTIONS = [
    { value: "Call", label: "Call" },
    { value: "Existing Customer", label: "Existing Customer" },
    { value: "Facebook", label: "Facebook" },
    { value: "Import", label: "Import" },
    { value: "IVR", label: "IVR" },
    { value: "Web Site", label: "Web Site" },
  ];
  const toggleActivity = (id) => {
    setExpandedActivityId((prev) => (prev === id ? null : id));
  };
  // if (!isOpen) return null;

  const formatDate = (date) => {
    if (!date) return "—";

    const safeDate = date.replace(" ", "T"); // 👈 key fix
    const parsed = new Date(safeDate);

    if (isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  const formatDateTime = (value) => {
  if (!value) return "—";

  const safe = value.replace(" ", "T"); // EspoCRM fix
  const date = new Date(safe);

  if (isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


  const getStageColor = (stage) => {
    const colors = {
      New: "bg-blue-100 text-blue-800",
      Interested: "bg-sky-100 text-sky-800",
      "Follow up": "bg-indigo-100 text-indigo-800",
      Converted: "bg-green-100 text-green-800",
      "Not interested": "bg-orange-100 text-orange-800",
      Broker: "bg-purple-100 text-purple-800",
      "Call Not Picked": "bg-red-100 text-red-800",
      Invalid: "bg-gray-100 text-gray-700",
    };
    return colors?.[stage] || "bg-gray-100 text-gray-800";
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "Eye" },
    { id: "AssignedUsers", label: "Assigned User", icon: "Users" },
    { id: "Stream", label: "Stream", icon: "Calendar" },
    { id: "Activity", label: "Activity", icon: "FileText" },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "Post":
        return "MessageSquare";
      case "Update":
        return "RefreshCcw";
      case "Assign":
        return "UserPlus";
      case "Create":
        return "PlusCircle";
      default:
        return "Activity";
    }
  };

  const getActivityIconColor = (type) => {
    switch (type) {
      case "Post":
        return "text-indigo-600";
      case "Update":
        return "text-blue-600";
      case "Assign":
        return "text-purple-600";
      case "Create":
        return "text-green-600";
      default:
        return "text-gray-500";
    }
  };

  const getActivityMessage = (activity) => {
    const { type, post, data, createdByName } = activity;

    if (type === "Post") {
      return post;
    }

    if (type === "Assign") {
      return `Assigned to ${data?.assignedUserName}`;
    }

    if (type === "Create") {
      return "Lead was created";
    }

    if (type === "Update") {
      if (data?.value) {
        return `Status updated to ${data.value}`;
      }
      return "Lead updated";
    }
    if (activity._scope === "Call") {
      return `${activity.direction || "Call"} call scheduled`;
    }

    if (activity._scope === "Meeting") {
      return "Meeting scheduled";
    }

    return "Activity updated";
  };

  const handleStageAdvance = () => {
    console.log("Advancing stage for deal:", deal?.id);
  };

  const handleScheduleActivity = () => {
    console.log("Scheduling activity for deal:", deal?.id);
  };
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      cNextContact: toEspoDateTime(formData.cNextContact),
    };
    try {
      if (mode === "add") {
        await onCreate(payload);
      } else {
        await onUpdate(deal.id, payload);
      }

      setIsEditing(false);
      onClose(); // close drawer after success
    } catch (error) {
      console.error("Failed to save lead", error);
    }
  };

  // activity operation -------
  // fetching lead stream from id
  useEffect(() => {
    if (!isOpen || !deal?.id) return;

    const loadStream = async () => {
      try {
        const id = deal?.id;
        const res = await leadStreamById(id);
        console.log("LEAD DETAIL RESPONSE:", res);
        setmockStream(res.list || []);
      } catch (err) {
        console.error("Failed to fetch streams", err);
        toast.error("Failed to load activity");
      }
    };

    loadStream();
  }, [isOpen, deal?.id]);
  const handleDelete = async (e, activity) => {
    e.stopPropagation();
    const ok = window.confirm(`Delete Stream ${activity?.createdByName}?`);
    if (!ok) return;
    await onDelete(activity.id); // 👈 parent ko bol rahe ho
  };
  const createActivity = async () => {
    //post activity
    setActivityForm(true);
  };
  const handlePostActivity = async (e) => {
    e.preventDefault();

    if (!activityText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setPostingActivity(true);

      const payload = {
        post: activityText,
        parentId: deal.id, // 👈 ID PAYLOAD me
        parentType: "Lead", // 👈 MUST
        type: "Post",
        isInternal: false,
        attachmentsIds: [],
      };

      const newActivity = await createLeadActivity(payload);

      // 🔥 UI update instantly
      setmockStream((prev) => [newActivity, ...prev]);

      setActivityText("");
      setActivityForm(false);

      toast.success("Activity posted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post activity");
    } finally {
      setPostingActivity(false);
    }
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

  const showForm = mode === "add" || isEditing;
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const toEspoDateTime = (value) => {
    return value ? value.replace("T", " ") + ":00" : null;
  };

  // meeting , call , activities
  // activity operation -------
  // fetching lead stream from id
  useEffect(() => {
    if (!isOpen || !deal?.id) return;

    const loadActivity = async () => {
      try {
        const id = deal?.id;
        const res = await leadActivitesById(id);
        console.log("LEAD DETAIL RESPONSE:", res);
        setActivities(res.list || []);
      } catch (err) {
        console.error("Failed to fetch streams", err);
        toast.error("Failed to load activity");
      }
    };

    loadActivity();
  }, [isOpen, deal?.id]);

  useEffect(() => {
    if (!isOpen) {
      setmockStream([]);
    }
  }, [isOpen]);
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
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-foreground">
                {mode === "add"
                  ? "Add Lead"
                  : isEditing
                  ? "Edit Lead"
                  : deal?.name}
              </h2>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStageColor(
                  deal?.status
                )}`}
              >
                {deal?.stage}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (isEditing) {
                    setFormData(deal); // reset on cancel
                  }
                  setIsEditing(!isEditing);
                }}
              >
                <Icon name="Edit" size={16} className="mr-1" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {showForm && (
              <div className="p-6">
                {/* Lead Form Here */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* ================= Overview ================= */}
                  <div className="bg-card border border-border rounded-lg p-4 space-y-4">
                    {/* Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="First Name *"
                        value={formData.firstName || ""}
                        onChange={(e) =>
                          handleChange("firstName", e.target.value)
                        }
                      />
                      <Input
                        label="Last Name"
                        value={formData.lastName || ""}
                        onChange={(e) =>
                          handleChange("lastName", e.target.value)
                        }
                      />
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Phone"
                        value={formData.phoneNumber || ""}
                        onChange={(e) =>
                          handleChange("phoneNumber", e.target.value)
                        }
                      />
                      <Input
                        label="Email"
                        value={formData.emailAddress || ""}
                        onChange={(e) =>
                          handleChange("emailAddress", e.target.value)
                        }
                      />
                    </div>

                    {/* Whatsapp & City */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Whatsapp"
                        value={formData.whatsapp || ""}
                        onChange={(e) =>
                          handleChange("whatsapp", e.target.value)
                        }
                      />
                      <Input
                        label="City"
                        value={formData.addressCity || ""}
                        onChange={(e) =>
                          handleChange("addressCity", e.target.value)
                        }
                      />
                    </div>

                    {/* Project & Next Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Project Name"
                        value={formData.cProjectName || ""}
                        onChange={(e) =>
                          handleChange("cProjectName", e.target.value)
                        }
                      />
                      <Input
                        type="datetime-local"
                        label="Next Contact"
                        value={formData.cNextContact || ""}
                        onChange={(e) =>
                          handleChange("cNextContact", e.target.value)
                        }
                      />
                    </div>

                    <Input
                      label="cQuestion"
                      value={formData.cQuestion || ""}
                      onChange={(e) =>
                        handleChange("cQuestion", e.target.value)
                      }
                    />
                  </div>

                  {/* ================= Assigned User ================= */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
                      <Select
                        label="Assigned User"
                        value={formData.assignedUserId || ""}
                        options={userOptions} // 👉 later API se users
                        onChange={(value) =>
                          handleSelectChange("assignedUserId", value)
                        }
                      />
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
                      <Select
                        label="Teams"
                        value={formData.teamId || ""}
                        options={teamOptions} // 👉 later API se teams
                        onChange={(value) =>
                          handleSelectChange("teamId", value)
                        }
                      />
                    </div>
                  </div>

                  {/* ================= Details ================= */}
                  <div className="bg-card border border-border rounded-lg p-4 space-y-4">
                    <h3 className="font-medium text-foreground">Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Status"
                        value={formData.status || "New"}
                        options={STATUS_OPTIONS}
                        onChange={(value) => handleChange("status", value)}
                      />

                      <Select
                        label="Source"
                        value={formData.source || ""}
                        options={SOURCE_OPTIONS}
                        onChange={(value) => handleChange("source", value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <textarea
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        label="Description"
                        rows={4}
                        value={formData.description || ""}
                        placeholder="Description"
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* ================= Actions ================= */}
                  <div className="flex justify-end gap-3">
                    <Button type="submit">Save Lead</Button>
                  </div>
                </form>
              </div>
            )}
            {mode !== "add" && deal && (
              <>
                {/* Quick Actions */}
                <div className="flex items-center space-x-2 p-4 bg-muted/30 border-b border-border">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleStageAdvance}
                  >
                    <Icon name="ArrowRight" size={16} className="mr-1" />
                    Advance Stage
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleScheduleActivity}
                  >
                    <Icon name="Calendar" size={16} className="mr-1" />
                    Schedule Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icon name="Mail" size={16} className="mr-1" />
                    Schedule Meeting
                  </Button>
                </div>

                {/* Tabs */}
                <div className="flex items-center space-x-1 p-4 border-b border-border">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`
                  flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-smooth
                  ${
                    activeTab === tab?.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }
                `}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span>{tab?.label}</span>
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      {/* Deal Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Project name
                            </label>
                            <p className="text-foreground font-medium">
                              {deal?.cProjectName}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Phone Number
                            </label>
                            <p className="text-foreground font-medium text-lg">
                              {deal?.phoneNumber}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              City
                            </label>
                            <p className="text-foreground font-medium">
                              {deal?.addressCity}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Email
                            </label>
                            <p className="text-foreground font-medium text-lg">
                              {deal?.emailAddress}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Whatsapp
                            </label>
                            <p className="text-foreground font-medium text-lg">
                              {deal?.website}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Lead Received
                            </label>
                            <p className="text-foreground font-medium text-lg">
                              {formatDate(deal?.cLeadReceived)}
                            </p>
                          </div>
                          {/* <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Assigned User
                            </label>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-primary-foreground">
                                  {deal?.owner
                                    ?.split(" ")
                                    ?.map((n) => n?.[0])
                                    ?.join("")}
                                </span>
                              </div>
                              <span className="text-foreground">
                                {deal?.assignedUserName}
                              </span>
                            </div>
                          </div> */}
                          {/* <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Close Date
                            </label>
                            <p className="text-foreground">
                              {formatDate(deal?.closeDate)}
                            </p>
                          </div> */}
                          {/* {isEditing && (
                            <div>
                              <Select
                                label="Stage"
                                options={stageOptions}
                                value={deal?.stage}
                                onChange={(value) =>
                                  console.log("Stage changed to:", value)
                                }
                              />
                            </div>
                          )} */}
                        </div>
                      </div>
                      <hr />
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label htmlFor="">Description</label>
                          <p className="text-foreground mt-1">
                            {deal?.description ||
                              `Enterprise software solution for ${deal?.account} to streamline their operations and improve efficiency. This deal includes implementation, training, and ongoing support services.`}
                          </p>
                        </div>
                        <div>
                          <label htmlFor="">Preference</label>
                          <p className="text-foreground mt-1">
                            {deal?.cQuestion ||
                              `Enterprise software solution for ${deal?.cQuestion} to streamline their operations and improve efficiency. This deal includes implementation, training, and ongoing support services.`}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      {/* <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Description
                        </label>
                        {isEditing ? (
                          <textarea
                            className="w-full mt-1 p-3 border border-border rounded-lg resize-none"
                            rows={4}
                            defaultValue={
                              deal?.description ||
                              `Enterprise software solution for ${deal?.account} to streamline their operations and improve efficiency. This deal includes implementation, training, and ongoing support services.`
                            }
                          />
                        ) : (
                          <p className="text-foreground mt-1">
                            {deal?.description ||
                              `Enterprise software solution for ${deal?.account} to streamline their operations and improve efficiency. This deal includes implementation, training, and ongoing support services.`}
                          </p>
                        )}
                      </div> */}
                    </div>
                  )}

                  {activeTab === "Stream" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-foreground">
                          Recent Stream
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={createActivity}
                        >
                          <Icon name="Plus" size={16} className="mr-1" />
                          Add Stream
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {/* add activity form */}
                        {showActivityForm && (
                          <form onSubmit={handlePostActivity}>
                            <textarea
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              label="Activity"
                              rows={4}
                              placeholder="Write Your Comment Here..."
                              value={activityText}
                              onChange={(e) => setActivityText(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setActivityForm(false);
                                  setActivityText("");
                                }}
                              >
                                Cancel
                                <Icon
                                  name="XCircle"
                                  size={16}
                                  className="mr-1"
                                />
                              </Button>

                              <Button
                                type="submit"
                                size="sm"
                                disabled={postingActivity}
                              >
                                Post
                                <Icon name="Send" size={16} className="mr-1" />
                              </Button>
                            </div>
                          </form>
                        )}
                        {mockStream?.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex space-x-3 p-4 bg-muted/30 rounded-lg"
                          >
                            {/* AVATAR */}
                            <Avatar
                              name={activity.createdByName || "System"}
                              size="36"
                              round
                              textSizeRatio={2}
                              color={
                                activity.createdById === "system"
                                  ? "#9CA3AF"
                                  : undefined
                              }
                            />

                            {/* CONTENT */}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-medium text-foreground">
                                    {activity.createdByName || "System"}
                                  </h4>

                                  <Icon
                                    name={getActivityIcon(activity.type)}
                                    size={14}
                                    className={getActivityIconColor(
                                      activity.type
                                    )}
                                  />

                                  <span className="text-xs text-muted-foreground">
                                    {activity.type}
                                  </span>
                                </div>

                                <span className="text-xs text-muted-foreground">
                                  {formatDate(activity.createdAt)}
                                </span>
                                <div
                                  className={`flex items-center space-x-1 transition-opacity`}
                                >
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    // onClick={(e) =>
                                    //   handleQuickAction(e, "edit", deal)
                                    // }
                                    className="h-8 w-8"
                                  >
                                    <Icon name="Edit" size={14} />
                                  </Button>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => handleDelete(e, activity)}
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                  >
                                    <Icon name="Trash2" size={14} />
                                  </Button>
                                </div>
                              </div>

                              {/* MESSAGE */}
                              <p className="text-sm text-muted-foreground mt-1">
                                {getActivityMessage(activity)}
                              </p>

                              {/* STATUS BADGE */}
                              {activity?.data?.value && (
                                <span
                                  className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${getStageColor(
                                    activity.data.value
                                  )}`}
                                >
                                  {activity.data.value}
                                </span>
                              )}

                              {activity?.data?.statusValue && (
                                <span
                                  className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${getStageColor(
                                    activity.data.statusValue
                                  )}`}
                                >
                                  {activity.data.statusValue}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "AssignedUsers" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-foreground">
                          Assigned User
                        </h3>
                        <Button variant="outline" size="sm">
                          <Icon name="Plus" size={16} className="mr-1" />
                          Add Contact
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Name
                            </label>
                            <p className="text-foreground font-medium text-lg">
                              {deal?.assignedUserName}
                            </p>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Created
                            </label>
                            <p className="text-foreground font-medium text-lg">
                              {formatDate(deal?.createdAt)} :{" "}
                              {deal?.createdByName}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Modified
                            </label>
                            <p className="text-foreground font-medium text-lg">
                              {formatDate(deal?.modifiedAt)} :{" "}
                              {deal?.modifiedByName}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Follower
                            </label>
                            <p className="text-foreground font-medium text-lg">
                              {deal?.followersNames}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "Activity" && (
                    <div className="space-y-4">
                      {mockActivities?.map((activity) => (
                        <div
                          key={activity.id}
                          onClick={() => toggleActivity(activity.id)}
                          className={`cursor-pointer rounded-lg p-4 transition-all duration-300${
                            expandedActivityId === activity.id
                              ? "bg-muted shadow-sm"
                              : "bg-muted/30 hover:bg-muted"
                          }`}
                        >
                          {/*  */}
                          <div className="flex space-x-3">
                            <Avatar
                              name={activity.name || "System"}
                              size="36"
                              round
                              textSizeRatio={2}
                            />

                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
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
                                  {formatDate(activity.dateStart)}
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

                          {/*  */}
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              expandedActivityId === activity.id
                                ? "max-h-[600px] opacity-100 mt-4"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="border-t pt-4 text-sm text-muted-foreground">
                              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <div>
                                  <p className="text-xs">Direction</p>
                                  <p className="font-medium text-foreground">
                                    {activity.direction}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs">Assigned User</p>
                                  <p className="font-medium text-foreground">
                                    {activity.assignedUserName}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs">Date Start</p>
                                  <p className="font-medium text-foreground">
                                    {formatDateTime(activity.dateStart)}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs">Date End</p>
                                  <p className="font-medium text-foreground">
                                    {formatDateTime(activity.dateEnd)}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs">Duration</p>
                                  <p className="font-medium text-foreground">
                                    {Math.round(activity.duration / 60)} min
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs">Parent</p>
                                  <p className="font-medium text-primary">
                                    {activity.parentType}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs">Created</p>
                                  <p className="font-medium text-foreground">
                                    {formatDate(activity.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DealDrawer;
