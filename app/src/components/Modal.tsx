const CustomModal = ({ isOpen, onClose, children }:any) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ">
        <div className="bg-white p-5  border-2 bg-white/50 border-rose-300 backdrop-blur-sm rounded-lg">
          <button onClick={onClose}>Close</button>
          {children}
        </div>
      </div>
    );
  };
  
  export default CustomModal;