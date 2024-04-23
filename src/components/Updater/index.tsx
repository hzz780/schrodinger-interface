'use client';
import { useInitData } from 'hooks/useInitData';
import useUpdateLoginStatus from 'hooks/useUpdateLoginStatus';
import useNavigationGuard from 'provider/useNavigationGuard';

const Updater = () => {
  useInitData();
  useNavigationGuard();
  useUpdateLoginStatus();
  return null;
};

export default Updater;
