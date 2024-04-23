import { ENVIRONMENT } from 'constants/url';
export type AdEvent = 'adopt' | 'reroll' | 'connect_wallet';
import { store } from 'redux/store';

export class AdTracker {
  isValid: boolean | undefined;
  gtm: any;
  adInfo: any;
  constructor() {
    this.gtm = window?.dataLayer;
    this.adInfo = store.getState().info.adInfo;

    if (this.adInfo['utm_campaign']) {
      this.isValid = true;
    }
  }

  sendAdTrack(event: AdEvent, payload: any) {
    try {
      const env = process.env.NEXT_PUBLIC_APP_ENV as unknown as ENVIRONMENT;

      if (env === 'production' && this.isValid) {
        this.gtm.push({ event, ...this.adInfo, ...payload });
      }
    } catch (error) {
      console.error('track error:', error);
    }
  }

  static trackEvent(event: AdEvent, payload: any) {
    const tracker = new AdTracker();
    tracker.sendAdTrack(event, payload);
  }
}
