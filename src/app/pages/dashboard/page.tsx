"use client";

import type React from "react";
import MainLayout from "../../components/MainLayout";

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Sample dashboard widgets */}
          <div className="bg-blue-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800">Total Requests</h2>
            <p className="text-3xl font-bold text-blue-600">150</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800">Approved Requests</h2>
            <p className="text-3xl font-bold text-green-600">120</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-yellow-800">Pending Requests</h2>
            <p className="text-3xl font-bold text-yellow-600">30</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
