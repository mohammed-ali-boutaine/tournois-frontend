import React from "react";
import Navbar from "../../components/static/NavBar";
import Login from "../../components/auth/Login";
import Footer from '../../components/static/Footer';

const LoginPage = () => {
  return (
    <>
      <Navbar />

      <Login />
      <Footer />
    </>
  );
};

export default LoginPage;
