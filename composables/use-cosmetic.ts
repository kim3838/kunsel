
import type {Validatable} from "@/public/js/types/data";

export const useCosmetic = () => {

    const formulableComponentShade = (formulableType, componentType) => {
        let shadeValue = 'default';

        if(formulableType == null || componentType == null){
            return shadeValue;
        }

        formulableType = Number(formulableType);
        componentType = Number(componentType);

        if(_includes([FORMULABLE.EARNINGS], formulableType)){

            shadeValue = {
                [COMPENSATION.BASIC_SALARY]: 'success',
                [COMPENSATION.OVERTIME]: 'success',
                [COMPENSATION.BENEFIT]: 'success',
                [COMPENSATION.REGULAR_ALLOWANCE]: 'success',
            }[componentType] || 'default';

        } else if(_includes([FORMULABLE.DEDUCTIONS], formulableType)) {

            shadeValue = {
                [DEDUCTION.DEDUCTION]: 'danger',
                [DEDUCTION.CONTRIBUTION]: 'warning',
            }[componentType] || 'default';

        } else if(_includes([FORMULABLE.INCOME_TAX], formulableType)) {

            shadeValue = {
                [INCOME_TAX.COMPENSATION_TAX]: 'caution',
            }[componentType] || 'default';
        }

        return shadeValue;
    };

    const formulableShade = (formulableType) => {
        let shadeValue = 'default';

        if(formulableType == null){
            return shadeValue;
        }

        formulableType = Number(formulableType);

        if(_includes([FORMULABLE.EARNINGS], formulableType)){
            shadeValue = 'success';
        } else if(_includes([FORMULABLE.DEDUCTIONS], formulableType)) {
            shadeValue = 'danger';
        } else if(_includes([FORMULABLE.INCOME_TAX], formulableType)) {
            shadeValue = 'caution';
        }

        return shadeValue;
    }

    const validationShade = (validatable: Validatable) => {
        let shadeValue = 'default';

        if(validatable.validation_errors.length > 0){
            shadeValue = 'danger';
        } else {
            shadeValue = 'success';
        }

        return shadeValue;
    }

    return {
        formulableComponentShade,
        formulableShade,
        validationShade
    }
}
