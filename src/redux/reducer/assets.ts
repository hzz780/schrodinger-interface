import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { TAssetsStateType } from 'redux/types/reducerTypes';

const initialState: TAssetsStateType = {};

// Actual Slice
export const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    setTxFee(state, action) {
      state.txFee = action.payload;
    },
    setTokenPriceMap(state, action) {
      const tokenPriceMap = { ...state.tokenPriceMap, ...action.payload };
      state.tokenPriceMap = tokenPriceMap;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.assets,
      };
    },
  },
});

export const { setTxFee, setTokenPriceMap } = assetsSlice.actions;

export default assetsSlice.reducer;
