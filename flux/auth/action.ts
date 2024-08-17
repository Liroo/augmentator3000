import { generateWCLBearerToken } from '@/services/wcl/generateBearer';
import { ThunkApiConfig, ThunkArg } from '@/types/thunk';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setBearerToken, setCredentials } from './reducer';
import { selectAuthCredentials } from './selector';

import WCLClient from 'services/wcl';

export const authGenerateWCLBearerToken = createAsyncThunk<
  string,
  { clientId: string; clientSecret: string } & ThunkArg,
  ThunkApiConfig
>(
  'wcl/generateWCLBearerToken',
  async ({ clientId, clientSecret }, { dispatch, getState }) => {
    const access_token = await generateWCLBearerToken(clientId, clientSecret);
    const credentials = selectAuthCredentials(getState());

    if (
      credentials.clientId !== clientId ||
      credentials.clientSecret !== clientSecret
    )
      dispatch(setCredentials({ clientId, clientSecret }));

    dispatch(setBearerToken(access_token));

    WCLClient.setWCLBearerToken(access_token);

    return access_token;
  },
);
