import React from "react";
import {Backdrop, CircularProgress} from "@mui/material";

interface IProps {
    readonly isActive: boolean;
    readonly full?: boolean;
    readonly className?: string;
}

const Loader: React.FC<React.PropsWithChildren<IProps>> = (props: React.PropsWithChildren<IProps>): React.ReactElement => {
    const {isActive, full = false, className, children} = props;

    return (<>
        <>
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={isActive}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            {children}
        </>

    </>);

};

export default Loader;