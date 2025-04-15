import React from 'react';
import {
  UsersIcon,
  CalendarIcon,
  BriefcaseIcon,
  PlusCircleIcon,
  NewspaperIcon,
  ChartBarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

  export default function EmployeeAdminDashboard() {
      //hello
    return (
        <div className="p-6 space-y-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800">Employee Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Employee Statistics */}
          <StatCard title="Total Employees" value="1,234" icon={<UsersIcon />} subtext="+5% from last month" />
          <StatCard title="On Leave Today" value="27" icon={<CalendarIcon />} subtext="3% of workforce" />
          <StatCard title="Open Positions" value="12" icon={<BriefcaseIcon />} subtext="Across 5 departments" />
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Leave Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Leave Information</h2>
            <div className="space-y-4">
              <InfoItem icon={<CalendarIcon />} text="Pending Approvals: 15" />
              <InfoItem icon={<ClockIcon />} text="Upcoming Leaves: 23" />
              <InfoItem icon={<ChartBarIcon />} text="Leave Balance Report" />
            </div>
          </div>
  
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <ActionButton primary icon={<PlusCircleIcon />} text="New Employee" />
              <ActionButton icon={<CalendarIcon />} text="Approve Leave" />
              <ActionButton icon={<BriefcaseIcon />} text="Post Job" />
              <ActionButton icon={<ChartBarIcon />} text="Run Reports" />
            </div>
          </div>
        </div>
  
        {/* Company News */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Company News</h2>
          <div className="space-y-4">
            {[
              "Annual company picnic scheduled for next month",
              "New health insurance plans available for enrollment",
              "Q3 financial results exceed expectations",
              "Employee satisfaction survey results are in",
            ].map((news, index) => (
              <NewsItem key={index} text={news} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  function StatCard({ title, value, icon, subtext }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <span className="text-gray-400">{icon}</span>
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500">{subtext}</p>
      </div>
    );
  }
  
  function InfoItem({ icon, text }) {
    return (
      <div className="flex items-center">
        <span className="text-gray-400 mr-2">{icon}</span>
        <span>{text}</span>
      </div>
    );
  }
  
  function ActionButton({ primary, icon, text }) {
    return (
      <button
        className={`flex items-center justify-center px-4 py-2 rounded ${
          primary
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        } transition-colors duration-200`}
      >
        <span className="mr-2">{icon}</span>
        {text}
      </button>
    );
  }
  
  function NewsItem({ text }) {
    return (
      <div className="flex items-start">
        <NewspaperIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
        <span>{text}</span>
      </div>
    );
  }
  
  