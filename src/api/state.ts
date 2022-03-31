import * as React from "react";
import { AlertColor } from "@mui/material";

export interface IAppContext {
    setBackDropStatus?: (status: React.SetStateAction<boolean>) => void;
    openSnackBar?: (message: string, severity: AlertColor) => void;
}

export default React.createContext<IAppContext>({});;