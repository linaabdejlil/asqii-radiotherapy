import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAllUser } from "../../services/userAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  AddDiscussion,
  PostDiscussion,
  fetchAllDiscussion,
  selectDiscussions,
} from "../../features/discussion/discussionSlice";
import socketIO from "../../services/socketIO";
import Image from "./Image/Image";
import formatDateTime from "../../services/formatDateTime";
import Popup from "./Popup";
import CustomInput from "./CustomInput";
import GroupDiscussion from "./GroupDiscussion";
import "./dusc.css";
import groupImg from "../../assets/images/group.png";

const SideBarDiscussion = () => {
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const allDiscussions = useAppSelector(selectDiscussions);
  const { userID } = useParams();
  const { groupID } = useParams();
  const [User, setCurrentUser] = useState({});

  const [clickInput, setClickInput] = useState(false);

  const [isPopupGroupOpen, setPopupGroupOpen] = useState(false);
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token"); // Synchronous operation
      const response = await axios.get("http://localhost:4001/users/profile", {
        headers: { Authorization: ` ${token}` },
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchAllDiscussion());
    getAllUser(1, 10, "").then((res) => setAllUsers(res.users));
    fetchUserProfile();
  }, [dispatch]);

  useEffect(() => {
    socketIO.on("privateMessageSideBar", async () => {
      await dispatch(fetchAllDiscussion());
    });
    return () => {
      socketIO.off("privateMessageSideBar");
    };
  }, []);

  useEffect(() => {
    console.log("all discus", allDiscussions);
  }, [allDiscussions]);

  const handleClickOpenDiscussion = async (event, index) => {
    if (allDiscussions[index].type === "u") {
      navigate(`u/${allDiscussions[index].Users[0]?.id}`);
    } else {
      navigate(`g/${allDiscussions[index].id}`);
    }
    event.stopPropagation();
  };

  const handleClickCreateDiscussion = async (event, index) => {
    navigate(`u/${allUsers[index].id}`);
    await handleBackClick();
    event.stopPropagation();
  };

  function truncateString(str, maxLength) {
    if (str)
      if (str.length <= maxLength) {
        return str;
      } else {
        return str.slice(0, maxLength - 3) + "...";
      }
  }

  const handleClickInputSearch = async () => {
    setClickInput(true);
  };

  const handleBackClick = async () => {
    setClickInput(false);
  };

  const closePopupGroup = async () => {
    setPopupGroupOpen(false);
  };

  const openPopupGroup = (event) => {
    event.stopPropagation();
    setPopupGroupOpen(true);
  };

  const handleCreateGroupDiscussion = async (discussionGroup, name) => {
    await dispatch(
      PostDiscussion({
        idOthersUser: discussionGroup.map((member) => member.id),
        type: "g",
        name: name,
      })
    ).then(async (res) => {
      await dispatch(AddDiscussion({ discussion: res.payload }));
      await closePopupGroup();
      navigate(`g/${res.payload.id}`);
    });
  };

  return (
    <>
      <div className="flex items-center p-4 h-[80px]">
        <div className="basis-1/2">
          <h1 style={{ color: "#0d0060", marginLeft: 20 }}>Discussions</h1>
        </div>
        <div className="basis-1/2 flex justify-end">
          <button className="createGroup" onClick={openPopupGroup}>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="36"
                height="36"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  fill="currentColor"
                  d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
                ></path>
              </svg>{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                width="36"
                height="36"
              >
                <path
                  fill="currentColor"
                  d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z"
                />
              </svg>{" "}
            </span>
          </button>
          <Popup isOpen={isPopupGroupOpen} onClose={closePopupGroup}>
            <GroupDiscussion
              handleCreateGroupDiscussion={handleCreateGroupDiscussion}
              allUsers={allUsers}
            />
          </Popup>
        </div>
      </div>
      <div className="p-4 h-[calc(100%-80px)]">
        <div className="w-full h-[60px]">
          <CustomInput
            id="DiscussionSearch"
            name="DiscussionSearch"
            type="text"
            className="block mx-auto w-full text-sm p-3 bg-[#F0F4FA] rounded-2xl outline-none"
            placeholder="Rechercher une Discussion"
            onClick={handleClickInputSearch}
            required
          />
        </div>
        {clickInput ? (
          <div className="w-full h-[calc(100%-60px)] py-3">
            <div
              className="w-fit rounded-full p-2 mb-3 hover:bg-slate-400 cursor-pointer"
              onClick={handleBackClick}
            >
              <svg viewBox="0 0 20 20" width="20" height="20" fill="#111">
                <g fillRule="evenodd" transform="translate(-446 -350)">
                  <g fillRule="nonzero">
                    <path
                      d="M100.249 201.999a1 1 0 0 0-1.415-1.415l-5.208 5.209a1 1 0 0 0 0 1.414l5.208 5.209A1 1 0 0 0 100.25 211l-4.501-4.501 4.5-4.501z"
                      transform="translate(355 153.5)"
                    ></path>
                    <path
                      d="M107.666 205.5H94.855a1 1 0 1 0 0 2h12.813a1 1 0 1 0 0-2z"
                      transform="translate(355 153.5)"
                    ></path>
                  </g>
                </g>
              </svg>
            </div>
            {allUsers.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center py-2 px-3 cursor-pointer rounded-lg hover:bg-slate-400"
                onClick={(event) => handleClickCreateDiscussion(event, index)}
              >
                <Image
                  src={user.image}
                  title={`${user.nom} ${user.prenom}`}
                  alt={`${user.nom} ${user.prenom}`}
                  onErrorHandler={(e) =>
                    console.error("Image failed to load", e)
                  }
                  className="rounded-full h-8 w-7"
                />
                <p className="text-sm font-medium p-2">
                  {user.nom} {user.prenom}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[calc(100%-60px)] py-3">
            <div className="w-fit h-[30px] mb-4">
              <h2
                className="text-base font-semibold"
                style={{ color: "#0d0060", marginLeft: 20 }}
              >
                Discussions existante
              </h2>
            </div>
            <div className="h-[calc(100%-30px)] pr-3 overflow-y-auto overflow-x-hidden">
              {allDiscussions?.map((discussion, index) => (
                <div
                  className="cursor-pointer mb-2"
                  key={index + 10000}
                  onClick={(event) => handleClickOpenDiscussion(event, index)}
                >
                  {discussion.type === "u" ? (
                    <div
                      className={`flex items-center p-2 rounded-lg ${
                        discussion.Users[0].id &&
                        discussion.Users[0]?.id === Number(userID)
                          ? "bg-slate-400"
                          : ""
                      } hover:bg-slate-400`}
                    >
                      <div className="flex items-center">
                        <Image
                          src={discussion.Users[0].image}
                          title={`${discussion.Users[0].nom} ${discussion.Users[0].prenom}`}
                          alt={`${discussion.Users[0].nom} ${discussion.Users[0].prenom}`}
                          onErrorHandler={(e) =>
                            console.error("Image failed to load", e)
                          }
                          className="rounded-full h-14 w-14"
                        />
                      </div>
                      <div className=" block p-2">
                        <p className="text-base font-medium">
                          {discussion.Users[0].nom} {discussion.Users[0].prenom}
                        </p>
                        {discussion.lastMessage?.id ? (
                          <p
                            className={`break-words w-fit text-sm text-gray-500`}
                          >
                            <span className="pr-2">
                              {User.id === discussion.lastMessage?.senderId
                                ? "Vous: " +
                                  truncateString(
                                    discussion.lastMessage?.content,
                                    23
                                  )
                                : truncateString(
                                    discussion.lastMessage?.content,
                                    35
                                  )}
                            </span>
                            <span className="px-2">
                              {discussion.lastMessage?.updatedAt
                                ? formatDateTime(
                                    new Date(
                                      Date.parse(
                                        discussion.lastMessage?.updatedAt
                                      )
                                    ),
                                    false
                                  )
                                : null}
                            </span>
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`relative flex items-center p-2 rounded-lg ${
                        discussion.id && discussion?.id === Number(groupID)
                          ? "bg-slate-400"
                          : ""
                      } hover:bg-slate-400`}
                    >
                      <Image
                        src={groupImg}
                        className={`rounded-full h14 w-14`}
                      />

                      <div className=" block p-2">
                        <p className="text-base font-medium">
                          {discussion.name}
                        </p>
                        {discussion.lastMessage?.id ? (
                          <p
                            className={`break-words w-fit text-sm text-gray-500`}
                          >
                            <span className="pr-2">
                              {User.id === discussion.lastMessage?.senderId
                                ? "Vous: " +
                                  truncateString(
                                    discussion.lastMessage?.content,
                                    28
                                  )
                                : truncateString(
                                    discussion.lastMessage?.content,
                                    35
                                  )}
                            </span>
                            <span className="px-2">
                              {discussion.lastMessage?.updatedAt
                                ? formatDateTime(
                                    new Date(
                                      Date.parse(
                                        discussion.lastMessage?.updatedAt
                                      )
                                    ),
                                    false
                                  )
                                : null}
                            </span>
                          </p>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SideBarDiscussion;
