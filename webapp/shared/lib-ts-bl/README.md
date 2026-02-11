# lib-ts-bl

## Description

Library written in typescript that uses redux as state management, and Redux Toolkit (RTK) for writing Redux logic. The
@reduxjs/toolkit package wraps around the core redux package, and contains API methods and common dependencies essential
for building a Redux app. The library provide the store for the business logic, external calls, and actions to reading
and writing into global state

## Available Scripts

<ins>
The scripts usable in this project are present exclusively in the [package.json file](/package.json) of the root directory.
</ins>

## Learn More

You can learn more in
the [Getting Started with Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started).

## Reedux State Design

#### Structure

| Folder name | Description                                                                                                                                                                        |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Constants   | Contains Enums and useful constants                                                                                                                                                |
| Models      | Contains Enums and useful constants                                                                                                                                                |
| Reducers    | Contains the typescript files with the configuration of the individual reducers, selectors, actions, and types that characterize the individual reducer (See **_Good practices_**) |
| rootStore   | Contains the typescript file with the root store configuration that encapsulates all reducers used by the application                                                              |

> **_Good practises:_** In case you need to add a new reducer, a good practice is to create a new folder "ReducerName"
> inside "reducers" folder and follow the current file tree:

- reducerName---> Ex: preventivo
    - action.ts
    - selectors.ts
    - type.ts
    - "reducerName"Reducer ---> Ex: preventivoReducer

<br/>
Una volta creato il reducer basta referenziare il reducer appena creato all'interno del root reducer.

```typescript
const rootReducer = combineReducers({
  common: commonReducer,
  preventivo: persistReducer(preventivoPersistConfig, preventivoReducer),
  [bffServiceApi.reducerPath]: bffServiceApi.reducer,
  new: newReducer,
});
```
