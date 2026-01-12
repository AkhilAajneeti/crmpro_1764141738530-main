import React, { useState, useMemo } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";

const DealsTable = ({
  deals,
  selectedDeals,
  onSelectDeal,
  onSelectAll,
  onDealClick,
  sortConfig,
  onSort,
  currentPage,
  itemsPerPage,
  onDelete,
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(amount);
  };

  const formatDate = (date) => {
    if (!date) return "—"; // null / undefined / empty

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) return "—"; // invalid date
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })?.format(new Date(date));
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

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return "text-green-600";
    if (probability >= 60) return "text-yellow-600";
    if (probability >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) {
      return (
        <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />
      );
    }
    return sortConfig?.direction === "asc" ? (
      <Icon name="ArrowUp" size={16} className="text-primary" />
    ) : (
      <Icon name="ArrowDown" size={16} className="text-primary" />
    );
  };

  const handleQuickAction = (e, action, deal) => {
    e?.stopPropagation();
    onDealClick(deal);
    console.log(`${action} action for deal:`, deal?.id);
  };
  const handleDelete = async (e, deal) => {
    e.stopPropagation();
    const ok = window.confirm(`Delete Task ${deal?.name}?`);
    if (!ok) return;

    await onDelete(deal.id); // 👈 parent ko bol rahe ho
  };

  const paginatedDeals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return deals?.slice(startIndex, startIndex + itemsPerPage);
  }, [deals, currentPage, itemsPerPage]);

  const isAllSelected =
    selectedDeals?.length === paginatedDeals?.length &&
    paginatedDeals?.length > 0;
  const isIndeterminate =
    selectedDeals?.length > 0 && selectedDeals?.length < paginatedDeals?.length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort("name")}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Project Name</span>
                  {getSortIcon("name")}
                </button>
              </th>

              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort("Status")}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Status</span>
                  {getSortIcon("owner")}
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort("Source")}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Priority</span>
                  {getSortIcon("value")}
                </button>
              </th>

              <th className="text-left px-4 py-3">
                <span className="text-sm font-medium text-foreground">
                  Assigned User
                </span>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort("createdAt")}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Create By</span>
                  {getSortIcon("closeDate")}
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort("createdAt")}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Modified At</span>
                  {getSortIcon("closeDate")}
                </button>
              </th>
              <th className="w-24 px-4 py-3">
                <span className="text-sm font-medium text-foreground">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedDeals?.map((deal) => (
              <tr
                key={deal?.id}
                onMouseEnter={() => setHoveredRow(deal?.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className="hover:bg-muted/30 cursor-pointer transition-smooth"
              >
                <td className="px-4 py-4">
                  <Checkbox
                    checked={selectedDeals?.includes(deal?.id)}
                    onChange={(e) => {
                      e?.stopPropagation();
                      onSelectDeal(deal?.id, e?.target?.checked);
                    }}
                  />
                </td>
                <td className="px-4 py-4" onClick={() => onDealClick(deal)}>
                  <div className="font-medium text-foreground">
                    {deal?.name}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div
                    className={`flex justify-center items-center space-x-2 px-2 py-1 font-medium rounded-full ${getStageColor(
                      deal?.status
                    )}`}
                  >
                    <span className={`text-sm text-foreg roundunded-full `}>
                      {deal?.status}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-4">
                  <div className="text-foreground">{deal?.priority}</div>
                </td>

                <td className="px-4 py-4">
                  <div
                    className={`text-sm font-medium ${getProbabilityColor(
                      deal?.assignedUserName
                    )}`}
                  >
                    {deal?.assignedUserName}
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">
                    {formatDate(deal?.createdAt)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">
                    {formatDate(deal?.modifiedAt)}
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div
                    className={`flex items-center space-x-1 transition-opacity ${
                      hoveredRow === deal?.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleQuickAction(e, "edit", deal)}
                      className="h-8 w-8"
                    >
                      <Icon name="Edit" size={14} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDelete(e, deal)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {paginatedDeals?.map((deal) => (
          <div
            key={deal?.id}
            onClick={() => onDealClick(deal)}
            className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:shadow-elevation-1 transition-smooth"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedDeals?.includes(deal?.id)}
                  onChange={(e) => {
                    e?.stopPropagation();
                    onSelectDeal(deal?.id, e?.target?.checked);
                  }}
                />
                <div>
                  <h3 className="font-medium text-foreground">{deal?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {deal?.account}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStageColor(
                  deal?.stage
                )}`}
              >
                {deal?.stage}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Value</p>
                <p className="font-medium text-foreground">
                  {formatCurrency(deal?.value)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Probability</p>
                <p
                  className={`font-medium ${getProbabilityColor(
                    deal?.probability
                  )}`}
                >
                  {deal?.probability}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Owner</p>
                <p className="text-sm text-foreground">{deal?.owner}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Close Date</p>
                <p className="text-sm text-foreground">
                  {formatDate(deal?.closeDate)}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleQuickAction(e, "edit", deal)}
              >
                <Icon name="Edit" size={14} className="mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleQuickAction(e, "clone", deal)}
              >
                <Icon name="Copy" size={14} className="mr-1" />
                Clone
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealsTable;
