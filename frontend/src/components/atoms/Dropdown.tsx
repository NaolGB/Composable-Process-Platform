import { v1 as uuidv1 } from "uuid";
import { ChangeEvent } from "react";

interface ChoiceProp {
    label: string;
    value: string;
}

interface Props {
    choices: ChoiceProp[];
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    className: string
}

function Dropdown({ choices, onChange, className }: Props) {
    return (
        <>
            <select onChange={onChange} className={className}>
                {choices.map((choice) => (
                    <option key={uuidv1()} value={choice.value}>
                        {choice.label}
                    </option>
                ))}
            </select>
        </>
    );
}

export default Dropdown;
