export type Props = {
  title: string;
};

export default function UITopNavigation({ title }: Props) {
  return (
    <div className="bg-[#fbfbfa] px-[16px] py-[8px] shadow-sm">
      <h2 className="py-[4px]">{title}</h2>
    </div>
  );
}
