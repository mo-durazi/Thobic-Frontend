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
      </Routes>
    </>
  );
};

export default App;