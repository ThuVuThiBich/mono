import { message, Space, Tooltip } from 'antd';
import { useAutoCompoundFlag } from 'api/staking';
import { setFlagAutoCompound } from 'api/staking/request';
import { TError } from 'api/types';
import SyncAlt from 'assets/svgs/components/SyncAlt';
import TimeSolid from 'assets/svgs/components/TimeSolid';
import { StyledSwitch } from '@cross/ui/StyledSwitch';
import { useToggle, useTypeSafeTranslation } from 'hooks';
import React, { FC, useEffect } from 'react';
import { useMutation } from 'react-query';
import ConfirmModal from './ConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { useUser } from 'api/account';
interface Props {
  coin: any;
  withLabel?: boolean;
  withIcon?: boolean;
}

const ToggleCompound: FC<Props> = ({ coin, withLabel, withIcon }) => {
  const { t } = useTypeSafeTranslation();
  const { user } = useUser();

  const [isActive, toggleIsActive, setIsActive] = useToggle(false);
  const [openModal, toggleModal] = useToggle(false);
  const { data, isFetching, refetch } = useAutoCompoundFlag();
  const { mutateAsync, isLoading } = useMutation(setFlagAutoCompound, {
    onSuccess: () => {
      refetch();
    },
    onError: (err: TError) => {
      message.error(err.message);
    },
  });

  useEffect(() => {
    if (!data || !coin) return;

    setIsActive(data[coin]);
  }, [data, coin]);

  const handleSubmit = async () => {
    try {
      await mutateAsync({ coinName: coin, flagAutoCompound: !isActive });
      toggleIsActive();
      if (openModal) toggleModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = () => {
    if (!isActive) {
      return handleSubmit();
    }
    toggleModal();
  };

  if (!user) return null;
  return (
    <>
      <Tooltip title={<div className="center">Reward is Auto-compounded every Monday.</div>}>
        <Space>
          <StyledSwitch
            value={isActive}
            onChange={handleToggle}
            switchProps={{
              checkedChildren: <SyncAlt />,
              unCheckedChildren: <TimeSolid />,
              loading: isLoading || isFetching,
            }}
          />
          {withLabel && (
            <span onClick={handleToggle} className={`text-12 avenir cursor ${isActive ? 'positive' : ''}`}>
              Auto Compound
            </span>
          )}
          {withIcon && isActive && <FontAwesomeIcon color="#CDD1D3" icon={faQuestionCircle} />}
        </Space>
      </Tooltip>
      <ConfirmModal
        onClose={toggleModal}
        visible={openModal}
        payload={{
          coinName: coin,
          isActive,
        }}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default ToggleCompound;
