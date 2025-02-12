import React from "react";
import Nav from "../nav"; // Ensure the import path is correct
import "./Notes.css";
import { Layout, theme } from "antd";
import NoteNew from "./noteNew";
import CalendrierNote from "./calendrierNote";
import Chatbot from "../chatbot/chatbot"

const { Content } = Layout;

function Notes() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
   
     <Layout style={{ height: "82vh", width: "100vw" }}>
     <Nav></Nav>

     <div style={{ marginTop: 50 }}>
       <Content
         style={{
           margin: "24px 16px",
           padding: 24,
           background: colorBgContainer,
           borderRadius: borderRadiusLG,
           height: "100%", // Assurez-vous que Content occupe toute la hauteur disponible
           top: "-10px",
         }}
       >
         <Chatbot />
         <div style={{ width: 1200}}>
         <CalendrierNote />
         </div>
       </Content>
     </div>
   </Layout>
  );
}

export default Notes;
