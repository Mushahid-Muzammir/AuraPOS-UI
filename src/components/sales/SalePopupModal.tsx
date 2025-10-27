
interface PopupProps {
  onClose: () => void;
  onConfirm: () => void;
}

export const Popup = ({ onClose, onConfirm }: PopupProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Print Confirmation
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to print this bill?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
