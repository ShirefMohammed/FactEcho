import { Outlet } from "react-router-dom";

import DefaultLayout from "./components/Layout/DefaultLayout";

const MainWrapper = () => {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
};

export default MainWrapper;
