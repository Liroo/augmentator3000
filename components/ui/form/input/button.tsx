import { twMerge } from 'tailwind-merge';

export type Props = {
  onClick?: () => void;
  buttonClassName?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function UIFormInputButton({
  className = '',
  buttonClassName = '',
  ...props
}: Props) {
  return (
    <div
      className={twMerge(
        'flex h-[30px] select-none items-center justify-center rounded-[6px] border border-white border-opacity-40 bg-[#121212] px-[8px] hover:opacity-90',
        props.disabled ? 'opacity-70' : '',
        className,
      )}
    >
      <button
        {...props}
        className={twMerge('h-full w-full whitespace-nowrap', buttonClassName)}
      />
    </div>
  );
}
