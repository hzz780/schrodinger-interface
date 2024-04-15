import { Row, Col } from 'antd';
import clsx from 'clsx';
import NewIcon from 'components/NewIcon';
import { ITrait } from 'types/tokens';
import useResponsive from 'hooks/useResponsive';
import { useMemo } from 'react';
import { convertDecimalToPercentage, formatPercent } from 'utils/format';
import TextEllipsis from 'components/TextEllipsis';

interface ITraitItem {
  item: ITrait;
  isLG: boolean;
  showNew?: boolean;
}

interface ITraitsListProps {
  data: ITrait[];
  showNew?: boolean;
}

function TraitsItem({ item, showNew, isLG }: ITraitItem) {
  const { traitType, value, percent } = item;
  return (
    <div
      className={clsx(
        'relative flex flex-col justify-center py-[6px] px-[12px] bg-neutralDefaultBg rounded-md font-medium text-center text-xs text-neutralSecondary',
        !showNew && !isLG && 'px-[8px]',
      )}>
      <TextEllipsis value={traitType} />
      <TextEllipsis className="text-sm text-neutralTitle" value={value} />
      <div>{formatPercent(percent)}%</div>
      {showNew && <NewIcon className="absolute top-[-3px] right-[-8px]" />}
    </div>
  );
}

export default function TraitsList({ data = [], showNew = false }: ITraitsListProps) {
  const { isLG } = useResponsive();
  const colSpan = useMemo(() => {
    if (isLG) return 24;
    if (showNew) return 8;
    return 6;
  }, [isLG, showNew]);

  return (
    <Row gutter={[16, 16]}>
      {data.map((item, index) => (
        <Col span={colSpan} key={index}>
          <TraitsItem item={item} showNew={showNew} isLG={isLG} />
        </Col>
      ))}
    </Row>
  );
}
