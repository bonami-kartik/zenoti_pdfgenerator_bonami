import { toast } from 'react-toastify';

const options = {
  position: 'top-right',
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const toastSuccess = (message, optionsData) => {
  toast.success(message, optionsData || options);
};

export const toastError = (message, optionsData) => {
  toast.error(message, optionsData || options);
};

export const toastInfo = (message, optionsData) => {
  toast.info(message, optionsData || options);
};
