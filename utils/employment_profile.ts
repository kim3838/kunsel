
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const  EMPLOYMENT_STATUS: NumericEnumInterface = {
    ACTIVE : 100,
    INACTIVE : 200,
}

export const EMPLOYMENT_STATUS_NAME: StringEnumInterface = {
    [EMPLOYMENT_STATUS.ACTIVE as number]: 'Active',
    [EMPLOYMENT_STATUS.INACTIVE as number]: 'Inactive',
};

export const EMPLOYMENT_TYPE: NumericEnumInterface = {
    NOT_SPECIFIED : 0,
    OJT : 100,
    INTERN : 101,
    PROBATIONARY : 200,
    FULL_TIME : 201,
    PART_TIME : 300,
    CONTRACT : 400,
}

export const EMPLOYMENT_TYPE_NAME: StringEnumInterface = {
    [EMPLOYMENT_TYPE.OJT as number]: 'OJT',
    [EMPLOYMENT_TYPE.INTERN as number]: 'Intern',
    [EMPLOYMENT_TYPE.PROBATIONARY as number]: 'Probationary',
    [EMPLOYMENT_TYPE.FULL_TIME as number]: 'Full Time',
    [EMPLOYMENT_TYPE.PART_TIME as number]: 'Part Time',
    [EMPLOYMENT_TYPE.CONTRACT as number]: 'Contract',
    [EMPLOYMENT_TYPE.NOT_SPECIFIED as number]: 'Not Specified',
}

export const  END_OF_SERVICE_TYPE: NumericEnumInterface = {
    NOT_SPECIFIED : 0,
    END_OF_CONTRACT : 100,
    RESIGNED : 200,
    TERMINATED : 300,
    RETIRED : 400,
    DEATH : 500,
    MEDICAL_SEPARATION : 600,
    DISABILITY : 700,
}

export const END_OF_SERVICE_TYPE_NAME: StringEnumInterface = {
    [END_OF_SERVICE_TYPE.END_OF_CONTRACT as number]: 'End of Contract',
    [END_OF_SERVICE_TYPE.RETIRED as number]: 'Retired',
    [END_OF_SERVICE_TYPE.TERMINATED as number]: 'Terminated',
    [END_OF_SERVICE_TYPE.RESIGNED as number]: 'Resigned',
    [END_OF_SERVICE_TYPE.DEATH as number]: 'Death',
    [END_OF_SERVICE_TYPE.MEDICAL_SEPARATION as number]: 'Medical Separation',
    [END_OF_SERVICE_TYPE.DISABILITY as number]: 'Disability',
    [END_OF_SERVICE_TYPE.NOT_SPECIFIED as number]: 'Not Specified',
}