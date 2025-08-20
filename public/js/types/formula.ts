
import type {Enum} from "@/public/js/common/type";
import type {TableRowPayloadT} from "@/public/js/types/data";

export type CompanyFormulaSetting = {
    company_formula_id : number,
    company_id : number,
    formula_id : number,
    company_code : string,
    company_name : string,
    formula_name : string,
    formula_is_interpolation : boolean,
    formulable_type : Enum,
    formulable_component_type : Enum,
    formula_settings : unknown[],
    _payload?: TableRowPayloadT;
}