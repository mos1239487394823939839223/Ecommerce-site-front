"use client";

import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  trend,
  bgColor = "bg-blue-500" 
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}>
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}% from last month</span>
            </p>
          )}
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </div>
  );
}

