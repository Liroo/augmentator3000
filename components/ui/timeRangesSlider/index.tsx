import React from 'react';
import UITimeRangesSliderRuler from './ruler';
import UITimeRangesSliderTimeRange from './timeRange';

type Props = {
  timeRanges: [number, number][];
  setTimeRanges: (timeRanges: [number, number][]) => void;
};

const maxTime = 15 * 60; // 15 minutes
const secondWidth = 4;

export default function UITimeRangesSlider({
  timeRanges,
  setTimeRanges,
}: Props) {
  const onClickAddTimeRange = (e: React.MouseEvent) => {
    const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
    const startTime = Math.round(x / secondWidth) * 1000;
    const endTime = startTime + 27000;

    if (startTime >= 0 && endTime <= maxTime * 1000) {
      const isOverlapping = timeRanges.some(
        ([start, end]) =>
          (startTime >= start && startTime <= end) ||
          (endTime >= start && endTime <= end),
      );

      if (!isOverlapping) {
        const newTimeRanges = [...timeRanges];
        newTimeRanges.push([startTime, endTime]);
        newTimeRanges.sort((a, b) => a[0] - b[0]);
        setTimeRanges(newTimeRanges);
      }
    }
  };

  return (
    <div className="relative h-[72px] w-full select-none rounded-[8px] border border-[#303030] bg-[#141414]">
      <div className="no-scrollbar h-full w-full overflow-x-scroll">
        <div
          className="relative h-[30px] px-[30px]"
          style={{
            width: `${maxTime * secondWidth + 60}px`,
          }}
        >
          <UITimeRangesSliderRuler
            maxTime={maxTime}
            secondWidth={secondWidth}
          />
          <div
            className="relative top-[5px] h-[20px] w-full overflow-x-hidden"
            onClick={onClickAddTimeRange}
          >
            {timeRanges.map(([startTime], index) =>
              startTime > maxTime * 1000 ? null : (
                <UITimeRangesSliderTimeRange
                  key={startTime}
                  timeRanges={timeRanges}
                  index={index}
                  secondWidth={secondWidth}
                  maxTime={maxTime}
                  setTimeRanges={setTimeRanges}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
