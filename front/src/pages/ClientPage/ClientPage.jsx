import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import NotFound from "../../components/NotFound/NotFound";
import Commercial from "../../components/Commercial/Commercial";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket("ws://127.0.0.1:8000");

const ClientPage = () => {
  const params = useParams();
  const [commercials, setCommercials] = useState(null);
  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
      client.send(
        JSON.stringify({
          screenNumber: params.id
        })
      );
    };
  }, [client]);

  const getAdvertismentsHandler = useCallback(async () => {
    await axios
      .get(`http://localhost:8080/clients/${params.id}`)
      .then((res) => {
        setCommercials(res.data);
      });
  }, [params]);

  useEffect(() => {
    getAdvertismentsHandler();
  }, [getAdvertismentsHandler]);

  return (
    <div>
      <h1>Client detail page</h1>
      <p>{params.id}</p>
      {commercials ? <Commercial commercials={commercials} /> : <NotFound />}
    </div>
  );
};

export default ClientPage;
