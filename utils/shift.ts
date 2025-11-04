
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const  SHIFT_TYPE: NumericEnumInterface = {
    REGULAR : 100,
    GRAVEYARD: 200
}

export const  SHIFT_TYPE_NAME: StringEnumInterface = {
    [SHIFT_TYPE.REGULAR as number] : 'Regular',
    [SHIFT_TYPE.GRAVEYARD as number] : 'Graveyard',
}

export const  SHIFT_HOLIDAY_POLICY: NumericEnumInterface = {
    DAY_OFF : 100,
    ATTENDANCE_REQUIRED: 200
}

export const  SHIFT_HOLIDAY_POLICY_NAME: StringEnumInterface = {
    [SHIFT_HOLIDAY_POLICY.DAY_OFF as number] : 'Day off',
    [SHIFT_HOLIDAY_POLICY.ATTENDANCE_REQUIRED as number] : 'Attendance required',
}