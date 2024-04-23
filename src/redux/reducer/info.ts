import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'redux/store';
import { HYDRATE } from 'next-redux-wrapper';
import { InfoStateType, ThemeType } from 'redux/types/reducerTypes';
import { ListTypeEnum } from 'types';

const initialState: InfoStateType = {
  isMobile: false,
  isSmallScreen: false,
  baseInfo: {
    rpcUrl: '',
  },
  theme: ThemeType.light,
  itemsFromLocal: [],
  isJoin: false,
  curViewListType: ListTypeEnum.All,
};

// Actual Slice
export const infoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {
    setAdInfo(state, action) {
      try {
        const payload = action.payload;
        const keys =
          Object.keys(payload).filter((key) => {
            return ['utm_campaign', 'utm_content', 'utm_medium', 'utm_source'].includes(key);
          }) || [];
        const adInfo = {} as unknown as any;
        keys.forEach((k: string) => {
          adInfo[k] = payload[k];
        });
        state.adInfo = adInfo;
      } catch (error) {
        console.error(error);
      }
    },
    setIsMobile(state, action) {
      state.isMobile = action.payload;
    },
    setItemsFromLocal(state, action) {
      // console.log('action',action)
      state.itemsFromLocal = action.payload;
    },
    setCmsInfo(state, action) {
      state.cmsInfo = action.payload;
    },
    setIsJoin(state, action) {
      state.isJoin = action.payload;
    },
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage?.setItem('theme', action.payload);
      if (action.payload === ThemeType.dark) {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
    },
    setCurViewListType(state, action) {
      state.curViewListType = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.info,
      };
    },
  },
});

export const { setIsMobile, setItemsFromLocal, setTheme, setCmsInfo, setIsJoin, setCurViewListType, setAdInfo } =
  infoSlice.actions;
export const selectInfo = (state: AppState) => state.info;
export const getJoinStats = (state: AppState) => state.info.isJoin;

export default infoSlice.reducer;
