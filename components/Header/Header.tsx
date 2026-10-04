"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  User as UserIcon,
  Shield,
  LogOut,
  ChevronDown,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import { useCart } from "@/components/Cart/CartContext";
import { useAuth } from "@/components/Auth/AuthContext";

export default function Header() {
  const router = useRouter();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
      setMobileSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-zinc-950/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-white"
            >
              <span className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-black text-sm">
                TS
              </span>
              <span>Tâm Store</span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
              <Link
                href="/"
                prefetch={true}
                className="hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Trang chủ
              </Link>
              <Link
                href="/products"
                prefetch={true}
                className="hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Sản phẩm
              </Link>
              <Link
                href="/products?category=all"
                prefetch={true}
                className="hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Danh mục
              </Link>
              <Link
                href="/products?featured=true"
                prefetch={true}
                className="hover:text-zinc-900 dark:hover:text-white transition-colors text-amber-600 dark:text-amber-400"
              >
                Khuyến mãi
              </Link>
            </nav>
          </div>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center flex-1 max-w-sm relative"
          >
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm kiếm điện thoại, laptop, phụ kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-colors"
            />
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="lg:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <Link
              href="/cart"
              prefetch={true}
              className="relative p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* Light / Dark Mode Toggle */}
            <ThemeToggle />

            {/* User Account / Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-sm font-medium text-zinc-800 dark:text-zinc-200 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-zinc-500" />
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {user.name.split(" ").slice(-1)[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg py-1 z-50 text-sm animate-in fade-in duration-100"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3.5 py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="font-semibold text-zinc-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>

                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        prefetch={true}
                        className="flex items-center gap-2 px-3.5 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 font-medium"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Trang Quản Trị</span>
                      </Link>
                    )}

                    <Link
                      href="/profile"
                      prefetch={true}
                      className="flex items-center gap-2 px-3.5 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Thông tin tài khoản</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-left border-t border-zinc-100 dark:border-zinc-800 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <Link
                  href="/login"
                  prefetch={true}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Đăng nhập
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay Bar */}
        {mobileSearchOpen && (
          <form
            onSubmit={handleSearch}
            className="lg:hidden pb-3 pt-1 flex items-center gap-2 animate-in fade-in duration-100"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                placeholder="Tìm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-medium"
            >
              Tìm
            </button>
          </form>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-5 space-y-4 animate-in slide-in-from-top duration-150">
          <nav className="flex flex-col space-y-3 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white py-1"
            >
              Trang chủ
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white py-1"
            >
              Tất cả sản phẩm
            </Link>
            <Link
              href="/products?featured=true"
              onClick={() => setMobileMenuOpen(false)}
              className="text-amber-600 dark:text-amber-400 py-1"
            >
              Khuyến mãi nổi bật
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white py-1 flex items-center justify-between"
            >
              <span>Giỏ hàng</span>
              {totalItems > 0 && (
                <span className="px-2 py-0.5 text-xs bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
            {user ? (
              <div className="space-y-3">
                <div className="text-xs text-zinc-500">
                  Đăng nhập với: <span className="font-semibold text-zinc-900 dark:text-white">{user.name}</span>
                </div>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2 px-3 text-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-sm font-medium"
                  >
                    Vào Trang Quản Trị (Admin)
                  </Link>
                )}
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2 px-3 text-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-800 dark:text-zinc-200"
                >
                  Tài khoản của tôi
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full py-2 px-3 text-center text-sm font-medium text-red-600 dark:text-red-400"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-800 dark:text-zinc-200"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-3 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
