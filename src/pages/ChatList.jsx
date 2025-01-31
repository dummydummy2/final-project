import "../styles/ChatList.css";
import React, { useEffect } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {__getinitialChatList2,__getRoomList,} from "../redux/modules/chattingSlice";
import imgDefault from "../img/user2.png";
  const ChatList = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const Room = useSelector((state) => state.chatting.roomList);

  useEffect(() => {
    dispatch(__getRoomList());
  }, []);

  const onClickChatting = (item) => {
    navigator(`/ChatRoomPage/${item.roomId}`)
    setTimeout(
    function () {
    dispatch(__getinitialChatList2(item.roomId)
    );
    }
    ,200 
    );
    }
  //리스트방에서 빠져나오면 로컬스토리에서 최근 날짜 없앰 그리고 로컬스토리지 단한번 만실행
  //채팅 샌드할때
  return (
    <div className="layout">
      <Header />
      <div className="line"/>
      <div className="overflow" style={{cursor: "pointer"}}>
        {Room !== undefined && Room !== null ? (
          Room.map((item, i) => {
            return (
        <div className="root" key={i}>
          <div onClick={() => onClickChatting(item)} className="flexDiv">
            {
            item.joinUserNickname == localStorage.getItem("user-nickname")
            ?
            <img  className="photoImg" src={(item.postUserImg !==null ? item.postUserImg:imgDefault)} alt="" />
            :
            <img  className="photoImg" src={(item.joinUserImg !== null ? item.joinUserImg: imgDefault)} alt="" />
            }
            <div className="marginDiv">
              <span className="boldText">
                {
                localStorage.getItem("user-nickname")===item.joinUserNickname
                ? item.postUserNickname
                : item.joinUserNickname
                //내 아이디명이 아닌 상대방 아이디
                }
              </span>
              <div className="chat-text">
                <div className="chatlength">
                  {
                  item.chatList[item.chatList.length - 1] !== undefined  && 
                  item.chatList[item.chatList.length - 1].length !== 0 &&
                  item.chatList[item.chatList.length - 1].message
                  }
                      
                </div>
                <span className="whiteTime">
                  {item.chatList[item.chatList.length - 1] !== undefined &&
                  `${item.chatList[item.chatList.length - 1].sendDate.substring(5, 7)}월`}
                  {item.chatList[item.chatList.length - 1] !== undefined &&
                  `${item.chatList[
                  item.chatList.length - 1
                  ].sendDate.substring(8, 10)}일`} 
                </span>
              </div>
            </div>
          </div>
            <img className="img" src={require("../img/KakaoTalk_20221208_132549478.png")}/>
        </div>//root
            );
          })
        ) : (
          <div className="chat-none">
            <div>채팅내역이 없습니다.</div>
            <button onClick={() => navigator(-1)}>이전으로</button>
          </div>
        )}
      </div>
      <Footer />
    </div>//전체
  );
};
export default ChatList;
