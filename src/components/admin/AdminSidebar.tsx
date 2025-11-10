"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaTachometerAlt, 
  FaBox, 
  FaShoppingBag, 
  FaUsers, 
  FaTags, 
  FaStar,
  FaBars,
  FaTimes,
  FaLayerGroup,
  FaImage
} from "react-icons/fa";

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: FaTachometerAlt },
  { name: "Products", href: "/admin/products", icon: FaBox },
  { name: "Orders", href: "/admin/orders", icon: FaShoppingBag },
  { name: "Users", href: "/admin/users", icon: FaUsers },
  { name: "Categories", href: "/admin/categories", icon: FaTags },
  { name: "Subcategories", href: "/admin/subcategories", icon: FaLayerGroup },
  { name: "Brands", href: "/admin/brands", icon: FaStar },
  { name: "Banners", href: "/admin/banners", icon: FaImage },
];

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-gray-900 text-white z-50
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto lg:h-screen lg:sticky lg:top-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          w-64 flex-shrink-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <Link href="/admin" className="flex items-center gap-2 text-xl font-bold">
              <span className="text-green-500">Admin</span>
              <span>Panel</span>
            </Link>
            <button
              onClick={onToggle}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    // Close sidebar on mobile when navigating
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? "bg-green-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <FaBox className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

