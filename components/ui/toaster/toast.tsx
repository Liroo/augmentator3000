import { useEffect } from 'react';

import { removeToast, ToastType } from '@/flux/toast/reducer';

import { useAppDispatch } from '@/flux/hooks';

interface Props {
  /** Toast parameters */
  toast: ToastType;
}

export default function UIToast({ toast }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, toast.time ?? 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={'w-full max-w-[390px]'}
      onClick={() => {
        dispatch(removeToast(toast.id));
      }}
    >
      <div
        className={`border-primary pointer-events-auto mx-[16px] my-[4px] flex min-h-[30px] cursor-pointer items-center justify-start rounded border border-opacity-30 bg-[#6dcf44] text-white shadow ${
          toast.className ?? ''
        }`}
      >
        <p className="w-full px-[8px] text-[14px] font-medium">{toast.text}</p>
      </div>
    </div>
  );
}
