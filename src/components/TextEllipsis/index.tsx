import { ToolTip } from 'aelf-design';
import { useRef, useState } from 'react';
import { useMount } from 'react-use';

interface ITextEllipsisProps {
  value: string;
  showTooltip?: boolean;
  className?: string;
}

export default function TextEllipsis({ value, showTooltip = true, className }: ITextEllipsisProps) {
  const [isTextOverflow, setTextOverflow] = useState<boolean>(false);
  const textRef = useRef<HTMLDivElement>(null);

  useMount(() => {
    const clientWidth = textRef?.current?.clientWidth ?? 0;
    const scrollWidth = textRef?.current?.scrollWidth ?? 0;
    setTextOverflow(scrollWidth > clientWidth);
  });

  return (
    <div className={className}>
      <ToolTip title={showTooltip && isTextOverflow ? value : ''}>
        <div className="truncate" ref={textRef}>
          {value}
        </div>
      </ToolTip>
    </div>
  );
}
