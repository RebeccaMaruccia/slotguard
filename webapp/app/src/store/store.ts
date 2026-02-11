import {Action, combineReducers, configureStore, ThunkAction,} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {persistReducer, persistStore} from "redux-persist";
import {rtkQueryErrorLogger} from "./Error/ErrorMiddleware";
import {environment} from "../shared/environment";
import {commonReducer} from "lib-ts-bl/dist/reducers/auth";
import {configurazioniReducer} from "lib-ts-bl/dist";
import {slotGuardServiceApi} from "api-service";

const rootReducer = combineReducers({
  common: commonReducer,
  configuration: configurazioniReducer,
  [slotGuardServiceApi.reducerPath]: slotGuardServiceApi.reducer,
});

const persistConfig = {
  key: "root",
  storage: storage,
  [slotGuardServiceApi.reducerPath]: slotGuardServiceApi.reducer,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const middleware = [slotGuardServiceApi.middleware];

export const store: any = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: true,
      serializableCheck: false,
      thunk: {
        extraArgument: {
          baseUrl: environment.api.baseUrl,
          headersEnricher: (headers: Headers) => {
            const token = sessionStorage.getItem(
              environment.auth.accessTokenName,
            );
            const tokenRest = sessionStorage.getItem(
              environment.auth.refreshTokenName,
            );
            if (token) {
              headers.set("Authorization", `Bearer ${token}`);
              headers.set("AuthorizationRest", `${tokenRest}`);
            }
          },
        },
      },
    })
      .concat(middleware)
      .concat(rtkQueryErrorLogger),
});
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
