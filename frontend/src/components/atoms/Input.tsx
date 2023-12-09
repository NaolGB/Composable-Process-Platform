import { ChangeEvent } from "react";

interface Props {
    isDisabled?: boolean;
    onChange: (e: ChangeEvent) => void;
    className: string,
    defaultValue?: string
}

function Input({ isDisabled, onChange, className, defaultValue }: Props) {

    const inputProps = {
        disabled: isDisabled,
        className: className,
        value: defaultValue
      };

      return (
        <>
            <input {...inputProps} onChange={onChange}></input>
        </>
    );
}

export default Input;
