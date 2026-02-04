"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchDashboardData } from "../store/thunks/dashboardThunks";
import Header from "../components/Header/main";
import Body from "./body/main";
import Footer from "../components/Footer/main";

function Dashboard() {
  const dispatch = useAppDispatch();
  const { data, isLoading, error } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  console.log("Dashboard data:", data);
  return (
    <div className="p-10 w-full h-screen flex flex-col gap-12 overflow-y-scroll no-scrollbar">
      <Header />
      <Body data={data} />
      <Footer />
    </div>
  );
}

export default Dashboard;