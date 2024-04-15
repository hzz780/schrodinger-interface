import { Image, ImageProps } from 'antd';
import { Button } from 'aelf-design';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReactComponent as EyeSVG } from 'assets/img/icons/eye.svg';
import { ReactComponent as RadioSelect } from 'assets/img/icons/radio-select.svg';
import DefaultCatImg from 'assets/img/icons/defaultCat.png';
import useResponsive from 'hooks/useResponsive';
import clsx from 'clsx';
import styles from './style.module.css';
import uriToHttp from 'utils/format';
interface IAIImageProps {
  src: string;
  active: boolean;
  index: number;
  onSelect: (index: number) => void;
}

function AIImage({ src, active, index, onSelect }: IAIImageProps) {
  const { isLG } = useResponsive();
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [srcIndex, setSrcIndex] = useState<number>(0);
  const [imgUrl, setImageUrl] = useState<string>('');

  const srcList = useMemo(() => uriToHttp(src).concat(DefaultCatImg.src), [src]);
  useEffect(() => setImageUrl(srcList[srcIndex]), [srcIndex, srcList]);

  const preview = useMemo<ImageProps['preview']>(() => {
    return isLG
      ? {
          visible: show,
          maskClassName: 'rounded-lg !opacity-0',
          onVisibleChange: () => setShow(false),
        }
      : {
          visible: error ? false : undefined,
          maskClassName: clsx('rounded-lg', error && '!opacity-0'),
        };
  }, [error, isLG, show]);

  const onClick = useCallback(() => {
    onSelect(index);
  }, [index, onSelect]);

  const onError = useCallback(() => {
    console.log('image-load-error');
    const _index = srcIndex + 1;
    const defaultImgIndex = srcList.length - 1;

    if (_index >= defaultImgIndex) {
      setError(true);
      setShow(false);
      setSrcIndex(defaultImgIndex);
      setImageUrl(srcList[defaultImgIndex]);
      return;
    }
    setSrcIndex(_index);
  }, [srcIndex, srcList]);

  const onReload = useCallback(() => {
    console.log('onReload');
    const urlFirst = srcList[0];

    if (!urlFirst.startsWith('http')) return;

    const _imgUrl = new URL(urlFirst);
    _imgUrl.searchParams.append('stamp', Date.now().toString());
    setImageUrl(_imgUrl.toString());
  }, [srcList]);

  const onLoad = useCallback(() => {
    console.log('onLoad');
    setError(srcIndex === srcList.length - 1);
  }, [srcIndex, srcList.length]);

  const Radio = useMemo(() => {
    return (
      <div
        className={clsx(
          styles.radio,
          'bg-fillMask3 shadow-selectShadow w-[28px] h-[28px] rounded-[28px] border-[2.5px] border-solid border-neutralWhiteBg hover:border-brandDefault mt-2 mr-2',
          active && '!border-brandDefault !bg-brandDefault',
        )}>
        {active ? <RadioSelect /> : null}
      </div>
    );
  }, [active]);

  return (
    <div
      className={clsx(
        styles.radio,
        'relative border-solid bg-[#F5FEF7] flex-1 aspect-square lg:flex-none lg:w-[120px] lg:h-[120px] rounded-lg overflow-hidden',
        active ? 'border-[2px] border-brandDefault' : 'border border-neutralBorder',
      )}>
      {!error && (
        <div
          className="flex absolute w-full h-full justify-end lg:justify-center lg:items-center lg:h-[36px] lg:w-[36px]  lg:top-0 lg:right-0 cursor-pointer z-10"
          onClick={onClick}>
          {Radio}
        </div>
      )}
      <Image
        id="ai-image"
        className={clsx('w-full h-full')}
        src={imgUrl}
        alt="AI-image"
        preview={preview}
        onError={onError}
        onLoad={onLoad}
      />
      {isLG && !error && (
        <div
          className="absolute bottom-3 left-3 flex justify-center items-center rounded-md px-1 py-2 bg-fillMask1 w-[24px] h-[24px] z-20 cursor-pointer"
          onClick={() => setShow(true)}>
          <EyeSVG />
        </div>
      )}
      {error && (
        <div className="absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center bg-fillMask1 rounded-lg lg:opacity-0 hover:lg:opacity-100 cursor-pointer">
          <Button type="primary" size="small" onClick={onReload}>
            Reload
          </Button>
        </div>
      )}
    </div>
  );
}

interface IAIImageSelectProps {
  list?: string[];
  onSelect: (index: number) => void;
}

export default function AIImageSelect({ list, onSelect }: IAIImageSelectProps) {
  const [current, setCurrent] = useState<number>(-1);

  const onClick = useCallback(
    (index: number) => {
      setCurrent(index);
      onSelect?.(index);
    },
    [onSelect],
  );

  useEffect(() => {
    if (list?.length === 1) {
      onClick(0);
    }
  }, [list, onClick]);

  return (
    <div className="flex gap-[16px] flex-wrap bg-brandBg border border-solid border-brandEnable rounded-lg p-[16px]">
      {list?.map((src, index) => (
        <AIImage key={index} src={src} index={index} active={current === index} onSelect={onClick} />
      ))}
    </div>
  );
}
