'use client';

export const isWeChatBrowser = () => {
  const ua = navigator.userAgent.toLowerCase();
  const regex = /micromessenger/gi;
  if (ua.match(regex)) {
    return true;
  } else {
    return false;
  }
};
