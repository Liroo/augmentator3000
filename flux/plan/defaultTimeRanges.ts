const defaultTimeRanges: {
  [key: string]: [number, number][];
} = {
  default: [],
};

for (let i = 3000; i < 600000; i += 30000) {
  defaultTimeRanges.default.push([i, Math.min(i + 27000, 600000)]);
}

export default defaultTimeRanges;
