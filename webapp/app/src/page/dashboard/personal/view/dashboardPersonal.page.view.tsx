import React from "react";
import Button from "@mui/material/Button";
import {slotGuardServiceApi} from "api-service";

const DashBoardPersonalPageView: React.FC = (): React.ReactElement => {
  const [
    checkMatricola,
    { data: matricolaCheckData, isLoading: matricolaCheckLoading },
  ] = slotGuardServiceApi.useLazyCheckMatricolaQuery();

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          checkMatricola({ matricola: "string" });
        }}
      >
        Check Matricola
      </Button>
    </>
  );
};
export default DashBoardPersonalPageView;
