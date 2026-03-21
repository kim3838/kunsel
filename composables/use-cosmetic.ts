
import type {Validatable} from "@/public/js/types/data";
import type {LabelTypeT} from "@/public/js/types/theme";
import type {CommonColorsT} from "@/stores/theme";
import {storeToRefs} from "pinia";

export const useCosmetic = () => {

    const {$themeStore} = useNuxtApp();
    const {
        appTheme,
        hexAlpha,
        primary: primaryColor,
        accent: accentColor,
        lining: liningColor,
        textInvert: textInvertColor
    } = storeToRefs($themeStore);

    const primaryColor90 = computed(() => {
        return primaryColor.value + hexAlpha.value['90'];
    });
    const primaryColor80 = computed(() => {
        return primaryColor.value + hexAlpha.value['80'];
    });
    const primaryColor70 = computed(() => {
        return primaryColor.value + hexAlpha.value['70'];
    });
    const primaryColor60 = computed(() => {
        return primaryColor.value + hexAlpha.value['60'];
    });
    const accentColor80 = computed(() => {
        return accentColor.value + hexAlpha.value['80'];
    });
    const accentColor70 = computed(() => {
        return accentColor.value + hexAlpha.value['70'];
    });

    const activeClearFluidBackground = computed(() => {

        let isDefaultBlue = ['default-blue'].indexOf(appTheme.value) >= 0;

        if(isDefaultBlue){
            return `linear-gradient(to right, ${primaryColor90.value} 20%, ${accentColor.value} 80%, ${primaryColor80.value} 100%)`;
        } else {
            return `linear-gradient(to right, ${primaryColor70.value} 20%, ${accentColor.value} 60%, ${accentColor.value} 75%, ${primaryColor60.value} 100%)`;
        }
    })

    const formulableComponentShade = (formulableType: number|null, componentType: number|null): LabelTypeT => {
        let shadeValue: LabelTypeT = 'clear';

        if(formulableType == null || componentType == null){
            return shadeValue;
        }

        formulableType = Number(formulableType);
        componentType = Number(componentType);

        if(_includes([FORMULABLE.EARNINGS], formulableType)){

            shadeValue = {
                [COMPENSATION.BASIC_PAY as number]: 'success',
                [COMPENSATION.OVERTIME as number]: 'success',
                [COMPENSATION.STATUTORY_BENEFIT as number]: 'success',
                [COMPENSATION.REGULAR_ALLOWANCE as number]: 'success',
                [COMPENSATION.MANUAL_EARNING as number]: 'success',
                [COMPENSATION.LEAVE_PAY as number]: 'info',
                [COMPENSATION.HOLIDAY_PAY as number]: 'info',
            }[componentType] as LabelTypeT || 'default';

        } else if(_includes([FORMULABLE.DEDUCTIONS], formulableType)) {

            shadeValue = {
                [DEDUCTION.DEDUCTION as number]: 'danger',
                [DEDUCTION.MANUAL_DEDUCTION as number]: 'danger',
                [DEDUCTION.STATUTORY_CONTRIBUTION as number]: 'warning',
            }[componentType] as LabelTypeT || 'default';

        } else if(_includes([FORMULABLE.INCOME_TAX], formulableType)) {

            shadeValue = {
                [INCOME_TAX.WITHHOLDING_TAX as number]: 'caution',
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
        activeClearFluidBackground,
        formulableComponentShade,
        formulableShade,
        validationShade,
        shadedStyle,
    }
}
