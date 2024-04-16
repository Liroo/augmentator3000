import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export type Props = {
  inputClassName?: string;
  suggestions?: Array<{ label: string; key: string }>;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function UIFormInputTextSuggestions({
  className = '',
  inputClassName = '',
  suggestions = [],
  ...props
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
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
        <input
          {...props}
          onFocus={() => setFocused(true)}
          ref={inputRef}
          className={twMerge(
            'h-full w-full bg-transparent px-[8px]',
            inputClassName,
          )}
        />
      </div>

      {focused && (
        <div className="absolute left-0 top-[30px] z-10 max-h-[210px] min-h-[10px] w-full overflow-y-auto rounded-[6px] border border-white border-opacity-40 bg-[#121212] shadow-sm">
          {suggestions
            .filter(
              (suggestion) =>
                !props.value ||
                suggestion.label
                  .toLowerCase()
                  .includes((props.value as string).toLowerCase()),
            )
            .map((suggestion) => (
              <div
                key={suggestion.key}
                className={`cursor-pointer border-b border-white border-opacity-40 px-[8px] py-[2px] last:border-0 hover:bg-opacity-10`}
                onClick={() => {
                  if (inputRef.current) {
                    const nativeInputValueSetter = (
                      Object as any
                    ).getOwnPropertyDescriptor(
                      window.HTMLInputElement.prototype,
                      'value',
                    ).set;
                    nativeInputValueSetter.call(
                      inputRef.current,
                      suggestion.key,
                    );

                    const event2 = new Event('input', { bubbles: true });
                    inputRef.current.dispatchEvent(event2);
                    setFocused(false);
                  }
                }}
              >
                {suggestion.label}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
