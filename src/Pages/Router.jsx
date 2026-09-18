import { Routes, Route } from "react-router-dom";
import Layout from "../Common/Layout";
import AdminLayout from "../Common/AdminLayout";
import ProtectedRoute from "../ComponentCommon/ProtectedRoute";

import Home from "./Home";
import Pets from "./Pets";
import PetDetails from "./PetDetails";
import Products from "./Products";
import ProductDetails from "./ProductDetails";
import AdoptForm from "./AdoptForm";
import OrderForm from "./OrderForm";
import Cart from "./Cart";
import Payment from "./Payment";
import ProductPayment from "./ProductPayment";
import Confirmation from "./Confirmation";
import ProductConfirmation from "./ProductConfirmation";
import Login from "./Login";
import Register from "./Register";
import UserDashboard from "./UserDashboard";
import SurrenderPet from "./SurrenderPet";

import AdminDashboard from "./Admin/AdminDashboard";
import ManagePets from "./Admin/ManagePets";
import ManageRequests from "./Admin/ManageRequests";
import ManageProducts from "./Admin/ManageProducts";
import ProductRequests from "./Admin/ProductRequests";
import SurrenderRequests from "./Admin/SurrenderRequests";

const AppRouter = () => {
  return (
    <Routes>
      {/* User Layout Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="pets" element={<Pets />} />
        <Route path="pets/:id" element={<PetDetails />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route
          path="adopt/:id"
          element={
            <ProtectedRoute>
              <AdoptForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="adopt-cart"
          element={
            <ProtectedRoute>
              <AdoptForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="order-cart"
          element={
            <ProtectedRoute>
              <OrderForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment/:id"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment-cart"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="product-payment"
          element={
            <ProtectedRoute>
              <ProductPayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="confirmation"
          element={
            <ProtectedRoute>
              <Confirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="product-confirmation"
          element={
            <ProtectedRoute>
              <ProductConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="surrender-pet"
          element={
            <ProtectedRoute>
              <SurrenderPet />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin Layout Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="manage-pets" element={<ManagePets />} />
        <Route path="manage-requests" element={<ManageRequests />} />
        <Route path="manage-products" element={<ManageProducts />} />
        <Route path="product-requests" element={<ProductRequests />} />
        <Route path="surrender-requests" element={<SurrenderRequests />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;