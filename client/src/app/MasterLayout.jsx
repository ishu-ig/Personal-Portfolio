"use client";

import React from "react";
import Footer from "@/Content/Components/Footer";
import Navbar from "@/Content/Components/Navbar";
import { Provider } from "react-redux";
import Store from "@/Content/Redux/Store";
import { ThemeProvider } from "@/Content/ThemeContext";
import ScrollRestoration from "@/Content/ScrollRestoration";

export default function MasterLayout({ children }) {
  return (
    <ThemeProvider>
      <Provider store={Store}>
        <Navbar />
        <ScrollRestoration />
        {children}
        <Footer />
      </Provider>
    </ThemeProvider>
  );
}
