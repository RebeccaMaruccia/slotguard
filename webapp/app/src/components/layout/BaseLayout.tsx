import React from "react";
import {Outlet} from "react-router";
import {Toaster} from "react-hot-toast";
import SessionHandler from "../Base/session-handler/session-handler.component";
import {metalMontaggiTheme} from "../../assets/theme/global.themes.hook";
import {CssBaseline, ThemeProvider} from "@mui/material";
import Header from "../Base/header/header.component";

const Baselayout: React.FC = (): React.ReactElement => {


    return (<ThemeProvider theme={metalMontaggiTheme}>
        <CssBaseline/>
        <Header/>
        <main
            id="main-content"
        >
            <div style={{margin: "4!important"}}>
                <SessionHandler/>
                <Outlet/>
                <Toaster/>
            </div>
        </main>
        {/*<Footer />*/}
    </ThemeProvider>)
}
export default Baselayout;