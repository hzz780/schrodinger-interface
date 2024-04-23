import { Flex } from 'antd';
import { ReactComponent as ArchiveSVG } from 'assets/img/archive.svg';

export default function FilterMenuEmpty() {
  return (
    <Flex className="py-12 pl-4 pr-5" vertical gap={16} align="center">
      <ArchiveSVG className="size-14" />
      {/* TODO: adjust the text */}
      <span className="text-base text-neutralPrimary font-medium">No data</span>
    </Flex>
  );
}
