
import type {Validatable} from "@/public/js/types/data";

export interface ImportRow extends Validatable{
    id: number,
    row: number,
    isEditing?: boolean,
}

export type EmployeePreImportT = {
    number: string,
    family_name: string,
    given_name: string,
} & ImportRow;

export type EmploymentProfilePreImportT = {
    number: string,
    employment_type: string,
    start_date: string,
    end_of_service_type: string,
    end_date: string,
} & ImportRow;