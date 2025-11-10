"use client";

import { FaEdit, FaTrash, FaImage } from "react-icons/fa";
import DataTable, { Column } from "./DataTable";

interface Banner {
  _id: string;
  name: string;
  image: string;
  link: string;
  isActive?: boolean;
  order?: number;
  createdAt?: string;
}

interface BannersTableProps {
  banners: Banner[];
  loading?: boolean;
  onEdit?: (banner: Banner) => void;
  onDelete?: (banner: Banner) => void;
}

export default function BannersTable({
  banners,
  loading = false,
  onEdit,
  onDelete,
}: BannersTableProps) {
  const columns: Column<Banner>[] = [
    {
      header: "Image",
      accessor: (row) => (
        <div className="flex items-center">
          <img
            src={row.image || "/placeholder.svg"}
            alt={row.name}
            className="w-24 h-16 object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
      ),
      className: "w-32",
    },
    {
      header: "Name",
      accessor: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500 truncate max-w-xs">
            {row.link || "N/A"}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.isActive !== false
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.isActive !== false ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Order",
      accessor: (row) => (
        <div className="text-center">
          <span className="px-2 py-1 bg-gray-100 rounded text-sm font-medium">
            {row.order || 0}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Edit"
            >
              <FaEdit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row);
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
      className: "w-32",
    },
  ];

  return (
    <DataTable
      data={banners}
      columns={columns}
      loading={loading}
      emptyMessage="No banners found. Click 'Add Banner' to create your first banner."
    />
  );
}

