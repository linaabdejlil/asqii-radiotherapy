import { useEffect, useState } from "react";
import "./chatList.css";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      <div
        className="item"
        style={{
          backgroundColor: "#5183fe",
        }}
      >
        <img src={"../../assets/images/avatar.png"} alt="" />
        <div className="texts">
          <span>helaa</span>
          <p>last Msg</p>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
