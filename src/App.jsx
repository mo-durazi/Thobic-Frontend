import { useContext } from "react";
import { Route, Routes } from "react-router";

// Components
import NavBar from "./components/NavBar/NavBar";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import SignInForm from "./components/SignInForm/SignInForm";
import Dashboard from "./components/Dashboard/Dashboard";
import TailorDashboard from "./components/TailorDashboard/TailorDashboard";
import Landing from "./components/Landing/Landing";
import AdminCreateUser from "./components/AdminCreateUser/AdminCreateUser";
import MyOrders from "./components/MyOrders/MyOrders";
import OrderEdit from "./components/OrderEdit/OrderEdit";
import TailorOrderDetails from "./components/TailorOrderDetails/TailorOrderDetails";
import TailorOrders from "./components/TailorOrders/TailorOrders";
import TailorMaterialOrders from "./components/TailorMaterialOrders/TailorMaterialOrders";
import ProviderOrders from "./components/ProviderOrders/ProviderOrders";
import MaterialsManager from "./components/Materials/MaterialsManager";
import MyMeasurements from "./components/MyMeasurements/MyMeasurements";
import MeasurementForm from "./components/MeasurementForm/MeasurementForm";
import ShopProfile from "./components/ShopProfile/ShopProfile";
import ShopList from "./components/ShopList/ShopList";
import OrderForm from "./components/OrderForm/OrderForm";
import OrderDetails from "./components/OrderDetails/OrderDetails";
import Forbidden from "./components/Forbidden/Forbidden";
import NotFound from "./components/NotFound/NotFound";
import RoleRoute from "./components/RoleRoute/RoleRoute";
import ProfileForm from "./components/ProfileForm/ProfileForm";

// Context
import { UserContext } from "./contexts/UserContext";

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />

      <Routes>
        <Route
          path="/"
          element={user ? <Dashboard /> : <Landing />}
        />

        <Route
          path="/tailor"
          element={
            <RoleRoute roles={["tailor"]}>
              <TailorDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/sign-up"
          element={<SignUpForm />}
        />

        <Route
          path="/sign-in"
          element={<SignInForm />}
        />

        <Route
          path="/admin/create-user"
          element={
            <RoleRoute roles={["admin"]}>
              <AdminCreateUser />
            </RoleRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <RoleRoute roles={["client"]}>
              <MyOrders />
            </RoleRoute>
          }
        />

        <Route
          path="/my-orders/:orderId"
          element={
            <RoleRoute roles={["client"]}>
              <OrderDetails />
            </RoleRoute>
          }
        />

        <Route
          path="/orders/:orderId/edit"
          element={
            <RoleRoute roles={["client"]}>
              <OrderEdit />
            </RoleRoute>
          }
        />

        <Route
          path="/tailor/orders/:orderId"
          element={
            <RoleRoute roles={["tailor"]}>
              <TailorOrderDetails />
            </RoleRoute>
          }
        />

        <Route
          path="/tailor/orders"
          element={
            <RoleRoute roles={["tailor"]}>
              <TailorOrders />
            </RoleRoute>
          }
        />

        <Route
          path="/tailor/material-orders"
          element={
            <RoleRoute roles={["tailor"]}>
              <TailorMaterialOrders />
            </RoleRoute>
          }
        />

        <Route
          path="/provider/orders"
          element={
            <RoleRoute roles={["provider"]}>
              <ProviderOrders />
            </RoleRoute>
          }
        />

        <Route
          path="/materials/mine"
          element={
            <RoleRoute roles={["tailor", "provider"]}>
              <MaterialsManager />
            </RoleRoute>
          }
        />

        <Route
          path="/materials/new"
          element={
            <RoleRoute roles={["tailor", "provider"]}>
              <MaterialsManager />
            </RoleRoute>
          }
        />

        <Route
          path="/materials/:id/edit"
          element={
            <RoleRoute roles={["tailor", "provider"]}>
              <MaterialsManager />
            </RoleRoute>
          }
        />

        {/* Measurements */}

        <Route
          path="/measurements"
          element={
            <RoleRoute roles={["client"]}>
              <MyMeasurements />
            </RoleRoute>
          }
        />

        <Route
          path="/measurements/new"
          element={
            <RoleRoute roles={["client"]}>
              <MeasurementForm key="new" />
            </RoleRoute>
          }
        />

        <Route
          path="/measurements/edit"
          element={
            <RoleRoute roles={["client"]}>
              <MeasurementForm key="edit" isEdit />
            </RoleRoute>
          }
        />

        {/* Shops */}

        <Route
          path="/shops/:shopId"
          element={<ShopProfile />}
        />

        <Route
          path="/shops"
          element={<ShopList />}
        />

        <Route
          path="/shops/:shopId/order"
          element={
            <RoleRoute roles={["client"]}>
              <OrderForm />
            </RoleRoute>
          }
        />

        {/* Other */}

        <Route
          path="/forbidden"
          element={<Forbidden />}
        />

        <Route
          path="/not-found"
          element={<NotFound />}
        />

        <Route
          path="/profile"
          element={
            <RoleRoute roles={["tailor", "provider"]}>
              <ProfileForm />
            </RoleRoute>
          }
        />

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </>
  );
};

export default App;