import { Collapse, CollapsePanel } from 'components/Collapse';
import { useTypeSafeTranslation } from 'hooks';
import React, { FC } from 'react';
import styles from './ProgramDetail.module.less';

const ProgramDetail: FC = () => {
  const { t } = useTypeSafeTranslation();
  return (
    <div className={styles.root}>
      <h1>{t('referral.other.program_detail')}</h1>

      <div className={styles.collapse}>
        <Collapse defaultActiveKey={['1']}>
          <CollapsePanel header="Any Questions In Your Mind?" key="1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum lacinia justo sed accumsan.
            Suspendisse non fringilla nibh. In rutrum metus at pellentesque malesuada. Quisque tempus ex at sapien
            fermentum pharetra. Integer pulvinar nibh tempus nunc imperdiet commodo. Nulla eget justo vehicula, dapibus
            sapien sed, consequat lacus. Mauris consequat tellus vel urna tincidunt, sed imperdiet ex rutrum. Nam tempus
            massa nec euismod elementum. Sed dictum turpis nec maximus pretium. Suspendisse viverra tellus vel urna
            rutrum!
          </CollapsePanel>
          <CollapsePanel header="Any Questions In Your Mind?" key="2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum lacinia justo sed accumsan.
            Suspendisse non fringilla nibh. In rutrum metus at pellentesque malesuada. Quisque tempus ex at sapien
            fermentum pharetra. Integer pulvinar nibh tempus nunc imperdiet commodo. Nulla eget justo vehicula, dapibus
            sapien sed, consequat lacus. Mauris consequat tellus vel urna tincidunt, sed imperdiet ex rutrum. Nam tempus
            massa nec euismod elementum. Sed dictum turpis nec maximus pretium. Suspendisse viverra tellus vel urna
            rutrum!
          </CollapsePanel>
          <CollapsePanel header="Any Questions In Your Mind?" key="3">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima mollitia neque, alias molestias dolor eaque
            perferendis ea ipsum sequi repellat accusamus sapiente ipsa consectetur adipisci. Animi dolorem culpa dolor
            voluptatibus!
          </CollapsePanel>
        </Collapse>
      </div>
    </div>
  );
};

export default ProgramDetail;
