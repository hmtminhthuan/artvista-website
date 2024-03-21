"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  database,
  ref,
  push,
  onValue,
  serverTimestamp,
} from "@/config/firebaseConfig";
import moment from "moment";
import "./Chatting.scss";
import { getUserInfo } from "@/utils/utils";
import { AuthUser } from "@/types/authentication";
import { Role } from "@/enums/accountRole";
import { FirebaseMessage } from "@/types/firebase/FirebaseMessage";
import { NextPage } from "next";
import useAppContext from "@/hooks/useAppContext";
import { ArtworkDTO } from "@/types/market/ArtworkDTO";
import ArtworkCard from "@/app/(common)/discover/components/ArtworkCard";
import artworkManagementApi from "@/api/management/artwork";
import { v4 } from "uuid";
import authApi from "@/api/auth/auth";

type ChattingType = {
  isOpen?: boolean;
  chattingOfCustomerId?: string;
  artworkIdInput?: string;
};

const ChattingOfCustomer: NextPage<ChattingType> = ({
  isOpen,
  chattingOfCustomerId,
  artworkIdInput,
}) => {
  const [userLogin, setUserLogin] = useState<AuthUser | null>(null);
  const [userChat, setUserChat] = useState<AuthUser | null>(null);
  const [messageList, setMessageList] = useState<FirebaseMessage[]>([]);
  const [messageTyping, setMessageTyping] = useState<string>("");
  const [chatId, setChatId] = useState<string>("");
  const [artwork, setArtwork] = useState<ArtworkDTO | null>(null);
  const { disableChattingOfCustomer } = useAppContext();

  const messagesChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesChatRef.current) {
      const observer = new MutationObserver(() => {
        scrollToBottom();
      });
      observer.observe(messagesChatRef.current, { childList: true });
    }
    if (chattingOfCustomerId) {
      authApi
        .getUserInfo(chattingOfCustomerId)
        .then((response) => {
          if (response.data.isSuccess) {
            setUserChat(response.data.result);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const scrollToBottom = () => {
    if (messagesChatRef.current) {
      messagesChatRef.current.scrollTo({
        top: messagesChatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const sendMessage = () => {
    if (artworkIdInput != "" && artwork != null) {
      // push(ref(database, `message/creator_customer/${chatId}`), {
      //   messageId:
      //     moment(new Date()).format("DD_MM_YYYY_HH_mm_ss") + "_" + v4(),
      //   name: userLogin ? userLogin.name : "",
      //   message: messageTyping,
      //   userID: userLogin ? userLogin.id : "",
      //   roleID: userLogin ? userLogin.role[0] : "",
      //   artwork: artwork ? JSON.stringify(artwork) : "",
      //   createdAt: moment(new Date().toISOString()).format("DD-MM-YYYY, HH:mm"),
      //   seen: false,
      // });
      // push(ref(database, `messageNoti/${chattingOfCustomerId}`), {
      //   userIDFrom: userLogin ? userLogin.id : "",
      //   name: userLogin ? userLogin.name : "",
      //   seen: false,
      // });
      setArtwork(null);
    }
    if (messageTyping.trim() != "") {
      push(ref(database, `message/creator_customer/${chatId}`), {
        messageId:
          moment(new Date()).format("DD_MM_YYYY_HH_mm_ss") +
          "_" +
          Math.random(),
        name: userLogin ? userLogin.name : "",
        message: messageTyping,
        userID: userLogin ? userLogin.id : "",
        roleID: userLogin ? userLogin.role[0] : "",
        artwork: "",
        createdAt: moment(new Date().toISOString()).format("DD-MM-YYYY, HH:mm"),
        seen: false,
      });
      push(ref(database, `messageNoti/${chattingOfCustomerId}`), {
        userIDFrom: userLogin ? userLogin.id : "",
        name: userLogin ? userLogin.name : "",
        seen: false,
      });
    }
    setMessageTyping("");
    scrollToBottom();
  };

  const handleTypeMessage = (message: string) => {
    setMessageTyping(message);
  };

  useEffect(() => {
    if (isOpen && chattingOfCustomerId) {
      const USER = getUserInfo();
      const userParse = USER ? JSON.parse(USER) : null;
      setUserLogin(userParse);

      const chatId =
        userLogin && userLogin?.role.filter((r: any) => r == Role.CREATOR)[0]
          ? `${userParse.id}@@and@@${chattingOfCustomerId}`
          : `${chattingOfCustomerId}@@and@@${userParse?.id}`;
      setChatId(chatId);

      onValue(ref(database, `message/creator_customer/${chatId}`), (data) => {
        let getMsg: any = [];
        data.forEach((d) => {
          getMsg.push(d.val());
        });
        setMessageList(getMsg);
        scrollToBottom();
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (artworkIdInput != "" && artworkIdInput != undefined) {
      artworkManagementApi
        .getAllArtwork()
        .then((response) => {
          if (
            response.data.isSuccess &&
            response.data.result &&
            response.data.result.isSuccess
          ) {
            setArtwork(
              response.data.result.result.filter(
                (artwork: ArtworkDTO) => artwork.artworkId == artworkIdInput
              )[0]
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [artworkIdInput]);

  if (!isOpen) {
    return <></>;
  }

  return (
    <div ref={messagesChatRef} className="chat-container">
      <div className="chat-detail">
        <div className="chat-detail__header flex flex-row justify-between">
          <div className="header__info">
            <span
              className="p-0 m-0 my-0"
              style={{
                fontWeight: "bolder",
                fontSize: "18px",
                marginBottom: "0px",
              }}
            >
              {messageList.filter((x: any) => x.userID != userLogin?.id)[0]
                ? messageList.filter((x: any) => x.userID != userLogin?.id)[0]
                    .name
                : ""}
            </span>
          </div>
          <div className="flex flex-row justify-end mt-1 ms-3">
            <button
              className="border-0 bg-light  bg-white"
              style={{ borderRadius: "10px", padding: "0px 8px" }}
              onClick={() => {
                disableChattingOfCustomer();
              }}
            >
              X
            </button>
          </div>
        </div>
        <div className="chat-detail__messages" id="messages">
          {messageList.map((item, index) => {
            let {
              createdAt,
              name,
              roleID,
              userID,
              message,
              artwork,
              artworkParse,
            } = item;
            // if (artwork !== undefined && artwork !== "") {
            //   artworkParse = JSON.parse(artwork);
            //   return (
            //     <div
            //       className={`message ${
            //         userLogin && userID == userLogin.id ? "me" : ""
            //       }`}
            //       style={{ height: "45vh" }}
            //     >
            //       <ArtworkCard
            //         artworkId={artworkParse?.artworkId ?? ""}
            //         artworkName={artworkParse?.artworkName ?? ""}
            //         price={artworkParse?.price}
            //         discount={artworkParse?.discount}
            //         maskGroup={artworkParse?.imageUrl.split("://example")[0]}
            //         translateYNumber={10}
            //       />
            //     </div>
            //   );
            // }
            return (
              <div
                key={index}
                className={`message ${
                  userLogin && userID == userLogin.id ? "me" : ""
                }`}
              >
                <div className="message__detail">
                  <div className="message__detail__text">
                    <div className="info">
                      {userLogin && userID == userLogin.id ? "You" : name}
                      {userLogin &&
                      roleID == Role.MODERATOR &&
                      !(userID == userLogin.id)
                        ? " - Assistant"
                        : ""}
                      {userLogin &&
                      roleID == Role.CREATOR &&
                      !(userID == userLogin.id)
                        ? " - Creator"
                        : ""}
                      {userLogin &&
                      roleID == Role.CUSTOMER &&
                      !(userID == userLogin.id)
                        ? " - Customer"
                        : ""}
                      {".  "}
                      {createdAt.split(",")[0].trim() ==
                      moment(new Date()).format("DD-MM-YYYY")
                        ? "Today"
                        : createdAt.split(",")[0].trim()}
                      {", "}
                      {createdAt.split(",")[1].trim()}
                    </div>
                    <div className="text">{message}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="chat-detail__input">
          <input
            value={messageTyping}
            type="text"
            placeholder="Type a message"
            id="message"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            onChange={(e) => {
              handleTypeMessage(e.target.value);
            }}
          />
          <button
            onClick={() => {
              sendMessage();
            }}
            className="border-0 px-3 ms-2 bg-dark text-light"
            style={{ borderRadius: "10px" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChattingOfCustomer;
