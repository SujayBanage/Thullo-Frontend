import { createContext } from "react";
import io from "socket.io-client";
const socketCxt = createContext();
const socket = io(
  import.meta.env.DEV
    ? import.meta.env.VITE_BACKEND_DEV_URL
    : import.meta.env.VITE_BACKEND_PROD_URL,
  {
    transports: ["websocket"],
  }
);
const SocketContext = ({ children }) => {
  return <socketCxt.Provider value={socket}>{children}</socketCxt.Provider>;
};
export default SocketContext;
export { socketCxt };
