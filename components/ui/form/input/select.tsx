import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export type Props = {
  options?: Array<{ label: string; key: string }>;
  selectClassName?: string;
  optionClassName?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export default function UIFormInputSelect({
  className = '',
  options = [],
  selectClassName = '',
  optionClassName = '',
  ...props
}: Props) {
  const selectRef = useRef<HTMLSelectElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState<boolean>(false);

  useEffect(() => {
    const onWindowClick = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setFocused(false);
      }
    };
    addEventListener('click', onWindowClick);

    return () => {
      removeEventListener('click', onWindowClick);
    };
  }, []);

  return (
    <div className="relative" ref={componentRef}>
      <div
        className={twMerge(
          'h-[30px] w-full overflow-hidden rounded-[6px] border border-white border-opacity-40 bg-[#121212]',
          props.disabled ? 'opacity-70' : '',
          className,
        )}
      >
        <select
          {...props}
          onFocus={() => setFocused(true)}
          ref={selectRef}
          className="hidden"
        >
          {options.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
        <div
          onClick={() => setFocused(true)}
          className={twMerge(
            'flex h-full w-full cursor-pointer select-none items-center bg-transparent px-[8px]',
            selectClassName,
          )}
        >
          {props.value}
        </div>
      </div>

      {focused && (
        <div className="absolute left-0 top-[30px] z-10 max-h-[210px] min-h-[10px] w-full overflow-y-auto rounded-[6px] border border-white border-opacity-40 bg-[#121212] shadow-sm">
          {options.map((option) => (
            <div
              key={option.key}
              className={twMerge(
                'flex w-full cursor-pointer items-center border-b border-white border-opacity-40 px-[8px] py-[2px] last:border-0 hover:bg-opacity-10',
                optionClassName,
              )}
              onClick={() => {
                if (selectRef.current) {
                  const nativeInputValueSetter = (
                    Object as any
                  ).getOwnPropertyDescriptor(
                    window.HTMLSelectElement.prototype,
                    'value',
                  ).set;
                  nativeInputValueSetter.call(selectRef.current, option.key);

                  const event2 = new Event('change', { bubbles: true });
                  selectRef.current.dispatchEvent(event2);
                  setFocused(false);
                }
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
