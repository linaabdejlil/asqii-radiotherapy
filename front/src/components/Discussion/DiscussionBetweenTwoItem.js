import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { sendMessage } from "../../services/messageAPI";
import socketIO from "../../services/socketIO";
import {
  AddDiscussion,
  GetExistingDiscussion,
  PostDiscussion,
  addMessageCurrentDiscussion,
  changeCurrentDiscussion,
  changeUserCurrentDiscussion,
  fetchAllDiscussion,
  selectCurrentDiscussion,
} from "../../features/discussion/discussionSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { getOtherUser } from "../../services/userAPI";
import Sound from "../../assets/sound.mp3";
import Image from "./Image/Image";
import ToolTip from "./ToolTip";
import formatDateTime from "../../services/formatDateTime";
import groupImg from "../../assets/images/group.png";

const DiscussionBetweenTwoItem = () => {
  const { groupID } = useParams();
  const location = useLocation();
  const currentDiscussion = useAppSelector(selectCurrentDiscussion);
  const { userID } = useParams();
  const [newDiscussion, setNewDiscussion] = useState(true);
  const [showwriting, setShowWriting] = useState(false);
  const [message, setMessage] = useState("");
  const [User, setCurrentUser] = useState();
  const dispatch = useAppDispatch();
  const typingTimeoutRef = useRef(null);
  const typingDelay = 500;
  const messagesDivRef = useRef(null);
  const messageTextRef = useRef(null);

  const fetchUserProfile = async () => {
    try {
      const token = await localStorage.getItem("token"); // Get the JWT token from local storage

      const response = await axios.get("users/profile", {
        headers: {
          Authorization: ` ${token}`, // Attach the token to the Authorization header
        },
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (location.pathname.split("/")[2] === "u") {
      if (userID?.length) {
        dispatch(GetExistingDiscussion(userID)).then(async (res) => {
          if (res.payload === undefined) {
            console.log("exist ", res);

            getOtherUser(Number(userID)).then(async (res) => {
              dispatch(changeUserCurrentDiscussion([res]));
              setNewDiscussion(true);
            });
          } else {
            setNewDiscussion(false);
          }
        });
      }
    } else {
      if (groupID?.length) {
        dispatch(fetchAllDiscussion()).then(async () => {
          dispatch(changeCurrentDiscussion(Number(groupID)));
          setNewDiscussion(false);
        });
      }
    }
    return () => {};
  }, [userID, groupID]);

  useEffect(() => {
    socketIO.on("privateMessage", async (message) => {
      if (currentDiscussion?.type === "u") {
        if (message?.senderId === Number(userID)) {
          if (newDiscussion) {
            await dispatch(GetExistingDiscussion(Number(userID)));
            setNewDiscussion(false);
          } else {
            dispatch(addMessageCurrentDiscussion(message?.message));
          }
        }
      }
      if (
        currentDiscussion?.type === "g" &&
        message?.senderId === Number(groupID)
      ) {
        dispatch(addMessageCurrentDiscussion(message?.message));
      }

      await playSound(Sound);
    });

    return () => {
      socketIO.off("privateMessage");
    };
  }, [currentDiscussion]);

  useEffect(() => {
    socketIO.on("writingMessage", async (id) => {
      if (userID === id.id) {
        setShowWriting(true);
      }
    });

    socketIO.on("notWritingMessage", async (id) => {
      if (userID === id.id) {
        setShowWriting(false);
      }
    });

    return () => {
      socketIO.off("writingMessage");
      socketIO.off("notWritingMessage");
    };
  }, [userID]);

  useEffect(() => {
    if (currentDiscussion?.messages?.length) {
      scrollToBottom();
    }
  }, [currentDiscussion?.messages?.length]);

  useEffect(() => {
    if (messageTextRef && messageTextRef.current) {
      messageTextRef.current.style.height = "auto";
      messageTextRef.current.style.height =
        messageTextRef.current.scrollHeight + "px";
      messageTextRef.current.style.overflow = "auto";
    }
  }, [message]);

  const HandleChangeMessage = async (event) => {
    const { value } = event.target;

    if (value.trim() !== "") {
      setMessage(value);
    } else {
      setMessage("");
    }
    event.preventDefault();
  };

  const sendMessageFunction = async (content) => {
    if (newDiscussion) {
      await dispatch(
        PostDiscussion({
          idOthersUser: [currentDiscussion?.Users[0].id],
          type: "u",
        })
      ).then(async (res) => {
        setNewDiscussion(false);
        const message = await sendMessage({
          message_content: content,
          message_idDiscussion: res.payload.id,
        });

        dispatch(addMessageCurrentDiscussion(message));
        const newDiscussion = {
          ...res.payload,
          lastMessage: message,
          idLastMessage: message?.id,
          messages: message ? [message] : [],
        };
        await dispatch(AddDiscussion({ discussion: newDiscussion }));

        socketIO.emit("privateMessage", {
          senderId: User.id,
          recipientIds: currentDiscussion?.Users,
          message: message,
          newDiscussion: newDiscussion,
        });
      });
    } else {
      const message = await sendMessage({
        message_content: content,
        message_idDiscussion: currentDiscussion?.id,
      });

      dispatch(addMessageCurrentDiscussion(message));

      await dispatch(fetchAllDiscussion());
      if (currentDiscussion?.type === "u") {
        socketIO.emit("privateMessage", {
          senderId: User.id,
          recipientIds: currentDiscussion?.Users,
          message: message,
          newDiscussion: newDiscussion,
        });
      }
      if (currentDiscussion?.type === "g") {
        socketIO.emit("privateMessage", {
          senderId: currentDiscussion?.id,
          recipientIds: currentDiscussion?.Users,
          message: message,
          newDiscussion: newDiscussion,
        });
      }
    }
  };

  const HandleSendMessage = async (event) => {
    const content = event.currentTarget.value;
    if (content && content.trim() !== "") {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        await sendMessageFunction(content);
        setMessage("");
        if (messageTextRef && messageTextRef.current) {
          messageTextRef.current.style.height = "auto";
        }
      } else {
        socketIO.emit("writingMessage", {
          senderId: User.id,
          recipientIds: currentDiscussion?.Users,
        });
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = window.setTimeout(async () => {
          socketIO.emit("notWritingMessage", {
            senderId: User.id,
            recipientIds: currentDiscussion?.Users,
          });
        }, typingDelay);
      }
    }
  };
  const handleClickSendMessage = async () => {
    const content = message;
    if (content && content.trim() !== "") {
      await sendMessageFunction(content);
    }
    setMessage("");
    if (messageTextRef && messageTextRef.current) {
      messageTextRef.current.style.height = "auto";
    }
  };

  const playSound = async (soundFile) => {
    const audio = new Audio(soundFile);
    await audio.play();
  };

  const scrollToBottom = async () => {
    if (messagesDivRef && messagesDivRef.current) {
      messagesDivRef.current.scrollTo({
        top: messagesDivRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="w-full h-[80px]">
        <div className="relative flex p-4">
          {currentDiscussion?.type === "g" ? (
            <div className="flex">
              <Image src={groupImg} className={`rounded-full h14 w-14`} />

              <h1 className="px-3">
                <span className="text-lg font-semibold">
                  {currentDiscussion.name} {currentDiscussion.prenom}
                </span>
              </h1>
              {showwriting ? (
                <p className="text-center">ecrire qlq chose ...</p>
              ) : null}
            </div>
          ) : (
            <div
              key={currentDiscussion?.id}
              className="basis-2/3 flex items-center"
            >
              {currentDiscussion?.Users.length &&
              currentDiscussion?.Users[0].image &&
              currentDiscussion?.Users[0].nom &&
              currentDiscussion?.Users[0].prenom ? (
                <Image
                  src={currentDiscussion.Users[0].image}
                  title={`${currentDiscussion.Users[0].nom} ${currentDiscussion.Users[0].prenom}`}
                  alt={`${currentDiscussion.Users[0].nom} ${currentDiscussion.Users[0].prenom}`}
                  onErrorHandler={(e) =>
                    console.error("Image failed to load", e)
                  }
                  className="rounded-full h-12 w-12"
                />
              ) : null}
              <h1 className="px-3">
                <span className="text-lg font-semibold">
                  {currentDiscussion?.Users[0].nom}{" "}
                  {currentDiscussion?.Users[0].prenom}
                </span>
              </h1>
              {showwriting ? (
                <p className="text-center">ecrire qlq chose ...</p>
              ) : null}
            </div>
          )}
          <div className="basis-1/3"></div>
        </div>
      </div>
      <div className="h-[calc(100%-80px)] flex flex-col relative">
        <div
          ref={messagesDivRef}
          className="h-full overflow-y-auto overflow-x-hidden p-3 bg-[#F0F4FA]"
        >
          {currentDiscussion?.messages?.map((message, index) => (
            <div
              key={index}
              className={`relative w-fit max-w-[30vw] ${
                message.senderId === User?.id ? "mr-0 ml-auto" : "mr-auto ml-0"
              } break-words`}
              style={{
                wordBreak: "break-word", // Assure le retour à la ligne pour les longs mots
                overflowWrap: "break-word", // Alternative à word-break pour certains navigateurs
              }}
            >
              <ToolTip
                tooltip={
                  message?.updatedAt
                    ? formatDateTime(
                        new Date(Date.parse(message.updatedAt)),
                        true
                      )
                    : null
                }
                positionClass={message.senderId === User?.id ? "mr-0" : "ml-0"}
              >
                <div className="flex">
                  <div
                    className={`flex items-center justify-center p-2  ${
                      message.senderId === User?.id ? "order-2" : "order-1"
                    }`}
                  >
                    <Image
                      src={message.sender?.image}
                      title={`${message.sender?.nom} ${message.sender?.prenom}`}
                      alt={`${message.sender?.nom} ${message.sender?.prenom}`}
                      onErrorHandler={(e) =>
                        console.error("Image failed to load", e)
                      }
                      className="rounded-full h-8 w-8 min-h-8 min-w-7"
                    />
                  </div>
                  <div
                    className={` ${
                      message.senderId === User?.id ? "order-1" : "order-2"
                    }`}
                  >
                    <p
                      className={`my-2 p-2  rounded-2xl px-5 ${
                        message.senderId === User?.id
                          ? "bg-[#5B96F7]"
                          : "bg-white"
                      }`}
                    >
                      <span
                        className={`break-words  ${
                          message.senderId === User?.id
                            ? "text-white"
                            : "text-[#696969]"
                        }`}
                      >
                        {message.content
                          ? message.content.split("\n").map((line, index) => (
                              <React.Fragment key={index}>
                                {line}
                                <br />
                              </React.Fragment>
                            ))
                          : ""}
                      </span>
                    </p>
                    <div className={"w-fit ml-4 text-sm text-gray-500"}>
                      {message?.updatedAt
                        ? formatDateTime(
                            new Date(Date.parse(message.updatedAt)),
                            true
                          )
                        : "Date inconnue"}
                    </div>
                  </div>
                </div>
              </ToolTip>
            </div>
          ))}
        </div>
        <div className="flex h-fit py-3 px-2">
          <textarea
            ref={messageTextRef}
            id="SendMessage"
            name="SendMessage"
            rows={1}
            tabIndex={0}
            value={message}
            className="relative rounded-2xl outline-none max-h-[22dvh] m-0 w-full p-3 overflow-y-auto resize-none border-0 focus:shadow-sm focus-visible:ring-0 placeholder-black/50 bg-[#F0F4FA]"
            placeholder="Envoyer une message"
            onChange={HandleChangeMessage}
            onKeyDown={HandleSendMessage}
            required
          />

          <button
            type="button"
            className="flex items-center justify-center p-2  text-gray-500 rounded-lg cursor-pointer hover:text-gray-900"
            onClick={handleClickSendMessage}
          >
            <svg
              className="w-5 h-5 rotate-90 rtl:-rotate-90"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default DiscussionBetweenTwoItem;
