import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { Button } from 'aelf-design';
import clsx from 'clsx';
import { ITrait, TSGRToken } from 'types/tokens';
import { formatNumber, formatPercent, formatTokenPrice } from 'utils/format';
import { ReactComponent as RightArrowSVG } from 'assets/img/right_arrow.svg';
import { useModal } from '@ebay/nice-modal-react';
import LearnMoreModal from 'components/LearnMoreModal';
import { useCallback, useMemo } from 'react';
import { divDecimals } from 'utils/calculate';
import { ONE } from 'constants/misc';
import { Col, Row } from 'antd';
import { useResponsive } from 'hooks/useResponsive';
import TextEllipsis from 'components/TextEllipsis';
import HonourLabel from 'components/ItemCard/components/HonourLabel';

export default function ItemInfo({
  detail,
  rankInfo,
  onAdoptNextGeneration,
  showAdopt,
}: {
  detail: TSGRToken;
  rankInfo?: TRankInfoAddLevelInfo;
  onAdoptNextGeneration: () => void;
  showAdopt?: boolean;
}) {
  const learnMoreModal = useModal(LearnMoreModal);
  const onLearnMoreClick = useCallback(() => {
    learnMoreModal.show({
      item: {
        ...detail,
        rank: rankInfo?.rank ? `${rankInfo?.rank}` : '',
      },
    });
  }, [detail, learnMoreModal, rankInfo?.rank]);
  const { isLG } = useResponsive();

  const isLearnMoreShow = useMemo(
    () => detail.generation === 0 || divDecimals(detail.amount, detail.decimals).gte(ONE),
    [detail.amount, detail.decimals, detail.generation],
  );

  const renderTraitsCard = useCallback(
    (item: ITrait) => {
      return (
        <Col span={isLG ? 24 : 8} key={item.traitType} className="px-[8px]">
          <div className="flex flex-row lg:flex-col justify-center items-end lg:items-center bg-[#FAFAFA] overflow-hidden rounded-lg cursor-default py-[16px] lg:py-[24px] !px-[24px]">
            <div key={item.traitType} className="flex-1 lg:flex-none lg:w-full overflow-hidden mr-[16px] lg:mr-0">
              <TextEllipsis
                value={item.traitType}
                className="text-neutralSecondary text-left lg:text-center font-medium text-sm"
              />
              <TextEllipsis
                value={item.value}
                className="w-full text-left lg:text-center mt-[8px] text-neutralTitle font-medium text-xl"
              />
            </div>

            <div className="mt-[8px] text-neutralSecondary flex justify-end lg:justify-center font-medium text-base">
              {`${formatPercent(item.percent)}%`}
            </div>
          </div>
        </Col>
      );
    },
    [isLG],
  );

  const traits = () => {
    return <Row gutter={[16, 16]}>{detail.traits.map((item) => renderTraitsCard(item))}</Row>;
  };

  const noTraits = () => {
    return (
      <div className="w-full flex flex-col justify-center items-center">
        <div className="text-neutralSecondary font-medium	text-lg text-center mt-[10px]">
          Seems like this is a gen0 kitten with no traits. <br />
          Take this kitten to the next level by adopting a next-gen cat, <br />
          generating brand new and unpredictable traits.
        </div>
        {showAdopt && (
          <Button
            type="primary"
            className="!rounded-lg mr-[12px] mt-[24px] mb-[56px] w-[239px]"
            size="large"
            onClick={onAdoptNextGeneration}>
            Adopt Next-Gen Cat
          </Button>
        )}
      </div>
    );
  };

  const levelInfoToken = useMemo(() => {
    if (isLG) {
      return formatNumber(rankInfo?.levelInfo?.token || '');
    } else {
      return formatTokenPrice(rankInfo?.levelInfo?.token || '');
    }
  }, [rankInfo?.levelInfo?.token, isLG]);

  const awakenPrice = useMemo(() => {
    if (isLG) {
      return formatNumber(rankInfo?.levelInfo?.awakenPrice || '');
    } else {
      return formatTokenPrice(rankInfo?.levelInfo?.awakenPrice || '');
    }
  }, [rankInfo?.levelInfo?.awakenPrice, isLG]);

  return (
    <div className="flex flex-col w-full flex-none lg:flex-1 mt-[16px] lg:mt-[0px]">
      <div className="w-full rounded-2xl border-solid border border-[#E1E1E1] p-4">
        <div className="flex flex-row justify-between items-center">
          <div className="text-neutralTitle font-medium	text-[20px] leading-[28px]">Info</div>
          {rankInfo?.levelInfo?.describe && <HonourLabel text={rankInfo?.levelInfo?.describe} className="bg-white" />}
        </div>
        <div className="flex flex-row justify-between items-center mt-3 text-lg font-normal">
          <div className="text-neutralSecondary">Generation</div>
          <div className="text-neutralTitle font-medium">{detail.generation}</div>
        </div>
        {rankInfo?.levelInfo?.level && (
          <div className="flex flex-row justify-between items-center mt-2 text-lg font-normal">
            <div className="text-neutralSecondary">Level</div>
            <div className="text-neutralTitle font-medium">Lv. {rankInfo?.levelInfo?.level}</div>
          </div>
        )}
        {!!rankInfo?.rank && (
          <div className="flex flex-row justify-between items-center mt-2 text-lg font-normal">
            <div className="text-neutralSecondary">Rank</div>
            <div className="text-neutralTitle font-medium">{formatTokenPrice(rankInfo.rank)}</div>
          </div>
        )}
        {(rankInfo?.levelInfo?.token || rankInfo?.levelInfo?.awakenPrice) && (
          <div className="flex flex-row justify-between items-start mt-2 text-lg font-normal">
            <div className="text-neutralSecondary max-w-[170px] md:max-w-max">Recommended Price</div>
            <div className="flex flex-col items-end">
              {rankInfo?.levelInfo?.token && <div className="text-neutralTitle font-medium">{levelInfoToken} SGR</div>}
              {rankInfo?.levelInfo?.awakenPrice && (
                <div className="font-medium text-neutralSecondary text-base">{awakenPrice} ELF</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="w-full rounded-2xl border-solid border border-[#E1E1E1] flex flex-col mt-[16px]">
        <div className="ml-[8px] w-full h-[72px] flex flex-row justify-between items-center p-[24px]">
          <div className="text-neutralTitle font-medium	text-lg">Traits</div>
          <ArrowSVG className={clsx('size-4', 'mr-[16px]', { ['common-revert-180']: true })} />
        </div>
        <div className="px-[16px] pb-[16px] w-full overflow-hidden">
          {detail.generation == 0 ? noTraits() : traits()}
        </div>
      </div>
      {isLearnMoreShow && (
        <div className="flex justify-end mt-[16px]">
          <div className="cursor-pointer flex items-center" onClick={onLearnMoreClick}>
            <span className="text-neutralTitle text-base">Learn More</span>
            <RightArrowSVG className="ml-[8px]" />
          </div>
        </div>
      )}
    </div>
  );
}
