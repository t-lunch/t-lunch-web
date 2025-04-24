import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getLunches, getLunchById, createLunch, joinLunch } from '../../api/lunchesAPI';

export interface Participant {
  id: string;
  name: string;
}

export interface Lunch {
  id: string;
  time: string;
  place: string;
  note?: string;
  participants: number;
  creatorId: string;
  creatorName: string;
  participantsList: Participant[];
}

interface LunchesState {
  list: Lunch[];
  current?: Lunch;
  loadingList: boolean;
  loadingCurrent: boolean;
  error?: string;
}

const initialState: LunchesState = {
  list: [],
  loadingList: false,
  loadingCurrent: false,
};

export const fetchLunchesThunk = createAsyncThunk(
  'lunches/fetchAll',
  async () => await getLunches()
);

export const fetchLunchByIdThunk = createAsyncThunk(
  'lunches/fetchById',
  async (id: string) => await getLunchById(id)
);

export const createLunchThunk = createAsyncThunk(
  'lunches/create',
  async (data: { time: string; place: string; note: string; participants: number }) =>
    await createLunch(data)
);

export const joinLunchThunk = createAsyncThunk(
  'lunches/join',
  async (id: string) => await joinLunch(id)
);

const lunchesSlice = createSlice({
  name: 'lunches',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchLunchesThunk.pending, state => {
        state.loadingList = true;
        state.error = undefined;
      })
      .addCase(fetchLunchesThunk.fulfilled, (state, action: PayloadAction<Lunch[]>) => {
        state.loadingList = false;
        state.list = action.payload;
      })
      .addCase(fetchLunchesThunk.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.error.message;
      })

      .addCase(fetchLunchByIdThunk.pending, state => {
        state.loadingCurrent = true;
        state.error = undefined;
      })
      .addCase(fetchLunchByIdThunk.fulfilled, (state, action: PayloadAction<Lunch>) => {
        state.loadingCurrent = false;
        state.current = action.payload;
      })
      .addCase(fetchLunchByIdThunk.rejected, (state, action) => {
        state.loadingCurrent = false;
        state.error = action.error.message;
      })

      .addCase(createLunchThunk.fulfilled, (state, action: PayloadAction<Lunch>) => {
        state.list.push(action.payload);
      })

      .addCase(joinLunchThunk.fulfilled, (state, action: PayloadAction<Lunch>) => {
        const updated = action.payload;
        const idx = state.list.findIndex(l => l.id === updated.id);
        if (idx !== -1) {
          state.list[idx] = updated;
        }
        if (state.current?.id === updated.id) {
          state.current = updated;
        }
      });
  }
});

export default lunchesSlice.reducer;
