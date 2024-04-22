type Props = {
  maxTime: number;
  secondWidth: number;
};

export default function UITimeRangesSliderRuler({
  maxTime,
  secondWidth,
}: Props) {
  const ticks = Array.from({ length: maxTime + 1 }, (_, i) => i);
  return (
    <div className="relative mt-[40px]">
      {/* Long line */}
      <div
        className="absolute left-0 top-0 h-px bg-[#606060]"
        style={{
          width: `${maxTime * secondWidth}px`,
        }}
      />
      {/* Every tick visual */}
      {ticks.map((tick, index) => {
        let height = 5;
        if (index % 5 === 0) height = 10;
        if (index % 10 === 0) height = 15;
        if (index % 60 === 0) height = 20;
        return (
          <div
            key={tick}
            className="absolute bottom-0 w-px"
            style={{
              backgroundColor: index % 30 === 0 ? '#606060' : '#303030',
              height: `${height}px`,
              left: `${tick * secondWidth}px`,
            }}
          >
            {index % 60 === 0 && (
              <div className="absolute -left-1/2 bottom-full -translate-x-1/2 text-white">
                <p className="text-[12px]">{tick / 60}:00</p>
              </div>
            )}
            {index % 30 === 0 && index % 60 ? (
              <div className="absolute -left-1/2 bottom-full -translate-x-1/2 text-white">
                <p className="text-[8px]">{Math.floor(tick / 60)}:30</p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
