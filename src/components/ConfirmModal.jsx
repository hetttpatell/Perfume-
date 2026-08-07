import { useState, useCallback, createContext, useContext } from 'react';

const ConfirmContext = createContext(null);

/**
 * Professional luxury confirmation modal that replaces native browser confirm/alert dialogs.
 * Usage:
 *   const { confirm, alert } = useConfirm();
 *   const ok = await confirm('Are you sure?', { title: 'Delete Product', confirmLabel: 'DELETE', danger: true });
 *   await alert('Something went wrong');
 */
export function ConfirmProvider({ children }) {
  const [modal, setModal] = useState(null);

  const confirm = useCallback((message, opts = {}) => {
    return new Promise((resolve) => {
      setModal({ message, resolve, type: 'confirm', ...opts });
    });
  }, []);

  const showAlert = useCallback((message, opts = {}) => {
    return new Promise((resolve) => {
      setModal({ message, resolve, type: 'alert', ...opts });
    });
  }, []);

  const handleClose = (result) => {
    if (modal?.resolve) modal.resolve(result);
    setModal(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm, alert: showAlert }}>
      {children}

      {/* Modal Overlay */}
      {modal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={() => handleClose(modal.type === 'alert' ? true : false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-[92vw] max-w-[420px] overflow-hidden border border-black/10"
            style={{ animation: 'confirmFadeIn 0.2s ease-out' }}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-2">
              <div className="flex items-center gap-3 mb-3">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  modal.danger
                    ? 'bg-red-50 text-red-500'
                    : modal.type === 'alert'
                      ? 'bg-amber-50 text-amber-500'
                      : 'bg-[#F5F0E8] text-[#C08A3E]'
                }`}>
                  {modal.danger ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ) : modal.type === 'alert' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <h3 className="font-sans font-extrabold text-sm tracking-wide uppercase text-[#111111]">
                  {modal.title || (modal.danger ? 'Confirm Deletion' : modal.type === 'alert' ? 'Notice' : 'Confirm Action')}
                </h3>
              </div>

              <p className="text-[13px] font-sans text-[#555555] leading-relaxed pl-[52px]">
                {modal.message}
              </p>
            </div>

            {/* Actions */}
            <div className="px-6 pt-4 pb-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
              {modal.type === 'confirm' && (
                <button
                  onClick={() => handleClose(false)}
                  className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#F5F5F7] hover:bg-[#EBEBEF] text-[11px] font-sans font-extrabold tracking-[0.15em] uppercase text-[#555555] transition-all cursor-pointer border border-black/5 active:scale-95 text-center"
                >
                  {modal.cancelLabel || 'CANCEL'}
                </button>
              )}
              <button
                onClick={() => handleClose(true)}
                className={`w-full sm:w-auto px-5 py-3 rounded-full text-[11px] font-sans font-extrabold tracking-[0.15em] uppercase transition-all cursor-pointer active:scale-95 border text-center ${
                  modal.danger
                    ? 'bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-md'
                    : 'bg-[#111111] hover:bg-[#333333] text-white border-[#111111] shadow-md'
                }`}
              >
                {modal.confirmLabel || (modal.type === 'alert' ? 'OK' : 'CONFIRM')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe animation injected inline */}
      <style>{`
        @keyframes confirmFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within a <ConfirmProvider>');
  return ctx;
}
