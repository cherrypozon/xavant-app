"use client";
import React from "react";
import Header from "../components/Header/main";
import Body from "./body/main";
import Footer from "../components/Footer/main";

function Dashboard() {
return (
    <div className="p-10 w-full h-screen flex flex-col gap-12 overflow-y-scroll no-scrollbar">
        <Header />
            <Body />
        <Footer />
    </div>
    );
}

export default Dashboard;
