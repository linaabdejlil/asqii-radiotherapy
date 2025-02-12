import React from "react";
import Nav from "../nav"; // Ensure the import path is correct
import Stat1 from "./stat1";
import Stat2 from "./stat2";
import { Layout, theme } from "antd";
import "./statistique.css";
import Chatbot from "../chatbot/chatbot"


const { Content } = Layout;

function Statistique() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <div>
      <Nav />
      <Chatbot />

      <div className="stat1">
        {" "}
        <Stat1 />
      </div>
      <div className="stat2">
        {" "}
        <Stat2 />
      </div>
    </div>
  );
}

export default Statistique;
