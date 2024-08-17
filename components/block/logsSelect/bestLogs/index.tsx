import LogsSelectBestLogsForm from './form';
import LogsSelectBestLogsTable from './table';

export default function LogsSelectBestLogs() {
  return (
    <>
      <LogsSelectBestLogsForm />
      <div className="mt-[16px]">
        <LogsSelectBestLogsTable />
      </div>
    </>
  );
}
