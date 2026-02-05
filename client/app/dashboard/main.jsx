"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchDashboardData } from "../store/thunks/dashboardThunks";
import { useFullyLoaded } from "../hooks/useFullyLoaded";
import Header from "../components/Header/main";
import Body from "./body/main";
import Footer from "../components/Footer/main";
import DashboardSkeleton from "../components/Skeleton/DashboardSkeleton";

function Dashboard() {
  const dispatch = useAppDispatch();
  const { data, error } = useAppSelector((state) => state.dashboard);
  const { isFullyLoaded } = useFullyLoaded('dashboard');

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      console.log("Dashboard data:", data);
    }
  }, [data]);

  const renderBody = () => {
    if (!isFullyLoaded) {
      return <DashboardSkeleton />;
    }

    if (error) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-red-500">Error: {error}</div>
        </div>
      );
    }

    return <Body data={data} />;
  };

  return (
    <div className="p-10 w-full h-screen flex flex-col gap-12 overflow-y-scroll no-scrollbar">
      <Header />
      {renderBody()}
      <Footer />
    </div>
  );
}

export default Dashboard;