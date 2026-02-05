import { configureStore } from '@reduxjs/toolkit';
import { api } from './appApi';

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore RTK Query cache locations that may contain non-serializable values (e.g. Blob)
        ignoredPaths: [
          `${api.reducerPath}.queries`,
          `${api.reducerPath}.mutations`,
        ],
        // Ignore RTK Query fulfilled actions that carry the response payload (Blob)
        ignoredActions: [
          `${api.reducerPath}/executeQuery/fulfilled`,
          `${api.reducerPath}/executeMutation/fulfilled`,
        ],
      },
    }).concat(api.middleware),
});

export default store;





// import { configureStore } from '@reduxjs/toolkit'
// import { api } from './appApi'

// const store = configureStore({
//   reducer: {
//     [api.reducerPath]: api.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(api.middleware),
// })

// export default store