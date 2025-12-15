// FIX: Changed LuAlertCircle to LuTriangle (which exists in your version)
import { LuTriangle } from 'react-icons/lu';
import { ModalWrapper } from './ui/ModalWrapper';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isDestructive?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  isDestructive = false
}: ConfirmDialogProps) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
          isDestructive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {/* FIX: Using LuTriangle as the warning icon */}
          <LuTriangle size={24} />
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-2">{message}</p>
        </div>

        <div className="flex w-full gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium shadow-lg transition-all ${
              isDestructive 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};