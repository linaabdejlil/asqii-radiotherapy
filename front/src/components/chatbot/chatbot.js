// chatbot.js
import { Button } from "antd";
import React, { useState } from "react";
import axios from "axios";
import "./chatbot.css"; // Add a separate CSS file for chatbot-specific styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";


const Chatbot = () => {
  const [visible, setVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([
    { sender: "bot", message: "Bonjour! Comment je peux vous aidez ?" },
  ]);
  const [loading, setLoading] = useState(false);

  
  const toggleChatbot = () => {
    setVisible(!visible);
    setIsClicked(!isClicked); // Toggle the clicked state
  };
  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSend = async () => {
    if (!question.trim()) return; // If question is empty, do nothing

    // Add user question to chat
    setChat([...chat, { sender: "user", message: question }]);
    setLoading(true);

    // AI response logic
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBuCqIVRqMA6CgJs8FhEpdTgliBHfnEYIc`,
        method: "post",
        data: { contents: [{ parts: [{ text: question }] }] },
      });
      
      const aiResponse =
        response.data.candidates[0].content.parts[0].text || "Sorry, I couldn't understand that.";

      // Add AI response to chat
      setChat((prevChat) => [...prevChat, { sender: "bot", message: aiResponse }]);
    } catch (error) {
      setChat((prevChat) => [
        ...prevChat,
        { sender: "bot", message: "Error: Unable to get a response from AI." },
      ]);
    } finally {
      setLoading(false);
      setQuestion(""); // Clear input field
    }
  };

  return (
    <>
      <button
        className={`chatbot-button ${isClicked ? "clicked" : ""}`}
        onClick={toggleChatbot}
      >
 <FontAwesomeIcon style={{height:50 , width: 50}}
                icon={
                 faRobot
                }
              />
            </button>     
      {visible && (
        <div className="chatbot-card">
          <div className="max-w-md mx-auto bg-white dark:bg-zinc-800 shadow-md rounded-lg overflow-hidden">
            <div className="flex flex-col h-[600px]">
              <div className="px-4 py-3 border-b dark:border-zinc-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">
                    Chatbot Assistant
                  </h2>
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {loading ? "Typing..." : "Online"}
                  </div>
                </div>
              </div>
              <div className="flex-1 p-3 overflow-y-auto flex flex-col space-y-2" id="chatDisplay">
                {chat.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-message self-${msg.sender === "bot" ? "start" : "end"} bg-${
                      msg.sender === "bot" ? "zinc-500" : "blue-500"
                    } text-white max-w-xs rounded-lg px-3 py-1.5 text-sm`}
                  >
                    {msg.message}
                  </div>
                ))}
              </div>
              <div className="px-3 py-2 border-t dark:border-zinc-700">
                <div className="flex gap-2">
                  <input
                    placeholder="Type your message..."
                    value={question}
                    onChange={handleQuestionChange}
                    className="flex-1 p-2 border rounded-lg dark:bg-zinc-700 dark:text-white dark:border-zinc-600 text-sm"
                    id="chatInput"
                    type="text"
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg transition duration-300 ease-in-out text-sm"
                  >
                    {loading ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
