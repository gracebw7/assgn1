// src/main.jsx
import React from "react";
import ReactDOMClient from "react-dom/client";
import MyApp from "./MyApp";
import "./main.css";

//Creat container
const container = document.getElementById("root");

//create root
const root = ReactDOMClient.createRoot(container);

//init render: render element to root
root.render(<MyApp />);
