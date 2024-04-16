export type Props = {
  loading?: boolean;
};

export default function UILoadingThreeDot({ loading = true }: Props) {
  if (!loading) return null;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="dot-flashing"></div>
    </div>
  );
}
