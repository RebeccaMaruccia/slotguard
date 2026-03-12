import {slotGuardServiceApiBase} from "api-service";
import {useEffect} from "react";

const useDashboardHooks = () =>  {



    /***RkT query****/
    const [getPrenotazioni,{isLoading:prenotazioniIsLoading,data:prenotazioniData}] = slotGuardServiceApiBase.useGetSlotsMutation();
    /*****************/


    useEffect(() => {

        getPrenotazioni({inizio:"2024-06-01T00:00:00Z",fine:"2024-06-30T23:59:59Z"})

    },[])

    return {
getPrenotazioni,
    }
}
export default useDashboardHooks;
