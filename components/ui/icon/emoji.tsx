export type Props = {
  emoji: string;
};

export default function UIIconEmoji({ emoji }: Props) {
  return <span className="whitespace-nowrap">{emoji}</span>;
}
