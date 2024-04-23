import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'aelf-design';
import DetailTitle from './components/DetailTitle';
import ItemImage from './components/ItemImage';
import ItemInfo from './components/ItemInfo';
import { Breadcrumb } from 'antd';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWalletService } from 'hooks/useWallet';
import { useCmsInfo } from 'redux/hooks';
import clsx from 'clsx';
import { ITrait, TSGRTokenInfo } from 'types/tokens';
import useAdoptHandler from 'hooks/Adopt/useAdoptModal';
import { useResetHandler } from 'hooks/useResetHandler';
import useLoading from 'hooks/useLoading';
import { useTimeoutFn } from 'react-use';
import MarketModal from 'components/MarketModal';
import { useModal } from '@ebay/nice-modal-react';
import { formatTraits } from 'utils/formatTraits';
import { getCatsRankProbability } from 'utils/getCatsRankProbability';
import { addPrefixSuffix } from 'utils/addressFormatting';
import { usePageForm } from './hooks';
import { getCatDetail } from 'api/request';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { useWebLoginEvent, WebLoginEvents } from 'aelf-web-login';

export default function DetailPage() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const symbol = searchParams.get('symbol') || '';
  const [fromListAll] = usePageForm();
  const { isLogin } = useGetLoginStatus();

  const { wallet } = useWalletService();
  const cmsInfo = useCmsInfo();
  const { showLoading, closeLoading } = useLoading();
  const marketModal = useModal(MarketModal);

  const tradeModal = useMemo(() => {
    return cmsInfo?.tradeModal;
  }, [cmsInfo?.tradeModal]);

  const [schrodingerDetail, setSchrodingerDetail] = useState<TSGRTokenInfo>();
  const [rankInfo, setRankInfo] = useState<TRankInfoAddLevelInfo>();

  const adoptHandler = useAdoptHandler();
  const resetHandler = useResetHandler();

  const generateCatsRankInfo = async (generation: number, traits: ITrait[], address: string) => {
    if (generation !== 9) {
      setRankInfo(undefined);
      throw '';
    }
    const paramsTraits = formatTraits(traits);
    if (!paramsTraits) {
      setRankInfo(undefined);
      throw '';
    }
    const catsRankProbability = await getCatsRankProbability({
      catsTraits: [paramsTraits],
      address: addPrefixSuffix(address),
    });
    setRankInfo((catsRankProbability && catsRankProbability?.[0]) || undefined);
  };

  const getDetail = useCallback(async () => {
    console.log('getDetailInGuestMode');
    if (wallet.address && !isLogin) return;
    let result;
    try {
      showLoading();
      result = await getCatDetail({ symbol, chainId: cmsInfo?.curChain || '' });
      const generation = result?.generation;
      const traits = result?.traits;
      await generateCatsRankInfo(generation, traits, wallet.address);
    } catch (error) {
      console.log('getDetailInGuestMode-error', error);
    } finally {
      closeLoading();
      setSchrodingerDetail(result);
    }
  }, [closeLoading, cmsInfo?.curChain, isLogin, showLoading, symbol, wallet.address]);

  const onAdoptNextGeneration = () => {
    if (!schrodingerDetail) return;
    adoptHandler(schrodingerDetail, wallet.address, rankInfo);
  };

  const onReset = () => {
    if (!schrodingerDetail) return;
    resetHandler(schrodingerDetail, wallet.address, rankInfo);
  };

  const onBack = useCallback(() => {
    const path = fromListAll ? '/' : '/my-cats';
    route.replace(path);
  }, [fromListAll, route]);

  const genGtZero = useMemo(() => (schrodingerDetail?.generation || 0) > 0, [schrodingerDetail?.generation]);
  const genLtNine = useMemo(() => (schrodingerDetail?.generation || 0) < 9, [schrodingerDetail?.generation]);
  const holderNumberGtZero = useMemo(
    () => (schrodingerDetail?.holderAmount || 0) > 0,
    [schrodingerDetail?.holderAmount],
  );
  const showAdopt = useMemo(() => holderNumberGtZero && genLtNine, [genLtNine, holderNumberGtZero]);

  const showReset = useMemo(() => holderNumberGtZero && genGtZero, [genGtZero, holderNumberGtZero]);

  function adoptAndResetButton() {
    return (
      <div className="flex flex-row">
        {showAdopt && (
          <Button type="primary" className="!rounded-lg mr-[12px]" size="large" onClick={onAdoptNextGeneration}>
            Adopt Next-Gen Cat
          </Button>
        )}
        {showReset && (
          <Button
            type="default"
            className="!rounded-lg !border-brandDefault !text-brandDefault mr-[12px]"
            size="large"
            onClick={onReset}>
            Reroll
          </Button>
        )}
      </div>
    );
  }

  const adoptAndResetButtonSmall = () => {
    return (
      <div className="flex fixed bottom-0 left-0 flex-row w-full justify-end p-[16px] bg-neutralWhiteBg border-0 border-t border-solid border-neutralDivider ">
        {showAdopt && (
          <Button type="primary" className="!rounded-lg flex-1" size="large" onClick={onAdoptNextGeneration}>
            Adopt Next-Gen Cat
          </Button>
        )}
        {showReset && (
          <Button
            type="default"
            className="!rounded-lg !border-brandDefault !text-brandDefault ml-[16px] w-[100px]"
            size="large"
            onClick={onReset}>
            Reroll
          </Button>
        )}
      </div>
    );
  };

  const onTrade = useCallback(() => {
    if (!schrodingerDetail) return;
    marketModal.show({ isTrade: true, detail: schrodingerDetail });
  }, [marketModal, schrodingerDetail]);

  useTimeoutFn(() => {
    if (!fromListAll && !isLogin) {
      onBack();
    }
  }, 3000);

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  useWebLoginEvent(WebLoginEvents.LOGOUT, () => onBack());

  return (
    <section className="mt-[24px] lg:mt-[24px] flex flex-col items-center w-full">
      <div className="w-full max-w-[1360px] hidden lg:block">
        <Breadcrumb
          items={[
            {
              title: (
                <span className=" cursor-pointer" onClick={onBack}>
                  Schrodinger
                </span>
              ),
            },
            {
              title: <div>{schrodingerDetail?.symbol}</div>,
            },
          ]}
        />
        <div className="w-full h-[68px] mt-[40px] overflow-hidden flex flex-row justify-between">
          {schrodingerDetail && <DetailTitle detail={schrodingerDetail} fromListAll={fromListAll} />}
          <div className="h-full flex-1 min-w-max flex flex-row justify-end items-end">
            {adoptAndResetButton()}
            {tradeModal?.show && schrodingerDetail && (
              <Button
                type="default"
                className="!rounded-lg !border-brandDefault !text-brandDefault"
                size="large"
                onClick={onTrade}>
                Trade
              </Button>
            )}
          </div>
        </div>
        <div className="w-full mt-[24px] flex flex-row justify-between items-start">
          {schrodingerDetail && (
            <ItemImage
              detail={schrodingerDetail}
              level={rankInfo?.levelInfo?.level}
              rarity={rankInfo?.levelInfo?.describe}
              rank={rankInfo?.rank}
            />
          )}
          {schrodingerDetail && (
            <ItemInfo
              showAdopt={holderNumberGtZero}
              detail={schrodingerDetail}
              rankInfo={rankInfo}
              onAdoptNextGeneration={onAdoptNextGeneration}
            />
          )}
        </div>
      </div>

      <div className="w-full max-w-[1360px] flex flex-col items-center lg:hidden">
        <div className="w-full flex flex-row justify-start items-center" onClick={onBack}>
          <ArrowSVG className={clsx('size-4', { ['common-revert-90']: true })} />
          <div className="ml-[8px] font-semibold text-sm w-full">Back</div>
        </div>
        <div className="mt-[16px]" />
        {schrodingerDetail && <DetailTitle detail={schrodingerDetail} fromListAll={fromListAll} />}
        {schrodingerDetail && (
          <ItemImage
            detail={schrodingerDetail}
            level={rankInfo?.levelInfo?.level}
            rarity={rankInfo?.levelInfo?.describe}
            rank={rankInfo?.rank}
          />
        )}
        {tradeModal?.show && schrodingerDetail && (
          <Button
            type="default"
            className="!rounded-lg !border-brandDefault !text-brandDefault h-[48px] w-full mt-[16px]"
            size="medium"
            onClick={onTrade}>
            Trade
          </Button>
        )}
        {schrodingerDetail && (
          <ItemInfo detail={schrodingerDetail} rankInfo={rankInfo} onAdoptNextGeneration={onAdoptNextGeneration} />
        )}
        {adoptAndResetButtonSmall()}
      </div>
    </section>
  );
}
