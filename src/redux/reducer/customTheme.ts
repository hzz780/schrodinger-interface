import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'redux/store';
import { HYDRATE } from 'next-redux-wrapper';
import { TCustomThemeType, CustomThemeType } from 'redux/types/reducerTypes';

const initialState: {
  customTheme: TCustomThemeType;
} = {
  customTheme: {
    layout: {
      backgroundStyle: 'bg-neutralWhiteBg',
    },
    header: {
      theme: CustomThemeType.light,
      hideMenu: false,
    },
    footer: {
      theme: CustomThemeType.light,
    },
  },
};

// Actual Slice
export const customThemeSlice = createSlice({
  name: 'customTheme',
  initialState,
  reducers: {
    setCustomTheme(state, action) {
      state.customTheme = action.payload;
    },
    resetCustomTheme(state) {
      state.customTheme = initialState.customTheme;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.customTheme,
      };
    },
  },
});

export const { setCustomTheme, resetCustomTheme } = customThemeSlice.actions;
export const getCustomTheme = (state: AppState) => state.customTheme;

export default customThemeSlice.reducer;
