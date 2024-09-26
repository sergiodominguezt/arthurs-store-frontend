import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateTransactionStatus } from "../store/reducer";
import io from "socket.io-client";

const WebSocketComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    //local
    // const socket = io("http://localhost:3000");
    //aws
    const socket = io("http://http://3.132.134.51/");

    socket.on("transactionStatus", (data) => {
      const { status } = data;
      console.log("Websocket status", status);
      dispatch(updateTransactionStatus(status.toLowerCase()));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return null;
};

export default WebSocketComponent;
