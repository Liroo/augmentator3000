import { PlanStateTimeRange } from '@/flux/plan/reducer';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  timeRanges: PlanStateTimeRange[];
  index: number;
  secondWidth: number;
  maxTime: number;
  setTimeRanges: (timeRanges: PlanStateTimeRange[]) => void;
};

enum TimeRangeInteraction {
  Grab,
  ResizeE,
  ResizeW,
}

export default function UITimeRangesSliderTimeRange({
  timeRanges,
  index,
  secondWidth,
  maxTime,
  setTimeRanges,
}: Props) {
  const [[startTime, endTime], setTmpPos] = useState<[number, number]>([
    timeRanges[index].startTime,
    timeRanges[index].endTime,
  ]);
  const tmpTimeRangeRef = useRef<PlanStateTimeRange>(timeRanges[index]);

  const [interactionType, setInteractionType] = useState<TimeRangeInteraction>(
    TimeRangeInteraction.Grab,
  );
  const [grabbing, setGrabbing] = useState<boolean>(false);
  const [startMousePos, setStartMousePos] = useState<[number, number]>([
    -1, -1,
  ]);
  const [mousePos, setMousePos] = useState<[number, number]>([-1, -1]);

  const onMouseDown = (e: React.MouseEvent, type: TimeRangeInteraction) => {
    e.preventDefault();
    e.stopPropagation();
    setInteractionType(type);
    setGrabbing(true);
    setStartMousePos([e.clientX, e.clientY]);
  };
  const onMouseMove = (e: MouseEvent) => {
    setMousePos([e.clientX, e.clientY]);

    const diffX = e.clientX - startMousePos[0];

    if (interactionType === TimeRangeInteraction.Grab) {
      const newStartTime =
        Math.round((startTime + (diffX / secondWidth) * 1000) / 1000) * 1000;
      const newEndTime = newStartTime + (endTime - startTime);
      if (newStartTime >= 0 && newEndTime <= maxTime * 1000) {
        const isOverlapping = timeRanges.some(
          ({ startTime: start, endTime: end }, i) =>
            i !== index &&
            ((newStartTime >= start && newStartTime <= end) ||
              (newEndTime >= start && newEndTime <= end)),
        );
        if (!isOverlapping) setTmpPos([newStartTime, newEndTime]);
      }
    } else if (interactionType === TimeRangeInteraction.ResizeW) {
      const newStartTime =
        Math.round((startTime + (diffX / secondWidth) * 1000) / 1000) * 1000;
      if (
        endTime - newStartTime >= 27000 &&
        newStartTime >= 0 &&
        newStartTime <= endTime
      ) {
        const prevEnvTime = index > 0 ? timeRanges[index - 1].endTime : 0;

        if (newStartTime > prevEnvTime) setTmpPos([newStartTime, endTime]);
      }
    } else if (interactionType === TimeRangeInteraction.ResizeE) {
      const newEndTime =
        Math.round((endTime + (diffX / secondWidth) * 1000) / 1000) * 1000;
      if (
        newEndTime - startTime >= 27000 &&
        newEndTime <= maxTime * 1000 &&
        newEndTime >= startTime
      ) {
        const nextEnvTime =
          index < timeRanges.length - 1
            ? timeRanges[index + 1].startTime
            : maxTime * 1000;
        if (newEndTime < nextEnvTime) setTmpPos([startTime, newEndTime]);
      }
    }
  };
  const onMouseUp = () => {
    const newTimeRanges = [...timeRanges];
    newTimeRanges[index] = {
      startTime: tmpTimeRangeRef.current.startTime,
      endTime: tmpTimeRangeRef.current.endTime,
      excludeInternalIds: tmpTimeRangeRef.current.excludeInternalIds,
      manualPriorities: tmpTimeRangeRef.current.manualPriorities,
    };
    newTimeRanges.sort((a, b) => a.startTime - b.startTime);
    setTimeRanges(newTimeRanges);
    setGrabbing(false);
  };

  const onRemoveTimeRange = (e: React.MouseEvent) => {
    e.preventDefault();
    const newTimeRanges = [...timeRanges];
    newTimeRanges.splice(index, 1);
    setTimeRanges(newTimeRanges);
  };

  useEffect(() => {
    tmpTimeRangeRef.current = {
      startTime,
      endTime,
      excludeInternalIds: timeRanges[index].excludeInternalIds,
      manualPriorities: timeRanges[index].manualPriorities,
    };
  }, [startTime, endTime]);
  useEffect(() => {
    if (grabbing) {
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('mousemove', onMouseMove);
      return () => {
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('mousemove', onMouseMove);
      };
    }
  }, [grabbing, timeRanges]);

  const start = moment(startTime).format('mm:ss');
  const end = moment(endTime).format('mm:ss');

  let cursor;
  switch (interactionType) {
    case TimeRangeInteraction.Grab:
      cursor = 'cursor-grabbing';
      break;
    case TimeRangeInteraction.ResizeE:
      cursor = 'cursor-ew-resize';
      break;
    case TimeRangeInteraction.ResizeW:
      cursor = 'cursor-ew-resize';
      break;
  }

  return (
    <>
      <div
        className={twMerge(
          'absolute left-0 z-20 flex h-[20px] select-none justify-between border border-[#2535e2] border-opacity-80 bg-[#2535e2] bg-opacity-30 transition-colors hover:border-opacity-100 hover:bg-opacity-50',
          grabbing ? 'cursor-grabbing' : 'cursor-grab',
        )}
        style={{
          width: `${((endTime - startTime) / 1000) * secondWidth}px`,
          transform: `translateX(${(startTime / 1000) * secondWidth}px)`,
        }}
        onContextMenu={onRemoveTimeRange}
      >
        <div
          className="h-full w-[8px] cursor-ew-resize bg-[#2535e2] bg-opacity-30"
          onMouseDown={(e) => onMouseDown(e, TimeRangeInteraction.ResizeW)}
        />
        <div
          className="flex h-full w-full items-center justify-center text-white"
          onMouseDown={(e) => onMouseDown(e, TimeRangeInteraction.Grab)}
        >
          <p className="text-[12px]">
            {start} - {end}
          </p>
        </div>
        <div
          className="h-full w-[8px] cursor-ew-resize bg-[#2535e2] bg-opacity-30"
          onMouseDown={(e) => onMouseDown(e, TimeRangeInteraction.ResizeE)}
        />
      </div>
      <div
        className={twMerge(
          'fixed left-0 top-0 z-50 h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 opacity-0',
          cursor,
          grabbing ? 'block' : 'hidden',
        )}
        style={{
          transform: `translate(${mousePos[0]}px, ${mousePos[1]}px)`,
        }}
      />
    </>
  );
}
