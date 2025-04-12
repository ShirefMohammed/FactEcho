"use client";

import dynamic from "next/dynamic";

import StatisticsCards from "./_components/Cards/StatisticsCards";
import TableOne from "./_components/Tables/TableOne";

const ChartOne = dynamic(() => import("./_components/Charts/ChartOne"), {
  ssr: false,
});
const ChartTwo = dynamic(() => import("./_components/Charts/ChartTwo"), {
  ssr: false,
});
const ChartThree = dynamic(() => import("./_components/Charts/ChartThree"), {
  ssr: false,
});
const MapOne = dynamic(() => import("./_components/Maps/MapOne"), {
  ssr: false,
});

const AdminDashboard = () => {
  return (
    <>
      <StatisticsCards />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        <div className="col-span-12">
          <TableOne />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
