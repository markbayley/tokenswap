import { Fragment, useState, useEffect } from "react";
import { Loading } from "@nextui-org/react";
import { Dialog, Transition } from "@headlessui/react";

export default function TransactionStatus({}) {
  const [open, setOpen] = useState(true);

  function handleClose() {
    setOpen(false);
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-[9999] inset-0 overflow-y-auto"
        onClose={handleClose}
      >
        <div className="flex items-center justify-center min-h-screen px-4 py-6">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity z-[9998]" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative bg-[#212429] rounded-xl p-6 max-w-sm w-full mx-auto shadow-2xl border border-zinc-700 z-[9999]">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#7765F3] bg-opacity-20 mb-4">
                  <Loading color="white" size="lg">
                    <span className="sr-only">Processing transaction...</span>
                  </Loading>
                </div>
                
                <Dialog.Title as="h3" className="text-lg font-semibold text-white mb-2">
                  Processing Transaction
                </Dialog.Title>
                
                <Dialog.Description className="text-sm text-zinc-400 mb-6">
                  This usually takes 10-15 seconds. Please don't close this window.
                </Dialog.Description>
                
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="px-6 py-2 bg-[#7765F3] hover:bg-[#4D44B5] text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#7765F3] focus:ring-offset-2 focus:ring-offset-[#212429]"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
