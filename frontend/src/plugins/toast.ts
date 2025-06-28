import Toast, { POSITION, TYPE } from "vue-toastification";
import "vue-toastification/dist/index.css";

export const toastOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 4000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
  toastClassName: "custom-toast",
  bodyClassName: "custom-toast-body",
  containerClassName: "custom-toast-container",
};

export { Toast, TYPE };
