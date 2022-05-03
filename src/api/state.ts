import * as React from "react";
import { AlertColor } from "@mui/material";

export interface IAppContext {
    setBackDropStatus?: (status: React.SetStateAction<boolean>) => void;
    openSnackBar?: (message: string, severity: AlertColor) => void;
    logout?: () => void;
    navigate?: (path: string) => void;
}

export default React.createContext<IAppContext>({});;