/* eslint-disable @next/next/no-img-element */
import { ImgHTMLAttributes, ReactEventHandler, useCallback, useMemo, useState } from 'react';
import uriToHttp from 'utils/format';

export default function CustomImageLoader({
  src = '',
  alt,
  onError,
  ...props
}: {
  src?: string;
} & ImgHTMLAttributes<HTMLImageElement>) {
  const [srcIndex, setSrcIndex] = useState<number>(0);

  const srcs = useMemo(() => uriToHttp(src), [src]);

  const imageUrl = useMemo(() => srcs[srcIndex], [srcIndex, srcs]);

  const nextSrc: ReactEventHandler<HTMLImageElement> = useCallback(
    (e) => {
      const _index = srcIndex + 1;

      if (!srcs[_index]) {
        onError?.(e);
        return;
      }
      setSrcIndex(_index);
    },
    [srcIndex, srcs, onError],
  );
  return <img {...props} src={imageUrl} alt={alt} onError={nextSrc} />;
}
