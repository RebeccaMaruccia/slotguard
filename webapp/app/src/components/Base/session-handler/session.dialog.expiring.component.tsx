import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Loader from "../Loader/loader.component";

interface IProps {
    readonly show: boolean,
    readonly action: () => void,
    readonly isLoading: boolean,
    readonly countdown: string;
}

const SessionAlertExpiring: React.FC<IProps> = (props: IProps): React.ReactElement => {
    const {show, action, isLoading, countdown} = props;


    return (<Dialog
        open={show}
        onClose={() => console.log()}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"

    >
        <DialogTitle id="alert-dialog-title">
            {"Sessione in scadenza"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                La sessione è in scadenza{countdown} , aggiorna la sessione
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Loader isActive={isLoading}>
                <Button
                    variant="contained"
                    onClick={() => action()}
                >Refresh</Button>
            </Loader>
        </DialogActions>
    </Dialog>);
};

export default SessionAlertExpiring;
