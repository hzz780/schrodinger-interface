import { Button } from 'aelf-design';
import useResponsive from 'hooks/useResponsive';
import { ReactComponent as RefreshSVG } from 'assets/img/icons/refresh.svg';

export default function Header({ onClick }: { onClick: () => void }) {
  const { isMin } = useResponsive();
  return (
    <div className="flex justify-between items-center">
      <div className="text-neutralTitle text-2xl font-semibold">Latest Inscriptions</div>
      <Button className="!rounded-lg text-brandDefault border-brandDefault" onClick={onClick}>
        <div className="flex justify-center items-center gap-2 sm:min-w-0">
          <RefreshSVG className="w-5 h-5" />
          {!isMin && <span>Refresh</span>}
        </div>
      </Button>
    </div>
  );
}
