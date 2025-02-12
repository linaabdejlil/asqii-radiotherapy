// global.js
import "../../style/global.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout, theme } from "antd";
import Tableau from "./tableau";
import Nav from "../nav";
import Chatbot from "../chatbot/chatbot"

const { Content } = Layout;

const Global = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  return (
    <Layout style={{ height: "100vh", width: "100vw" }}>
      <Nav></Nav>
      <div style={{ marginTop: 50 }}>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "100vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            height: "100%", // Assurez-vous que Content occupe toute la hauteur disponible
            top: "-200px",
          }}
        >
          <Tableau></Tableau>
        </Content>
      </div>
      <Chatbot />
    </Layout>
  );
};

export default Global;
