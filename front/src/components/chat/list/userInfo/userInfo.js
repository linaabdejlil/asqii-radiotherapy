import "./userInfo.css";

const Userinfo = () => {
  return (
    <div className="userInfo">
      <div className="user">
        <img src="../../assets/images/avatar.png" alt="" />
        <h2>username</h2>
      </div>
      <div className="icons">
        <img src="../../assets/images/more.png" alt="" />
        <img src="../../assets/images/video.png" alt="" />
        <img src="../../assets/images/edit.png" alt="" />
      </div>
    </div>
  );
};

export default Userinfo;
