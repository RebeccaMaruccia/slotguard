import useFormCustomHook from "../../../../hooks/form/formCustom.hook";
import {object, type ObjectSchema, string} from "yup";
import useAuthHook from "../../../../hooks/auth/auth.hook";
import {AuthenticationRequest} from "api-service";

const useLoginPageHook = () => {
  const { login, isLoading } = useAuthHook();

  const loginSchema: ObjectSchema<{ login: AuthenticationRequest }> = object({
    login: object({
      matricola: string().required("required"),
      password: string().required("required"),
    }).required(),
  });

  const { register, handleSubmit, watch, control, trigger, errors } =
    useFormCustomHook<AuthenticationRequest, "login">({
      defaultValue: {
        login: {
          matricola: "",
          password: "",
        },
      },
      schema: loginSchema,
    });
  const formData = watch("login");
  const onSubmit = async () => {
    if (await trigger()) {
      await login(formData);
    }
  };

  return { register, errors, onSubmit };
};
export default useLoginPageHook;
