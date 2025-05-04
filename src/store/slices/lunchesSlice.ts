import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getLunches,
  getLunchById,
  createLunch,
  joinLunch,
  leaveLunch,        // импортируем новый API
} from '../../api/lunchesAPI';

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
  error: undefined,
};

export const fetchLunchesThunk = createAsyncThunk(
  'lunches/fetchAll',
  async () => {
    const lunches = await getLunches();
    return lunches;
  }
);

export const fetchLunchByIdThunk = createAsyncThunk(
  'lunches/fetchById',
  async (id: string) => {
    const lunch = await getLunchById(id);
    return lunch;
  }
);

export const createLunchThunk = createAsyncThunk(
  'lunches/create',
  async (data: { time: string; place: string; note: string }) => {
    const newLunch = await createLunch(data);
    return newLunch;
  }
);

export const joinLunchThunk = createAsyncThunk(
  'lunches/join',
  async (id: string) => {
    const updated = await joinLunch(id);
    return updated;
  }
);

export const leaveLunchThunk = createAsyncThunk(
  'lunches/leave',
  async (id: string) => {
    const updated = await leaveLunch(id);
    return updated;
  }
);

const lunchesSlice = createSlice({
  name: 'lunches',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // FETCH ALL
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

      // FETCH BY ID
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

      // CREATE
      .addCase(createLunchThunk.fulfilled, (state, action: PayloadAction<Lunch>) => {
        state.list.push(action.payload);
      })
      .addCase(createLunchThunk.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // JOIN
      .addCase(joinLunchThunk.fulfilled, (state, action: PayloadAction<Lunch>) => {
        const updated = action.payload;
        const idx = state.list.findIndex(l => l.id === updated.id);
        if (idx !== -1) state.list[idx] = updated;
        if (state.current?.id === updated.id) state.current = updated;
      })
      .addCase(joinLunchThunk.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // LEAVE
      .addCase(leaveLunchThunk.fulfilled, (state, action: PayloadAction<Lunch>) => {
        const updated = action.payload;
        const idx = state.list.findIndex(l => l.id === updated.id);
        if (idx !== -1) state.list[idx] = updated;
        if (state.current?.id === updated.id) state.current = updated;
      })
      .addCase(leaveLunchThunk.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

export default lunchesSlice.reducer;
