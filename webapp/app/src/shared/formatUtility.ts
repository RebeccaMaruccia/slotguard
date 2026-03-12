import {format} from "date-fns";
import moment from "moment";

const useFormatUtilityHook = () => {


    const formatEuro = (value?: number | string) => {
        if (!isNaN(Number(value)) && value) {
            return Intl.NumberFormat('it-IT', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(Number(value));
        }
    }
    const formatNumber = (value: number | string | undefined | null): number => {
        if (value === undefined || value === null || value === '') {
            return 0;
        }
        let valueFormatted = value.toString().replace(/\./g, '').replace(',', '.');
        const numberValue = Number(valueFormatted);
        if (isNaN(numberValue)) {
            console.warn("Valore non numerico:", value);
            return 0;
        }

        return numberValue;
    };

    const formatPercentage = (value: number | string | undefined | null): string => {
        if (value === undefined || value === null || value === '') {
            return '0%';
        }

        let numberValue: number;

        if (typeof value === 'string') {
            const trimmed = value.trim();

            // Se ha solo virgola -> formato italiano
            if (/^\d+(,\d+)?$/.test(trimmed)) {
                numberValue = parseFloat(trimmed.replace(',', '.'));
            }
            // Se ha solo punto -> formato inglese
            else if (/^\d+(\.\d+)?$/.test(trimmed)) {
                numberValue = parseFloat(trimmed);
            }
            // Se ha entrambi -> dobbiamo capire l'ordine
            else if (trimmed.includes(',') && trimmed.includes('.')) {
                const lastComma = trimmed.lastIndexOf(',');
                const lastDot = trimmed.lastIndexOf('.');

                if (lastComma > lastDot) {
                    // Esempio: "1.000,75" -> formato italiano
                    const cleaned = trimmed.replace(/\./g, '').replace(',', '.');
                    numberValue = parseFloat(cleaned);
                } else {
                    // Esempio: "1,000.75" -> formato inglese
                    const cleaned = trimmed.replace(/,/g, '');
                    numberValue = parseFloat(cleaned);
                }
            } else {
                // Formato sconosciuto
                console.warn("Formato non riconosciuto:", value);
                return '0%';
            }
        } else {
            numberValue = value;
        }

        if (isNaN(numberValue)) {
            console.warn("Valore non numerico:", value);
            return '0%';
        }

        // Formattazione italiana con virgola come separatore decimale
        const formatted = new Intl.NumberFormat('it-IT', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numberValue);

        return `${formatted}%`;
    };



    function formatDateToYYYYMMDD(input: Date | string | undefined): string {
        if (!input) return ''; // Invalid date check
        const date = typeof input === 'string' ? new Date(input) : input;
        if (isNaN(date.getTime())) return ''; // Invalid date check

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // mesi da 0 a 11
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    /**
     * Formatta il range di orario di uno slot da inizio/fine a "HH:mm - HH:mm"
     * @param inizio - Data/orario inizio dello slot (ISO string)
     * @param fine - Data/orario fine dello slot (ISO string)
     * @returns Stringa formattata "HH:mm - HH:mm"
     */
    function formatSlotTime(inizio?: string | null, fine?: string | null): string {
        if (!inizio || !fine) return '';
        try {
            const startTime = format(new Date(inizio), "HH:mm");
            const endTime = format(new Date(fine), "HH:mm");
            return `${startTime} - ${endTime}`;
        } catch (error) {
            console.error("Errore nel formattare l'orario dello slot:", error);
            return '';
        }
    }

    /**
     * Converte una data ISO (es: "2026-03-12T12:01:00.975Z") a formato LocalDate (yyyy-MM-dd)
     * @param isoDate - Data in formato ISO con timestamp
     * @returns Data formattata come yyyy-MM-dd
     */
    function formatToLocalDate(isoDate?: string | null): string {
        if (!isoDate) return '';
        try {
            const date = new Date(isoDate);
            return format(date, "yyyy-MM-dd");
        } catch (error) {
            console.error("Errore nel convertire la data ISO:", error);
            return '';
        }
    }

    const getEffectiveDate = () => {
        let d = moment();
        let incMonth = d.date() >= 25 ? 2 : 1;
        let result = d.add(incMonth, 'months').startOf('month');
        return formatDateToYYYYMMDD(result.toDate());
    };

    // ...existing code...

    return {formatEuro, formatDateToYYYYMMDD, getEffectiveDate, formatNumber, formatPercentage, formatSlotTime, formatToLocalDate};
}
export {useFormatUtilityHook}