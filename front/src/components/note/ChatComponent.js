import React, { useState, useEffect } from "react";

import axios from "axios";
import "./Notes.css";

const ChatComponent = ({}) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function generateAnswer(e) {
    setAnswer("loading...");
    const response = await axios({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBuCqIVRqMA6CgJs8FhEpdTgliBHfnEYIc`,
      method: "post",
      data: { contents: [{ parts: [{ text: question }] }] },
    });
    setAnswer(response["data"]["candidates"][0]["content"]["parts"][0]["text"]);
  }

  return (
    <div className="chat-container">
      <textarea
        className="chataiquestion"
        onChange={(e) => setQuestion(e.target.value)}
        cols="40"
        rows="8"
        placeholder="Posez votre question ici :exemple :donner un rapport court qui contient ces informations radiotherapie,chirurgie radicale,age>50..."
      ></textarea>
      <div className="response-container">
        <button className="genererReponse" onClick={generateAnswer}></button>
        <p
          className="chataiAnswer"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setAnswer(e.currentTarget.textContent)}
        >
          {answer}
        </p>
      </div>
    </div>
  );
};

export default ChatComponent;
