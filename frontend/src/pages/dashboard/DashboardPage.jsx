import React from "react";
import DashboardManager from "../../components/dashboard/DashboardManager";

const DashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <DashboardManager />
    </div>
  );
};

export default DashboardPage;
