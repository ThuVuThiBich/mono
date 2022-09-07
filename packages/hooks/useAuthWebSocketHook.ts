import { parseJson } from "@cross/cookies";
import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { UserProfile } from "./types";



export const useAuthWebSocketHook = (
  webSocketURL: string,
  user: UserProfile | undefined,
  currentSubAccount: string,
  getAuthToken: () => Promise<any>,
  whenAuthSocketChange?: () => void
) => {
  const { readyState, sendMessage, lastMessage } = useWebSocket(webSocketURL, {
    shouldReconnect: () => true,
    reconnectAttempts: 20,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    if (readyState === ReadyState.OPEN && !!user) {
      (async () => {
        const authTokenResponse = await getAuthToken();
        if (authTokenResponse["auth-token"]) {
          const authTokenMsg = `{"event":"loginToken", "token":"${authTokenResponse["auth-token"]}"}`;
          sendMessage(authTokenMsg);
          if (whenAuthSocketChange) whenAuthSocketChange();
        }
      })();
    }
  }, [
    readyState,
    user,
    currentSubAccount,
    getAuthToken,
    sendMessage,
    whenAuthSocketChange,
  ]);

  return {
    readyState,
    sendMessage,
    lastMessage,
    isSocketReady: readyState === ReadyState.OPEN,
  };
};
