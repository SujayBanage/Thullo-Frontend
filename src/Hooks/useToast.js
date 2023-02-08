import { toast } from "react-toastify";
const useToast = () => {
  const Toast = (error, message) => {
    console.log("toast called!!");
    return toast(message, {
      type:
        error === true
          ? "error"
          : error === false
          ? "success"
          : error === undefined && "info",
      position: "bottom-center",
    });
  };
  return Toast;
};
export default useToast;
