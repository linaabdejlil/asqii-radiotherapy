import "./detail.css";
import avatar from "../../../assets/images/avatar.png";
const Detail = () => {
  return (
    <div className="detail">
      <div className="user">
        <img
          src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
          alt=""
        />
        <h2 style={{ color: "white" }}>username</h2>
        <p style={{ color: "white" }}>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span style={{ color: "white" }}>Chat Settings</span>
            <img src="../../assets/images/arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span style={{ color: "white" }}>Privacy & help</span>
            <img src="../../assets/images/arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span style={{ color: "white" }}>Shared photos</span>
            <img src="../../assets/images/arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                  alt=""
                />
                <span>photo_2024_2.png</span>
              </div>
              <img
                src="../../assets/images/download.png"
                alt=""
                className="icon"
              />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span style={{ color: "white" }}>Shared Files</span>
            <img src="../../assets/images/arrowUp.png" alt="" />
          </div>
        </div>
        <button>"Block User"</button>
        <button className="logout">Logout</button>
      </div>
    </div>
  );
};

export default Detail;
