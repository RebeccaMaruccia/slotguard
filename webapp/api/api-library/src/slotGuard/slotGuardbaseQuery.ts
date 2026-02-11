import {createApi} from "@reduxjs/toolkit/query/react";
import {customBaseQuery} from "../customBaseQuery";

export const api = createApi({
                        reducerPath: "slotGuard",
                        baseQuery: customBaseQuery,
                        endpoints: () => ({}),
                });
                