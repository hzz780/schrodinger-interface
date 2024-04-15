import React from 'react';
import { ReactComponent as ArchiveSVG } from 'assets/img/archive.svg';

interface ITableEmpty {
  description?: string;
}

function TableEmpty({ description }: ITableEmpty) {
  return (
    <div className="flex justify-center items-center flex-col p-[60px]">
      <ArchiveSVG className="w-[56px]" />
      {description && <span className="text-base text-neutralPrimary mt-[16px]">{description}</span>}
    </div>
  );
}

export default React.memo(TableEmpty);
