import React from "react";
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    FormControl,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import useAuthHook from "../../../../hooks/auth/auth.hook";
import Loader from "../../../../components/Base/Loader/loader.component";
import TextInputBase from "../../../../components/Base/input/textInput.base.component";
import useLoginPageHook from "../hook/loginPage.hook";

const LoginPageView: React.FC = (): React.ReactElement => {
  const { login, isLoading } = useAuthHook();
  const { register, errors, onSubmit } = useLoginPageHook();
  return (
    <Grid
      container
      spacing={2}
      display="flex"
      justifyContent="center"
      sx={{ height: "100vh", alignItems: "center" }}
    >
      <Loader isActive={isLoading}>
        <Grid>
          <Card>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Login
                </Typography>
                <FormControl fullWidth={true}>
                  <Stack direction="column" spacing={2}>
                    <TextInputBase
                      id="outlined-required"
                      label="Data assunzione"
                      register={register}
                      type={"text"}
                      name={"login.matricola"}
                      errors={errors}
                    />
                    <TextInputBase
                      id="outlined-required"
                      label="Data assunzione"
                      register={register}
                      type={"password"}
                      name={"login.password"}
                      errors={errors}
                    />
                  </Stack>
                </FormControl>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary" onClick={() => onSubmit()}>
                Login
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Loader>
    </Grid>
  );
};

export default LoginPageView;
