import { useAppDispatch, useAppSelector } from '@/flux/hooks';
import { setRegion } from '@/flux/wcl/reducer';
import { selectWCLRegion } from '@/flux/wcl/selector';
import { Region, SUPPORTED_REGIONS } from '@/game/REGIONS';
import { Select, Tooltip } from 'antd';

export default function WCLRegion() {
  const dispatch = useAppDispatch();
  const region = useAppSelector(selectWCLRegion);

  const onChangeRegion = (region: string) => {
    dispatch(setRegion(region as Region));
  };

  return (
    <Tooltip title="Region that will be used in Warcraft Logs requests">
      <div className="mr-[20px] mt-[50px] flex flex-col items-end">
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
