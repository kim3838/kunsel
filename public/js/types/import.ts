
import type {Validatable} from "@/public/js/types/data";

export interface ImportRow extends Validatable{
    id: number,
    row: number,
}

export type EmployeePreImportT = {
    number: string,
    family_name: string,
    given_name: string,
} & ImportRow;