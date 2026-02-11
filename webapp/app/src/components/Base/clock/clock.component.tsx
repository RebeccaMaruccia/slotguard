import React, {useEffect, useState} from "react";
import "../../../assets/theme/clock.css"

interface IProps {
}


export const ClockNow: React.FC<React.PropsWithChildren<IProps>> = (props: React.PropsWithChildren<IProps>): React.ReactElement => {
    const [timeData, setTimeData] = useState({
        hourDeg: 0,
        minuteDeg: 0,
        secondDeg: 0,
        time: "",
        day: "",
        date: ""
    });

    const months = [
        "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
        "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
    ];

    const days = [
        "Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"
    ];

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const seconds = now.getSeconds();
            const minutes = now.getMinutes();
            const hours = now.getHours();

            const hourDeg = hours * -30;
            const minuteDeg = minutes * -6;
            const secondDeg = seconds * -6;

            const timeStr = now.toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            });

            const day = days[now.getDay()];
            const month = months[now.getMonth()];
            const date = `${now.getDate()} . ${month}`;

            setTimeData({
                hourDeg,
                minuteDeg,
                secondDeg,
                time: timeStr,
                day,
                date,
            });
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="clock-container">
            <div className="clock-digital">
                <div className="date">{timeData.date}</div>
                <div className="time">{timeData.time}</div>
                <div className="day">{timeData.day}</div>
            </div>
            <div className="clock-analog">
                <div className="spear"></div>
                {/* Lancette */}
                <div className="hand hour" style={{transform: `rotate(${timeData.hourDeg}deg)`}}>
                    {/* Tacche orarie */}
                    {[...Array(12)].map((_, i) => (
                        <span
                            style={{transform: `rotate(${30 * i}deg) translateX(100px)`}}
                            key={i+1}
                        >{i === 0 ? 12 : i }</span>
                    ))}
                </div>
                <div className="hand minute" style={{transform: `rotate(${timeData.minuteDeg}deg)`}}>
                    {[...Array(60)].map((_, i) => (
                        <span
                            style={{transform: `rotate(${6 * i}deg) translateX(145px)`}}
                            key={i}
                        >{i}</span>
                    ))}
                </div>
                <div className="hand second" style={{transform: `rotate(${timeData.secondDeg}deg)`}}>
                    {[...Array(60)].map((_, i) => (
                        <span
                            style={{transform: `rotate(${6 * i}deg) translateX(195px)`}}
                            key={i}
                        >{i}</span>
                    ))}
                </div>
            </div>

        </div>
    );
}
