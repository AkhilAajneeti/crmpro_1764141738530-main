import React, { useState, useMemo, useEffect } from "react";
import Papa from "papaparse";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import AccountsTable from "./components/AccountsTable";
import AccountsFilters from "./components/AccountsFilters";
import AccountDrawer from "./components/AccountDrawer";
import { deleteAccount, fetchAccounts } from "services/account.service";

const AccountsPage = () => {
  const [mockAccounts, setmockAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [drawerMode, setDrawerMode] = useState("view");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    industry: "",
    revenue: "",
    region: "",
  });
  useEffect(() => {
    const loadAccount = async () => {
      try {
        const data = await fetchAccounts();
        setmockAccounts(data.list);
        console.log(data.list);
      } catch (error) {
        console.log("failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    loadAccount();
  }, []);

  const handleAccountSuccess = async () => {
    try {
      setLoading(true);
      const data = await fetchAccounts();
      setmockAccounts(data.list); // refresh table
    } catch (error) {
      console.error("Failed to refresh accounts", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter accounts based on active filters
  const filteredAccounts = useMemo(() => {
    return mockAccounts?.filter((account) => {
      if (
        filters?.industry &&
        account?.industry?.toLowerCase() !== filters?.industry
      ) {
        return false;
      }

      if (filters?.revenue) {
        const revenue = parseFloat(account?.revenue?.replace(/[$,]/g, ""));
        switch (filters?.revenue) {
          case "0-1M":
            if (revenue >= 1000000) return false;
            break;
          case "1M-10M":
            if (revenue < 1000000 || revenue >= 10000000) return false;
            break;
          case "10M-50M":
            if (revenue < 10000000 || revenue >= 50000000) return false;
            break;
          case "50M-100M":
            if (revenue < 50000000 || revenue >= 100000000) return false;
            break;
          case "100M+":
            if (revenue < 100000000) return false;
            break;
        }
      }

      if (filters?.region && account?.region !== filters?.region) {
        return false;
      }

      return true;
    });
  }, [mockAccounts, filters]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleRowClick = (account) => {
    setSelectedAccount(account);
    setIsDrawerOpen(true);
    setDrawerMode("view");
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedAccount(null);
    setDrawerMode("view");
  };

  const handleBulkAction = async (action, ids) => {
    if (action !== "delete") return;

    const validIds = ids.filter(Boolean); // remove undefined/null

    if (validIds.length === 0) {
      alert("No valid account IDs");
      return;
    }

    if (!window.confirm(`Delete ${validIds.length} accounts?`)) return;

    try {
      console.log("DELETE IDS:", ids);

      for (const id of validIds) {
        await deleteAccount(id);
      }

      setmockAccounts((prev) =>
        prev.filter((acc) => !validIds.includes(acc.id))
      );
    } catch (error) {
      console.error("Bulk delete failed:", error);
      alert("Failed to delete accounts");
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleAccountButton = () => {
    setSelectedAccount(null);
    setDrawerMode("create");

    setIsDrawerOpen(true);
  };

  const handleExportAccount = () => {
    try {
      if (!filteredAccounts || filteredAccounts.length === 0) {
        alert("No Account To Export");
        return;
      }
      const exportData = filteredAccounts.map((account) => ({
        Name: account?.name || "",
        Industry: account?.industry || "",
        Website: account?.website || "",
        Phone: account?.phoneNumber || "",

        "Billing Street": account?.billingAddressStreet || "",
        "Billing City": account?.billingAddressCity || "",
        "Billing State": account?.billingAddressState || "",
        "Billing Country": account?.billingAddressCountry || "",
        "Billing Postal Code": account?.billingAddressPostalCode || "",

        Type: account?.type || "",
        Description: account?.description || "",
        "Created By": account?.createdByName || "",
        "Created At": account?.createdAt || "",
      }));

      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `accounts_export_${
        new Date().toISOString().split("T")[0]
      }.csv`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      alert(`Successfully exported ${exportData.length} accounts`);
    } catch (error) {
      console.error("Error exporting accounts:", error);
      alert("Failed to export accounts. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuToggle={handleSidebarToggle}
        isSidebarOpen={isSidebarOpen}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <main className="lg:ml-64 pt-16">
        <div className="p-4 lg:p-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Accounts
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your customer companies and relationships
              </p>
            </div>

            <div className="flex items-center flex-wrap space-x-3 mt-4 sm:mt-0">
              <Button className="hidden" variant="outline" onClick={handleExportAccount}>
                <Icon name="Upload" size={16} className="mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Icon name="Upload" size={16} className="mr-2" />
                Import
              </Button>
              <Button onClick={handleAccountButton}>
                <Icon name="Plus" size={16} className="mr-2" />
                Add Account
              </Button>
            </div>
          </div>

          {/* Filters */}
          <AccountsFilters
            onFiltersChange={handleFiltersChange}
            activeFilters={filters}
            resultCount={filteredAccounts?.length}
          />

          {/* Accounts Table */}
          <AccountsTable
            accounts={filteredAccounts}
            onRowClick={handleRowClick}
            onBulkAction={handleBulkAction}
          />
        </div>
      </main>
      {/* Account Details Drawer */}
      <AccountDrawer
        account={selectedAccount}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onSuccess={handleAccountSuccess}
        mode={drawerMode}
      />
    </div>
  );
};

export default AccountsPage;
