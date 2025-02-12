import React from "react";
import SideBarDiscussion from "../components/Discussion/SideBarDiscussion";
import { Outlet, useLocation } from "react-router-dom";
import Nav from "../components/nav";
import { Layout, theme } from "antd";
import msg from "../assets/images/imagemsg.png";
import Chatbot from "../components/chatbot/chatbot"

const { Content } = Layout;

const Discussions = () => {
  const { pathname } = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const isBaseRoute = pathname === "/Discussions";

  return (
    <Layout style={{ height: "100vh", width: "100vw" }}>
      <Nav />
      <Chatbot />

      <div
        style={{
          marginTop: 80,
          marginLeft: 20,
          marginRight: 20,
          marginBottom: 20,
        }}
      >
        <Content>
          <div className="flex gap-2" style={{ height: "800px" }}>
            <div className="basis-1/4 bg-blue-100 rounded-lg p-2">
              <SideBarDiscussion />
            </div>
            <div className="basis-3/4 flex flex-col rounded-lg bg-blue-100">
              {isBaseRoute ? (
                <div style={{ textAlign: "center", marginTop: "90px" }}>
                  <img
                    src={msg}
                    alt="Placeholder"
                    style={{
                      height: 500,
                      width: 500,
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  />
                  <p
                    style={{
                      marginTop: "20px",
                      fontSize: "24px",
                      color: "#233368", // Adjust color as necessary
                    }}
                  >
                    Sélectionner ou commencer une discussion
                  </p>
                </div>
              ) : (
                <Outlet />
              )}
            </div>
          </div>
        </Content>
      </div>
    </Layout>
  );
};

export default Discussions;
