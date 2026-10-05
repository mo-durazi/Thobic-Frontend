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

// Context
import { UserContext } from "./contexts/UserContext";

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/admin/create-user" element={<AdminCreateUser />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/tailor/orders" element={<TailorOrders />} />
      </Routes>
    </>
  );
};

export default App;
