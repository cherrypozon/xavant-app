'use client';

import React from "react";
import {
    LayoutDashboard,
    Video,
    Users,
    ShieldCheck,
    Sparkles,
    AlertCircle,
    UserCircle,
    Settings,
} from "lucide-react";

const Sidebar = ({ activeView, onNavigate, collapsed, onToggleCollapse }) => {
    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "smart-cameras", label: "Smart Cameras", icon: Video },
        { id: "people-counter", label: "People Counter", icon: Users },
        { id: "safekeep", label: "Safekeep", icon: ShieldCheck },
        { id: "cleantrack", label: "Cleantrack", icon: Sparkles },
        { id: "emergency", label: "Emergency", icon: AlertCircle },
    ];

    const bottomMenuItems = [
        { id: "profile", label: "Profile", icon: UserCircle },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    return (
        <div
            className={`h-screen flex flex-col border-r border-border ${collapsed ? "w-20" : "w-64"
                }`}
        >
            {/* --- Logo Section --- */}
            <div className="p-6 flex items-center justify-between">
                <img
                    src={collapsed ? "/showSidebar.svg" : "/xavant_logo_2.png"}
                    alt="Xavant Logo"
                    className={`${collapsed ? "h-5 cursor-pointer ml-3.5" : "h-8"}`}
                    onClick={collapsed ? onToggleCollapse : undefined}
                />

                {!collapsed && (
                    <button className="text-muted hover:text-foreground cursor-pointer" onClick={onToggleCollapse}>
                        <img src="/hide_button.png" alt="Collapse" className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* --- Main Navigation --- */}
            <nav className="flex-1 py-6 pl-3 pr-0 overflow-y-auto">
                {/* Group 1 */}
                <ul className="space-y-8 pb-4">
                    {menuItems.slice(0, 2).map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.id;

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => onNavigate(item.id)}
                                    className={`
                    w-full flex items-center gap-3 pl-3 pr-0 py-0 text-left cursor-pointer
                    ${isActive
                                            ? "text-active border-r-2 border-active"
                                            : "text-muted hover:text-active border-r-2 border-transparent"
                                        }
                    ${collapsed ? "justify-center" : ""}
                  `}
                                >
                                    <Icon className="w-5 h-5" />
                                    {!collapsed && <span className="text-sm">{item.label}</span>}
                                </button>
                            </li>
                        );
                    })}
                </ul>
                {(activeView !== "dashboard" && activeView !== 'emergency') && <div className="border-b border-border mx-3 my-2"></div>}


                {/* Group 2 */}
                {(activeView !== "dashboard" && activeView !== 'emergency') && (
                    <>
                        <ul className="space-y-8 py-4">
                            {menuItems.slice(2, 5).map((item) => {
                                const Icon = item.icon;
                                const isActive = activeView === item.id;

                                return (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => onNavigate(item.id)}
                                            className={`
                                w-full flex items-center gap-3 pl-3 pr-0 py-0 text-left cursor-pointer
                                ${isActive ? "text-active border-r-2 border-active" : "text-muted hover:text-active border-r-2 border-transparent"}
                                ${collapsed ? "justify-center" : ""}
                            `}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {!collapsed && <span className="text-sm">{item.label}</span>}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="border-b border-border mx-3 py-2"></div>
                    </>
                )}


                {/* Group 3 */}
                <ul className="space-y-8 py-4">
                    {menuItems.slice(5, 6).map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.id;

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => onNavigate(item.id)}
                                    className={`
                    w-full flex items-center gap-3 pl-3 pr-0 py-0 text-left cursor-pointer
                    ${isActive
                                            ? "text-active border-r-2 border-active"
                                            : "text-muted hover:text-active border-r-2 border-transparent"
                                        }
                    ${collapsed ? "justify-center" : ""}
                  `}
                                >
                                    <Icon className="w-5 h-5" />
                                    {!collapsed && <span className="text-sm">{item.label}</span>}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="border-b border-border mx-3"></div>

            {/* --- Bottom Navigation --- */}
            <div className="py-6 pl-3 pr-0">
                <ul className="space-y-8">
                    {bottomMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.id;

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => onNavigate(item.id)}
                                    className={`
                    w-full flex items-center gap-3 pl-3 pr-0 py-0 text-left cursor-pointer
                    ${isActive
                                            ? "text-active border-r-2 border-active"
                                            : "text-muted hover:text-active border-r-2 border-transparent"
                                        }
                    ${collapsed ? "justify-center" : ""}
                  `}
                                >
                                    <Icon className="w-5 h-5" />
                                    {!collapsed && <span className="text-sm">{item.label}</span>}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;