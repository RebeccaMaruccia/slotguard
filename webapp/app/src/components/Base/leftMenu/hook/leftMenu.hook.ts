import React from "react";
import {useTheme} from "@mui/material";

const useLeftMenuHook = () => {

    const [selected, setSelected] = React.useState<string>();
    const [open, setOpen] = React.useState<boolean>(true);
    const theme = useTheme();

    const toggleOpen = () => {
        setOpen(!open);
    }
    return {
        selected,
        setSelected,
        open,
        toggleOpen,
        theme
    }
}
export default useLeftMenuHook;