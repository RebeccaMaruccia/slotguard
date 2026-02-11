import React from "react";
import {Autocomplete, Stack, TextField, TextFieldProps, useTheme} from "@mui/material";
import {Control, Controller, FieldErrors, get, UseFormRegister} from "react-hook-form";
import type {FieldValues} from "react-hook-form/dist/types/fields";
import type {FieldPath} from "react-hook-form/dist/types/path";
import type {RegisterOptions} from "react-hook-form/dist/types/validator";
import {DatePicker} from "@mui/x-date-pickers";
import {LookUpOption} from "../../../shared/model/interfaces";
import moment, {Moment} from "moment";


export type IProps<TFieldValues extends FieldValues = FieldValues, TEnableAccessibleFieldDOMStructure extends boolean = true> =
    {
        control?: Control<TFieldValues>;
        register?: UseFormRegister<TFieldValues>;
        errors: FieldErrors<TFieldValues>;
        name: FieldPath<TFieldValues>;
        validationList?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>
        options?: LookUpOption[],
        loading?: boolean,
        onInputChange?: (event: React.SyntheticEvent, value: string, reason: string) => void
        maxDate?: Moment,
        minDate?: Moment
    }
    & TextFieldProps

const TextInputBase = <TFieldValues extends FieldValues>(props: IProps<TFieldValues>): React.ReactElement => {
    const {
        errors,
        register,
        name,
        validationList,
        onChange: onChangeHandler,
        type,
        control,
        label,
        options,
        disabled,
        defaultValue,
        onInputChange,
        loading,
        minDate,
        maxDate,
        ...rest
    } = props;
    const theme = useTheme();
    const errorText = get(errors, name) && name + "." + get(errors, name).message
    const inputAutoSelect = () => {
        switch (type) {
            default :
                return <TextField
                    {...register!(name, validationList)}
                    {...rest}
                    className={"rounded"}
                    error={!!get(errors, name)}
                    helperText={errorText}
                />
            case "date":
                return <Controller
                    name={name}
                    control={control}
                    render={({field: {onChange, value, ...rest}, fieldState: {error}}) => (
                        <DatePicker
                            {...rest}
                            disabled={disabled}
                            name={name}
                            minDate={minDate}
                            maxDate={maxDate}
                            label={label}
                            value={moment(value)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: !!get(errors, name),
                                    helperText: errorText

                                }
                            }}
                            className={"rounded"}
                            onChange={(e) => {
                                onChange(e);
                                if (onChangeHandler) {
                                    onChangeHandler({
                                        ...value,
                                        target: {value: e?.toDate()?.toDateString(), name: name}
                                    })
                                }
                            }}
                        />
                    )}
                    rules={validationList}
                />
            case "autocomplete":
                return <Controller
                    name={name}
                    control={control}
                    rules={validationList}
                    render={({field: {onChange, value, ...rest}}) => (
                        <Autocomplete
                            {...rest}
                            disabled={disabled}
                            className={"rounded"}
                            options={options ? options : []}
                            onChange={(e, v) => {
                                onChange(v?.id);
                                if (onChangeHandler) {
                                    onChangeHandler({...value, target: {value: v, name: name}})
                                }
                            }}
                            loading={loading}
                            value={options?.find((i) => i?.id?.toString() === value?.toString()) || null || null}
                            renderInput={(params) => <TextField
                                helperText={errorText}
                                name={name}
                                error={!!get(errors, name)}  {...params}
                                label={label}/>}
                            onInputChange={onInputChange}
                        />
                    )}
                />
        }
    }

    return (<Stack>
        {inputAutoSelect()}
    </Stack>)

}
export default TextInputBase;