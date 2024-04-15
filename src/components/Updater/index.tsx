'use client';
import { useInitData } from 'hooks/useInitData';
import useNavigationGuard from 'provider/useNavigationGuard';

const Updater = () => {
  useInitData();
  useNavigationGuard();
  return null;
};

export default Updater;
