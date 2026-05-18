export type ToastType = 'success' | 'error' | 'info';

export interface ToastEvent {
  message: string;
  type?: ToastType;
}

export function showToast(message: string, type: ToastType = 'success') {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent<ToastEvent>('chocoluxe:toast', {
    detail: { message, type },
  });
  window.dispatchEvent(event);
}
