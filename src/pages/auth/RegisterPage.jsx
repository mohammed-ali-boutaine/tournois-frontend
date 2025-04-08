import React from "react";
import Navbar from "../../components/static/NavBar";
import Register from "../../components/auth/register";
import Footer from '../../components/static/Footer';

const LoginPage = () => {
  return (
    <>
      <Navbar />

      <Register />
      <Footer />
    </>
  );
};

export default LoginPage;
