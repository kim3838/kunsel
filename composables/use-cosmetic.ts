
import type {Validatable} from "@/public/js/types/data";
import type {LabelTypeT} from "@/public/js/types/theme";
import {storeToRefs} from "pinia";
import type {CommonColorsT} from "~/stores/theme";

export const useCosmetic = () => {

    const formulableComponentShade = (formulableType: number|null, componentType: number|null): LabelTypeT => {
        let shadeValue: LabelTypeT = 'default';

        if(formulableType == null || componentType == null){
            return shadeValue;
        }

        formulableType = Number(formulableType);
        componentType = Number(componentType);

        if(_includes([FORMULABLE.EARNINGS], formulableType)){

            shadeValue = {
                [COMPENSATION.BASIC_SALARY as number]: 'success',
                [COMPENSATION.OVERTIME as number]: 'success',
                [COMPENSATION.BENEFIT as number]: 'success',
                [COMPENSATION.REGULAR_ALLOWANCE as number]: 'success',
            }[componentType] as LabelTypeT || 'default';

        } else if(_includes([FORMULABLE.DEDUCTIONS], formulableType)) {

            shadeValue = {
                [DEDUCTION.DEDUCTION as number]: 'danger',
                [DEDUCTION.CONTRIBUTION as number]: 'warning',
            }[componentType] as LabelTypeT || 'default';

        } else if(_includes([FORMULABLE.INCOME_TAX], formulableType)) {

            shadeValue = {
                [INCOME_TAX.COMPENSATION_TAX as number]: 'caution',
            }[componentType] as LabelTypeT || 'default';
        }

        return shadeValue;
    };

    const formulableShade = (formulableType: number): LabelTypeT => {
        let shadeValue: LabelTypeT = 'default';

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

    const validationShade = (validatable: Validatable): LabelTypeT => {
        let shadeValue: LabelTypeT = 'default';

        if(validatable.validation_errors.length > 0){
            shadeValue = 'danger';
        } else {
            shadeValue = 'success';
        }

        return shadeValue;
    }

    const shadedStyle = (shade: LabelTypeT = 'default') => {

        const {$themeStore} = useNuxtApp();
        const {
            common: commonColor,
        } = storeToRefs($themeStore);
        const typedCommonColor = commonColor as Ref<CommonColorsT>;

        return {
            'background-color':  typedCommonColor.value[shade as keyof CommonColorsT].secondary
        };
    }

    return {
        formulableComponentShade,
        formulableShade,
        validationShade,
        shadedStyle,
    }
}
