// ConfirmDialog.jsx
import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Dialog
      open={open}
      handler={onClose}
      className="bg-gray-900 text-white rounded-lg"
    >
      <DialogHeader className="text-white border-b border-gray-700">
        {title}
      </DialogHeader>

      <DialogBody className="text-gray-300">{message}</DialogBody>

      <DialogFooter className="border-t border-gray-700">
        <Button
          variant="text"
          onClick={onClose}
          className="mr-2 text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150"
        >
          Annuler
        </Button>
        <Button
          variant="gradient"
          color="red"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Confirmer
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmDialog;
