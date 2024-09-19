import React, { ReactNode } from "react";

import { XIcon as Close } from "lucide-react";

interface ModalProps {
  header?: string;
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export function Modal({ header, isOpen, onClose, children }: ModalProps) {
  const outsideRef = React.useRef(null);

  function handleCloseOnOverlay(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    if (e.target === outsideRef.current) {
      onClose();
    }
  }

  return isOpen ? (
    <div
      className={
        "fixed top-0 left-0 flex items-center justify-center w-screen h-screen z-50"
      }
    >
      <div
        ref={outsideRef}
        className={
          "absolute w-screen h-screen top-0 left-0 cursor-pointer bg-black/80"
        }
        onClick={handleCloseOnOverlay}
      />
      <div
        className={
          "relative w-4/5 p-4 box-border rounded-lg bg-slate-900 border border-slate-700 cursor-auto flex flex-col md:max-w-screen-md"
        }
      >
        <div className={"flex"}>
          <button
            className={
              "absolute top-3 right-3 origin-center transition-all duration-200 ease-in-out hover:rotate-90 hover:text-slate-500"
            }
            onClick={onClose}
          >
            <Close />
          </button>
          <h6 className={"text-white font-medium text-xl"}>{header}</h6>
        </div>
        <div className={"mt-2 flex-1"}>{children}</div>
      </div>
    </div>
  ) : null;
}
