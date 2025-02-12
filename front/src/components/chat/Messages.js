// Messages.js
import "./Messages.css";
import List from "./list/list";
import Chat from "./chat";
import Detail from "./detail/detail";

function Messages() {
  return (
    <div className="containermsg">
      <List />
      <Chat />
      <Detail />
    </div>
  );
}

export default Messages;
