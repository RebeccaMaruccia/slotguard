import {Middleware, MiddlewareAPI} from "redux";
import {isRejectedWithValue} from "@reduxjs/toolkit";
import toast from "react-hot-toast";

interface errorResponse {
    data: any;
    status: number;
}

export const rtkQueryErrorLogger: Middleware =

    (api: MiddlewareAPI) => (next) => (action) => {
        // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
        if (isRejectedWithValue(action)) {
            let res = action.payload as errorResponse
            let error: any = res.data;
            console.error(error);
            toast.error(error?.details ?? "Unknown error occurred.");
        }

        return next(action)
    }