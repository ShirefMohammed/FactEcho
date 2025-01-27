import StatisticsCards from "./components/Cards/StatisticsCards";
import ChartOne from "./components/Charts/ChartOne";
import ChartThree from "./components/Charts/ChartThree";
import ChartTwo from "./components/Charts/ChartTwo";
import MapOne from "./components/Maps/MapOne";
import TableOne from "./components/Tables/TableOne";

const AdminDashboard = () => {
  return (
    <>
      <StatisticsCards />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
