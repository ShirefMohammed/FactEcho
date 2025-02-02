"use client";

import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";

import style from "./FirstReqLoadingMsg.module.css";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

const FirstReqLoadingMsg = () => {
  const [responseTime, setResponseTime] = useState(0);
  const [openMessage, setOpenMessage] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setResponseTime((prev) => prev + 1);
    }, 1000);

    const sendReq = async () => {
      try {
        await axios.get(SERVER_URL);
      } catch (err) {
        console.error(err);
      } finally {
        setOpenMessage(false);
        clearInterval(intervalId);
      }
    };

    sendReq();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (responseTime > 5) {
      setOpenMessage(true);
    }
  }, [responseTime]);

  return (
    <>
      <Head>
        <meta
          name="description"
          content="Waiting for the server response - first time load on Render"
        />
        <meta name="robots" content="noindex, nofollow" />
        <title>Server Loading</title>
      </Head>

      {openMessage && (
        <div className={style.first_req_loading_msg}>
          <p>Please wait from 45 to 60 seconds until server response</p>
          <p>{responseTime} seconds</p>
          <p>
            Info: This delay happens on the first response because the app is deployed on a free
            host on Render.
          </p>
        </div>
      )}
    </>
  );
};

export default FirstReqLoadingMsg;
