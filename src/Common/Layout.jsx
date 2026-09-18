import { Outlet } from "react-router-dom";
import Navbar from "../ComponentCommon/Navbar";
import Footer from "../ComponentCommon/Footer";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;