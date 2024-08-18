import { TimeRange } from 'utils/analysis';

export type AnalysisDamageDoneEntry = TimeRange & {
  entries: {
    [characterKey: string]: {
      characterKey: string;
      average: number;
      total: number;
      count: number;
    };
  };
};

export type AnalysisDamageDoneEntryParent = AnalysisDamageDoneEntry & {
  subEntries: AnalysisDamageDoneEntry[];
};

export type AnalysisTableEntry = {
  characterKey: string;
  average: number;
  count: number;
  total: number;
  priority?: boolean;
};

export type AnalysisTableRow = TimeRange & {
  entries: AnalysisTableEntry[];
};

export type AnalysisTableRowParent = AnalysisTableRow & {
  subEntries: AnalysisTableRow[];
};
