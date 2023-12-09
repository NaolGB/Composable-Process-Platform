import { v1 as uuidv1 } from "uuid";

interface ChoiceProp {
    label: string;
    value: string;
}

interface Props {
    choices: ChoiceProp[];
    onChange: () => void;
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
