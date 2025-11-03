
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const  HOLIDAY: NumericEnumInterface = {
    SPECIAL : 100,
    LEGAL : 200,
    DOUBLE : 300,
}

export const  HOLIDAY_NAME: StringEnumInterface = {
    [HOLIDAY.SPECIAL as number] : 'Special Holiday',
    [HOLIDAY.LEGAL as number] : 'Legal Holiday',
    [HOLIDAY.DOUBLE as number] : 'Double Holiday',
}