// components/ModalWrapper.tsx
import { ReactNode, use, useEffect } from "react";
import { Dialog } from "@headlessui/react";

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ isOpen, onClose, title, children }) => {


    useEffect(() => {
    // This effect runs when the modal opens
    if (isOpen) {
      // You can add any side effects here, like fetching data or resetting state
      console.log("Modal opened");
    } else {
      // This effect runs when the modal closes
      console.log("Modal closed");
      // You can add any cleanup logic here
    }
  }, [isOpen]);


  return (
    <>
    <Dialog open={isOpen} onClose={onClose}>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}
      >
        <Dialog.Panel
          style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            width: '400px',
            maxWidth: '90%',
          }}
        >
          <Dialog.Title style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{title}</Dialog.Title>
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>



    </>
  );
};

export default ModalWrapper;
