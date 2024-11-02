import { FormArray, FormControl, FormGroup } from "@angular/forms";

export type FunctionInputGroup = FormGroup<{
    id: FormControl<string>;
    source: FormControl<string>;
    field: FormControl<string>;
}>

export type FunctionOutputGroup = FormGroup<{
    id: FormControl<string>;
    destination: FormControl<string>;
    field: FormControl<string>;
}>

export type FunctionGroup = FormGroup<{ 
    functionId: FormControl<string>;
    functionInputs: FormArray<FunctionInputGroup>;
    functionOutputs: FormArray<FunctionOutputGroup>;
}>;