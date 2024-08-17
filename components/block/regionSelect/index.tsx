import { Select, Tooltip } from 'antd';
import { useAppDispatch, useAppSelector } from 'flux/hooks';
import { setRegion } from 'flux/wcl/reducer';
import { selectWCLRegion } from 'flux/wcl/selector';
import { Region, SUPPORTED_REGIONS } from 'game/regions';
import { logEvent } from 'services/amplitude/analytics';

export default function RegionSelect() {
  const dispatch = useAppDispatch();
  const region = useAppSelector(selectWCLRegion);

  const onChangeRegion = (region: string) => {
    logEvent('home', 'region_change', { region });
    dispatch(setRegion(region as Region));
  };

  return (
    <Tooltip
      title="Region that will be used in Warcraft Logs requests. Changing region will reset all data."
      placement="bottomLeft"
    >
      <div className="mt-[50px] flex flex-col items-end">
        <Select
          defaultValue={region}
          style={{ width: 70 }}
          options={SUPPORTED_REGIONS.map((region) => ({
            value: region,
            label: region,
          }))}
          onChange={onChangeRegion}
        />
      </div>
    </Tooltip>
  );
}
