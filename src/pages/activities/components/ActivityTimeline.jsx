import React, { useState, useMemo } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const ActivityTimeline = ({ activities, onEdit, onComplete, onReschedule }) => {
  /* =======================
     PAGINATION (ADDED)
  ======================= */
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // same feel like AccountsTable

  const totalPages = Math.ceil((activities?.length || 0) / pageSize);

  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return activities?.slice(start, start + pageSize);
  }, [activities, currentPage]);

  /* =======================
     EXISTING HELPERS (UNCHANGED)
  ======================= */
  const getActivityIcon = (type) => {
    const iconMap = {
      task: "CheckSquare",
      call: "Phone",
      meeting: "Calendar",
      email: "Mail",
      note: "FileText",
    };
    return iconMap?.[type] || "Circle";
  };

  const getActivityColor = (type) => {
    const colorMap = {
      task: "text-blue-600",
      call: "text-green-600",
      meeting: "text-purple-600",
      email: "text-orange-600",
      note: "text-gray-600",
    };
    return colorMap?.[type] || "text-gray-600";
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate, completed) => {
    if (completed) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* =======================
          ACTIVITIES (ONLY THIS MAP REPLACED)
      ======================= */}
      {paginatedActivities?.map((activity, index) => (
        <div key={activity?.id} className="relative">
          {/* Timeline line */}
          {index < paginatedActivities?.length - 1 && (
            <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
          )}

          <div className="flex items-start space-x-4">
            {/* Activity icon */}
            <div
              className={`
                flex-shrink-0 w-12 h-12 rounded-full border-2 border-background shadow-sm
                flex items-center justify-center
                ${activity?.completed ? "bg-success text-success-foreground" : "bg-muted"}
              `}
            >
              <Icon
                name={
                  activity?.completed
                    ? "Check"
                    : getActivityIcon(activity?.type)
                }
                size={20}
                className={
                  activity?.completed
                    ? "text-success-foreground"
                    : getActivityColor(activity?.type)
                }
              />
            </div>

            {/* Activity content */}
            <div className="flex-1 min-w-0">
              <div className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`
                          px-2 py-1 text-xs font-medium rounded-full capitalize
                          ${activity?.type === "task" ? "bg-blue-100 text-blue-800" : ""}
                          ${activity?.type === "call" ? "bg-green-100 text-green-800" : ""}
                          ${activity?.type === "meeting" ? "bg-purple-100 text-purple-800" : ""}
                          ${activity?.type === "email" ? "bg-orange-100 text-orange-800" : ""}
                          ${activity?.type === "note" ? "bg-gray-100 text-gray-800" : ""}
                        `}
                      >
                        {activity?.type}
                      </span>

                      {activity?.priority && (
                        <span
                          className={`
                            px-2 py-1 text-xs font-medium rounded-full
                            ${activity?.priority === "high" ? "bg-red-100 text-red-800" : ""}
                            ${activity?.priority === "medium" ? "bg-yellow-100 text-yellow-800" : ""}
                            ${activity?.priority === "low" ? "bg-gray-100 text-gray-800" : ""}
                          `}
                        >
                          {activity?.priority} priority
                        </span>
                      )}

                      {isOverdue(activity?.dueDate, activity?.completed) && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Overdue
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-medium text-foreground mb-1">
                      {activity?.title}
                    </h3>

                    {activity?.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {activity?.description}
                      </p>
                    )}

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={14} />
                        <span>{formatDate(activity?.dueDate)}</span>
                      </div>

                      {activity?.contact && (
                        <div className="flex items-center space-x-1">
                          <Icon name="User" size={14} />
                          <span>{activity?.contact}</span>
                        </div>
                      )}

                      {activity?.account && (
                        <div className="flex items-center space-x-1">
                          <Icon name="Building2" size={14} />
                          <span>{activity?.account}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-1">
                        <Icon name="User" size={14} />
                        <span>Assigned to {activity?.owner}</span>
                      </div>
                    </div>

                    {activity?.notes && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          {activity?.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center space-x-1 ml-4">
                    {!activity?.completed && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onComplete(activity?.id)}
                        className="h-8 w-8"
                      >
                        <Icon name="Check" size={16} />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(activity)}
                      className="h-8 w-8"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>

                    {!activity?.completed && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onReschedule(activity)}
                        className="h-8 w-8"
                      >
                        <Icon name="Clock" size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* =======================
          PAGINATION (ONLY ONCE)
      ======================= */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
