import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

interface IProps {
    readonly show: boolean,
    readonly action: () => void,
}

const SessionAlertExpired: React.FC<IProps> = (props: IProps): React.ReactElement => {
    const {show, action} = props;

    return (<Dialog
        open={show}
        onClose={() => console.log()}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"

    >
        <DialogTitle id="alert-dialog-title">
            {"Sessione Scaduta?"}
        </DialogTitle> <DialogContent>
        <DialogContentText id="alert-dialog-description">
            La sessione è scaduta rieffettua il login
        </DialogContentText>
    </DialogContent>
        <DialogActions>
            <Button
                variant="contained"
                onClick={action}
            >chiudi</Button>
        </DialogActions>
    </Dialog>);
};

export default SessionAlertExpired;
