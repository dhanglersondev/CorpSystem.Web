import { createBrowserRouter } from "react-router-dom";

import DefaultLayout from "../components/Layout/DefaultLayout";

import Home from "../pages/Home/Home";
import DepartmentPage from "../pages/Department/Department";
import NotFound from "../pages/NotFound/NotFound";

export const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/departments",
        element: <DepartmentPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);