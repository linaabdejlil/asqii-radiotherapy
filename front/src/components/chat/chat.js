import { useEffect, useRef, useState } from "react";
import "./chat.css";

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const endRef = useRef(null);

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={"./avatar.png"} alt="" />
          <div className="texts">
            <span style={{ color: "white" }}>username</span>
            <p>Lorem ipsum dolor, sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <img src="../../../assets/images/phone.png" alt="" />
          <img src="../../../assets/images/video.png" alt="" />
          <img src="../../../assets/images/info.png" alt="" />
        </div>
      </div>
      <div className="center">
        <div>
          <div className="texts">
            <p>hello</p>
            <span style={{ color: "#9999" }}>12/05/2024</span>
          </div>
        </div>
        <div className="message own">
          <div className="texts">
            <img alt="" />
          </div>
        </div>
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="../../assets/images/img.png" alt="" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img src="../../assets/images/camera.png" alt="" />
          <img src="../../assets/images/mic.png" alt="" />
        </div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="emoji">
          <img
            src="../../assets/images/emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker"></div>
        </div>
        <button className="sendButton">Send</button>
      </div>
    </div>
  );
};

export default Chat;
