import { FormArray, FormControl, FormGroup } from "@angular/forms";

export type FunctionInputGroup = FormGroup<{
    source: FormControl<string>;
    field: FormControl<string>;
}>

export type FunctionOutputGroup = FormGroup<{
    destination: FormControl<string>;
    field: FormControl<string>;
}>

export type FunctionGroup = FormGroup<{ 
    functionId: FormControl<string>;
    functionInputs: FormArray<FunctionInputGroup>;
    functionOutputs: FormArray<FunctionOutputGroup>;
}>;