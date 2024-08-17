import { RedoOutlined, TeamOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useAppDispatch, useAppSelector } from 'flux/hooks';
import { rosterAddCharacter } from 'flux/roster/reducer';
import { StatusEnum } from 'flux/status/reducer';
import { selectStatusByActionTypeId } from 'flux/status/selector';
import { getWCLCharacter, getWCLReportWithFights } from 'flux/wcl/action';
import specs from 'game/specs';
import { useEffect } from 'react';
import { logEvent } from 'services/amplitude/analytics';
import { rosterCharacterToKey } from 'utils/roster';
import { WCLReport, WCLReportPlayerDetails } from 'wcl/types';

interface Props {
  report: WCLReport;
}

export default function LogsSelectCustomReportTableCellActions({
  report,
}: Props) {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(
    selectStatusByActionTypeId(getWCLReportWithFights.typePrefix, report.code),
  );
  const isLoading = status === StatusEnum.Pending;

  const onImportRoster = () => {
    // remove players with the spec AUGMENTATION_EVOKER
    const rosterQuery = (report.playerDetails as WCLReportPlayerDetails[])
      .filter(
        (playerDetails) =>
          !playerDetails.specs.every(
            (spec) => spec.spec === specs.AUGMENTATION_EVOKER.wclSpecName,
          ),
      )
      .map((playerDetails) => ({
        name: playerDetails.name,
        serverSlug: playerDetails.serverSlug,
        serverRegion: report.region,
      }));

    logEvent('home', 'import-roster', {
      report: report.code,
      count: rosterQuery.length,
    });

    rosterQuery.forEach((rosterCharacter) => {
      dispatch(rosterAddCharacter(rosterCharacter));
      dispatch(
        getWCLCharacter({
          key: rosterCharacterToKey(rosterCharacter),
          ...rosterCharacter,
        }),
      );
    });
  };

  const onRefreshLog = () => {
    if (isLoading) return;
    logEvent('home', 'refresh-report', { report: report.code });
    dispatch(getWCLReportWithFights({ key: report.code, code: report.code }));
  };

  useEffect(() => {
    const interval = setInterval(
      () => {
        dispatch(
          getWCLReportWithFights({ key: report.code, code: report.code }),
        );
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [dispatch, report.code]);

  return (
    <div className="flex cursor-pointer select-none items-center justify-center gap-[12px]">
      <div onClick={onImportRoster}>
        <Tooltip title="Import DPS Characters (except aug)">
          <TeamOutlined style={{ fontSize: 18 }} />
        </Tooltip>
      </div>
      <div onClick={onRefreshLog}>
        <Tooltip title="Refresh log (there is an automatic refresh every 5 minutes)">
          <RedoOutlined style={{ fontSize: 18 }} spin={isLoading} />
        </Tooltip>
      </div>
    </div>
  );
}
