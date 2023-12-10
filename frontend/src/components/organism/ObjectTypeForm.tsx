import { ChangeEvent, useState } from "react";
import Input from "../atoms/Input";
import Dropdown from "../atoms/Dropdown";
import Button from "../atoms/Button";

const baseUrl = 'http://127.0.0.1:8000/type/object-types/'

const objectTypeDtypes = [
    { label: "String", value: "String" },
    { label: "Number", value: "Number" },
    { label: "Datetime", value: "Datetime" },
    { label: "Boolean", value: "Boolean" },
];

type ObjectTypeData = {
    [key: string] : {
        [k: string]: string
    }
};

type cleanedObjTypData = {
    [key: string] : string
}

type objTypeParsed = {
    [key: string] : {
        [k: string]: string
    }
}
const objTypeData: ObjectTypeData = {};

function ObjectTypeForm() {
    const [objTypName, setObjTypName] = useState('Name')
    const [attributes, setAttributes] = useState([
        [
            <Input
                key={`objectTypeAttributeInput${0}`}
                className={`objectTypeAttribute${0}`}
                isDisabled={false}
                onChange={handleInputChange}
            ></Input>
        ],
    ]);

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.className === `objectTypeAttribute${0}`) {
            setObjTypName(e.target.value)
        }
        else {
            objTypeData[e.target.className]["name"] = e.target.value;
        }
    }
    function handleSelectChange(e: ChangeEvent<HTMLSelectElement>) {
        objTypeData[e.target.className]["dtype"] = e.target.value;
    }
    function handleAttAttributeButtonClick() {
        const attributesLength = attributes.length;
        const newAttribute = [
            <Input
                key={`objectTypeAttributeInput${attributesLength}`}
                className={`objectTypeAttribute${attributesLength}`}
                isDisabled={false}
                onChange={handleInputChange}
            ></Input>,
            <Dropdown
                choices={objectTypeDtypes}
                key={`objectTypeAttributeSelect${attributesLength}`}
                className={`objectTypeAttribute${attributesLength}`}
                onChange={handleSelectChange}
            ></Dropdown>,
        ];
        setAttributes([...attributes, newAttribute]);

        // setup object type data: This is neccessary becuase we need to
        // have the key already available when we are collecting data on input
        // select change
        const objDtypKey = "objectTypeAttribute" + attributesLength;
        objTypeData[objDtypKey] = { name: "", dtype: "String" };
    }
    function handleSaveObjectTypeButtonClick() {
        const cleanedObjTypData: cleanedObjTypData = {};
        for (const key in objTypeData) {
            if (objTypeData.hasOwnProperty(key)) {
                const attribute = objTypeData[key];
                cleanedObjTypData[attribute.name] = attribute.dtype;
            }
        }
        const objTypeParsed: objTypeParsed = {}
        objTypeParsed[objTypName] = cleanedObjTypData
        // console.log(JSON.stringify(objTypeParsed));

        // send object via fetch
        fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(objTypeParsed),
        })
            .then((response) => {
                if (!response.ok) {
                    alert("Object type save failed!");
                }
            })
            .catch((error) => {
                console.log(`Error: ${error}`);
            });
    }
    return (
        <>
            {attributes.map((att, index) => 
            <div key={index}>
                {att}
            </div>
            
            )}
            <Button
                label="Add Attributes"
                onClick={handleAttAttributeButtonClick}
            ></Button>
            <Button
                label="Save Object Type"
                onClick={handleSaveObjectTypeButtonClick}
            ></Button>
        </>
    );
}

export default ObjectTypeForm;
