import { useContext } from "react";
import { Route, Routes } from "react-router";

// Components
import NavBar from "./components/NavBar/NavBar";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import SignInForm from "./components/SignInForm/SignInForm";
import Dashboard from "./components/Dashboard/Dashboard";
import Landing from "./components/Landing/Landing";
import AdminCreateUser from "./components/AdminCreateUser/AdminCreateUser";
import MyOrders from "./components/MyOrders/MyOrders";
import TailorOrders from "./components/TailorOrders/TailorOrders";
import TailorMaterialOrders from "./components/TailorMaterialOrders/TailorMaterialOrders";
import ProviderOrders from "./components/ProviderOrders/ProviderOrders";
import MaterialsManager from "./components/Materials/MaterialsManager";
import MyMaterials from "./components/MyMaterials/MyMaterials";
import MyMeasurements from "./components/MyMeasurements/MyMeasurements";
import MeasurementForm from "./components/MeasurementForm/MeasurementForm";
import ShopProfile from "./components/ShopProfile/ShopProfile";
import ShopList from "./components/ShopList/ShopList";
import OrderForm from "./components/OrderForm/OrderForm";
import OrderDetails from "./components/OrderDetails/OrderDetails";
import Forbidden from "./components/Forbidden/Forbidden";


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

        <Route path="/sign-up" element={<SignUpForm />} />

        <Route path="/sign-in" element={<SignInForm />} />

        <Route
          path="/admin/create-user"
          element={<AdminCreateUser />}
        />

        <Route
          path="/my-orders"
          element={<MyOrders />}
        />

        <Route
          path="/my-orders/:orderId"
          element={<OrderDetails />}
        />

        <Route
          path="/tailor/orders"
          element={<TailorOrders />}
        />

        <Route
          path="/tailor/material-orders"
          element={<TailorMaterialOrders />}
        />

        <Route
          path="/provider/orders"
          element={<ProviderOrders />}
        />

        <Route
          path="/materials/mine"
          element={<MyMaterials />}
        />

        <Route
          path="/materials/new"
          element={<MaterialsManager />}
        />

        <Route
          path="/materials/:id/edit"
          element={<MaterialsManager />}
        />

        <Route
          path="/measurements"
          element={<MyMeasurements />}
        />

        <Route
          path="/measurements/new"
          element={<MeasurementForm key="new" />}
        />

        <Route
          path="/measurements/edit"
          element={<MeasurementForm key="edit" isEdit />}
        />

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
          element={<OrderForm />}
        />

        <Route
          path="/forbidden"
          element={<Forbidden />}
        />

      </Routes>
    </>
  );
};

export default App;