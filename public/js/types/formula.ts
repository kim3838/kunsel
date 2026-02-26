
import type {EnumOption} from "@/public/js/common/type";
import type {TableRowPayloadT} from "@/public/js/types/data";

export type FormulaSettingT = {
    key: string,
    label: string,
    order: number,
    readable: string,
    type: string,
    value: any
}

export type CompanyFormulaSetting = {
    id: string | number;
    company_formula_id : number,
    company_id : number,
    formula_id : number,
    company_code : string,
    company_name : string,
    formula_name : string,
    formula_is_aggregation : boolean,
    formulable_type : EnumOption,
    formulable_component_type : EnumOption,
    default_settings : unknown[],
    formula_settings : unknown[],
    settings: FormulaSettingT[]
    _payload?: TableRowPayloadT;
}

export type CompanyFormulaSettingSyncT = {
    [key: string | number]: {
        settings: FormulaSettingT[]
    }
}