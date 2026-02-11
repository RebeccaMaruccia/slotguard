import {DefaultValues, Path, Resolver, useForm} from "react-hook-form";
import type {UseFormProps} from "react-hook-form/dist/types";
import {useFormatUtilityHook} from "../../shared/formatUtility";
import {ChangeEvent} from "react";
import {yupResolver} from "@hookform/resolvers/yup";
import {ObjectSchema} from "yup";


interface IProps<T, K extends string> extends UseFormProps {
    defaultValue?: DefaultValues<{ [key in K]: T }>;
    schema?: ObjectSchema<{ [key in K]: T }, any, any, any>
}

const useFormCustomHook = <T extends object, K extends string>(props: IProps<T, K>) => {
    const {defaultValue, schema} = props;
    const {formatEuro, formatDateToYYYYMMDD} = useFormatUtilityHook();

    const {
        register,
        formState: {errors, ...restUseForm},
        control,
        watch,
        handleSubmit,
        setValue,
        trigger,
        reset,
        setError,
        clearErrors,
    } = useForm<{ [key in K]: T }>(
        {
            defaultValues: defaultValue,
            //reValidateMode:"onChange",
            mode: "onChange",
            delayError: 0,
            resolver: schema ? yupResolver(schema) as Resolver<{ [key in K]: T; }, any, { [key in K]: T; }> : undefined
        }
    )


    const formatOnDigit = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: "EUR" | "DATA", nameInput?: string | undefined) => {
        let valueFormatted;
        let value: string = e?.target?.value ?? "";
        let name: string = nameInput ?? e?.target?.name;
        switch (type) {
            case "EUR":
                valueFormatted = formatEuro(value);
                break;
            case "DATA":
                valueFormatted = formatDateToYYYYMMDD(value);
                break;
        }

        setValue(name as Path<{ [key in K]: T }>, valueFormatted ?? value as any);
    }

    const onChangeCustom = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue((e.target.name as Path<{ [key in K]: T }>), e.target.value as any);
    }

    return {
        register,
        errors,
        handleSubmit,
        control,
        watch,
        setValue,
        formatOnDigit,
        onChangeCustom,
        trigger,
        reset,
        setError,
        clearErrors,
        ...restUseForm
    }
}
export default useFormCustomHook;