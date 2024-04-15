import clsx from 'clsx';
import GenerationLabel from '../GenerationLabel';
import LevelLabel from '../LevelLabel';
import HonourLabel from '../HonourLabel';

export interface IDecorationModuleProps {
  generation: number | string;
  level?: number | string;
  honor?: string;
  className?: string;
}

export default function DecorationModule(props: IDecorationModuleProps) {
  const { generation, level, honor, className } = props;
  return (
    <div className={clsx('flex flex-col gap-1 w-full', className)}>
      <div className="flex flex-row justify-between">
        <GenerationLabel num={generation} />
        {honor && <HonourLabel text={honor} />}
      </div>
      {level && <LevelLabel num={level} />}
    </div>
  );
}
