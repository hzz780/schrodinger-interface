import AccountModal from './components/AccountModal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useModal } from '@ebay/nice-modal-react';
import { useCallback } from 'react';
import { AcceptReferral } from 'contract/schrodinger';
import { store } from 'redux/store';
import { setIsJoin } from 'redux/reducer/info';
import { joinContent, joinTitle, joinButton } from 'constants/joinMessage';

export default function useAccountModal() {
  const modal = useModal(AccountModal);
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const newUser = useCallback(() => {
    modal.show({
      showLoading: true,
      title: joinTitle,
      content: joinContent,
      btnText: joinButton,
      onOk: async () => {
        const referrerAddress = urlSearchParams.get('referrer') || '';
        // auto joined
        await AcceptReferral({
          referrer: referrerAddress,
        });
        store.dispatch(setIsJoin(true));
        modal.hide();
        router.push('/');
      },
    });
  }, [modal, router, urlSearchParams]);

  const oldUser = useCallback(() => {
    modal.show({
      title: 'Explore Inscriptions',
      content:
        'Your account has already joined Schrödinger and is ineligible to accept additional invitations. Simply click the button below to explore the enchanting realm of AI-powered ACS-404 inscriptions.',
      btnText: 'View My Inscriptions',
      onOk: () => {
        modal.hide();
        router.push('/');
      },
    });
  }, [modal, router]);

  return { newUser, oldUser };
}
