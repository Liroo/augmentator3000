import { twMerge } from 'tailwind-merge';

export type Props = {
  inputClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function UIFormInputText({
  className = '',
  inputClassName = '',
  ...props
}: Props) {
  return (
    <div
      className={twMerge(
        'h-[30px] overflow-hidden rounded-[6px] border border-white border-opacity-40 bg-[#121212]',
        props.disabled ? 'opacity-70' : '',
        className,
      )}
    >
      <input
        {...props}
        className={`h-full w-full bg-transparent px-[8px] ${inputClassName}`}
      />
    </div>
  );
}
