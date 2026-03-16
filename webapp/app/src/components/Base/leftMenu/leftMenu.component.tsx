import React from "react";
import {EnumRoutes} from "lib-ts-bl/dist";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import {Sidebar} from "./components/Sidebar";
import {Logo} from "./components/Logo";
import {Menu} from "./components/Menu";
import {MenuItem} from "./components/MenuItem";
// @ts-ignore
import LogoAcme from "../../../assets/logos/img.png";
import useLeftMenuHook from "./hook/leftMenu.hook";


interface IProps {
    open: boolean;
}

interface sezione {
    name: string,
    icon: React.ReactNode,
    sottosezioni: {
        name: string
        route: EnumRoutes
        icon?: React.ReactNode
    }[]
}


const LeftMenuComponent: React.FC<React.PropsWithChildren<IProps>> = (props: React.PropsWithChildren<IProps>): React.ReactElement => {

    const {selected, setSelected, theme} = useLeftMenuHook()
    const {open} = props;

    let sezioni: sezione[] = [
        {
            name: "Home",
            icon: <HomeOutlinedIcon/>,
            sottosezioni: [
                {name: "Dashboard", route: EnumRoutes.DASHBOARD, icon: <DashboardOutlinedIcon/>}
            ]
        },
        {
            name: "Gestione",
            icon: <MiscellaneousServicesOutlinedIcon/>,
            sottosezioni: [
                {name: "Servizi", route: EnumRoutes.SERVICES, icon: <MiscellaneousServicesOutlinedIcon/>},
                {name: "Statistiche", route: EnumRoutes.STATISTICS, icon: <BarChartOutlinedIcon/>}
            ]
        },

    ];

    return (
        <Sidebar  userName={""} showProfile={false} isCollapse={!open}
                 themeColor={theme.palette.text.secondary} themeSecondaryColor={theme.palette.text.primary}
                 textColor={theme.palette.secondary.main}
        >
            <Logo
                href="/"
                img={LogoAcme}
            >
                Simulator
            </Logo>
            {
                sezioni.map((sezione,i) => {
                        return (
                            <Menu subHeading={sezione.name} key={i}
                            >
                                {sezione.sottosezioni.map((sottosezione, i) => {
                                    return (
                                        <MenuItem
                                            key={i}
                                            icon={sottosezione.icon}
                                            link={sottosezione.route}
                                            onClick={() => setSelected(sottosezione.name)}
                                            isSelected={selected === sottosezione.name}
                                        >
                                            {sottosezione.name}
                                        </MenuItem>
                                    )
                                })}
                            </Menu>
                        )
                    }
                )
            }
        </Sidebar>
    )

}
export default LeftMenuComponent
