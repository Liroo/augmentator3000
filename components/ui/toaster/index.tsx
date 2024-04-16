import { useSelector } from 'react-redux';

import { ToastType } from '@/flux/toast/reducer';
import { selectToastList } from '@/flux/toast/selector';
import UIToast from './toast';

export default function UIToaster() {
  const toastList = useSelector(selectToastList);

  return (
    <div className="pointer-events-none fixed top-0 z-[100] flex min-h-full min-w-full justify-center">
      <div className="flex w-full max-w-[504px] flex-col items-center">
        {toastList.map((toast: ToastType) => {
          return <UIToast key={toast.id} toast={toast} />;
        })}
      </div>
    </div>
  );
}
