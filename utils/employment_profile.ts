
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const  EMPLOYMENT_STATUS: NumericEnumInterface = {
    ACTIVE : 0,
    INACTIVE : 1,
}

export const EMPLOYMENT_STATUS_NAME: StringEnumInterface = {
    [EMPLOYMENT_STATUS.ACTIVE as number]: 'Active',
    [EMPLOYMENT_STATUS.INACTIVE as number]: 'Inactive',
};

export const EMPLOYMENT_TYPE: NumericEnumInterface = {
    OJT : 0,
    INTERN : 1,
    PROBATIONARY : 2,
    FULL_TIME : 3,
    PART_TIME : 4,
    CONTRACT : 5,
    NOT_SPECIFIED : 6,
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
    END_OF_CONTRACT : 0,
    RESIGNED : 1,
    TERMINATED : 2,
    RETIRED : 3,
    DEATH : 4,
    MEDICAL_SEPARATION : 5,
    DISABILITY : 6,
    NOT_SPECIFIED : 7,
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