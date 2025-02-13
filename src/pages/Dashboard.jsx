import { useState } from 'react';
import { ChartBarIcon, TruckIcon, UserGroupIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const stats = [
  { name: 'Total Vendors', value: '12', icon: BuildingOfficeIcon },
  { name: 'Active Drivers', value: '156', icon: UserGroupIcon },
  { name: 'Total Vehicles', value: '89', icon: TruckIcon },
  { name: 'Completed Trips', value: '1,248', icon: ChartBarIcon },
];

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}