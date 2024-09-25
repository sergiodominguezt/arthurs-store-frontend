import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateTransactionStatus } from "../store/reducer";
import io from "socket.io-client";

const WebSocketComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("transactionStatus", (data) => {
      const { transactionId, status } = data;
      console.log("estado del websocket", status);
      dispatch(updateTransactionStatus(status.toLowerCase()));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return null;
};

export default WebSocketComponent;
