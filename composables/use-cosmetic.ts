
import type {Validatable} from "@/public/js/types/data";
import type {LabelTypeT} from "@/public/js/types/theme";
import type {CommonColorsT} from "@/stores/theme";
import {storeToRefs} from "pinia";

export const useCosmetic = () => {

    const {$themeStore} = useNuxtApp();
    const {
        appTheme,
        hexAlpha,
        common: commonColor,

        type,
        primary: primaryColor,
        secondary: secondaryColor,
        accent: accentColor,

        cell: cellColor,
        lining: liningColor,
        thread: threadColor,
        neutral: neutralColor,

        header: headerColor,
        tint: tintColor,
        body: bodyColor,
        shade: shadeColor,

        text: textColor,
        subtitle: subtitleColor,
        textInvert: textInvertColor,
        textSecondary: textSecondaryColor
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
    const primaryColor50 = computed(() => {
        return primaryColor.value + hexAlpha.value['50'];
    });
    const primaryColor40 = computed(() => {
        return primaryColor.value + hexAlpha.value['40'];
    });
    const secondaryColor70 = computed(() => {
        return secondaryColor.value + hexAlpha.value['70'];
    });
    const accentColor80 = computed(() => {
        return accentColor.value + hexAlpha.value['80'];
    });
    const accentColor70 = computed(() => {
        return accentColor.value + hexAlpha.value['70'];
    });
    const accentColor60 = computed(() => {
        return accentColor.value + hexAlpha.value['60'];
    });
    const accentColor40 = computed(() => {
        return accentColor.value + hexAlpha.value['40'];
    });
    const liningColor10 = computed(() => {
        return liningColor.value + hexAlpha.value['10'];
    });
    const liningColor70 = computed(() => {
        return liningColor.value + hexAlpha.value['70'];
    });
    const threadColor10 = computed(() => {
        return threadColor.value + hexAlpha.value['10'];
    });
    const textInvertColor90 = computed(() => {
        return textInvertColor.value + hexAlpha.value['90'];
    });
    const textInvertColor40 = computed(() => {
        return textInvertColor.value + hexAlpha.value['40'];
    });
    const textInvertColor20 = computed(() => {
        return textInvertColor.value + hexAlpha.value['20'];
    });

    const activeClearFluidBackground = computed(() => {

        let isDefaultBlue = ['default-blue'].indexOf(appTheme.value) >= 0;
        let isDarkSilver = ['dark-silver'].indexOf(appTheme.value) >= 0;
        let isDarkEmerald = ['dark-emerald'].indexOf(appTheme.value) >= 0;

        if(isDefaultBlue){
            return `linear-gradient(to right, ${primaryColor90.value} 20%, ${primaryColor50.value} 80%, ${primaryColor80.value} 100%)`;
        }

        if(isDarkSilver){
            return `linear-gradient(to right, ${secondaryColor.value} 20%, ${secondaryColor.value} 60%, ${accentColor70.value} 75%, ${secondaryColor.value} 100%)`;
        }

        if(isDarkEmerald){
            return `linear-gradient(to right, ${secondaryColor.value} 20%, ${secondaryColor70.value} 60%, ${textInvertColor20.value} 75%, ${primaryColor80.value} 100%)`;
        }
    })

    const buttonDefaultBackground = computed(() => {

        return `linear-gradient(to right, ${primaryColor.value} 20%, ${primaryColor.value} 40%, ${primaryColor80.value} 75%, ${primaryColor90.value} 100%)`;
    })

    const buttonDarkBackground = computed(() => {

        return `linear-gradient(to right, ${accentColor70.value} 20%, ${accentColor70.value} 60%, ${accentColor.value} 75%, ${accentColor80.value} 100%)`;
    })

    const dateTimePickerColor = computed(() => {

        if(
            ['default-blue'].indexOf(appTheme.value) >= 0
        ){
            return textInvertColor90.value;
        } else {
            return textColor.value;
        }
    })

    const dateTimePickerButtonBackground = computed(() => {

        if(
            ['dark-silver'].indexOf(appTheme.value) >= 0
        ){
            return buttonDarkBackground.value;
        } else {
            return buttonDefaultBackground.value
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
        appTheme,
        hexAlpha,
        commonColor,
        type,

        primaryColor, primaryColor90, primaryColor80, primaryColor40,
        secondaryColor,
        accentColor, accentColor80, accentColor70, accentColor40,

        cellColor,
        liningColor, liningColor70, liningColor10,
        threadColor, threadColor10,
        neutralColor,

        headerColor,
        tintColor,
        bodyColor,
        shadeColor,

        textColor,
        subtitleColor,
        textInvertColor, textInvertColor90,
        textSecondaryColor,

        buttonDefaultBackground,
        buttonDarkBackground,
        activeClearFluidBackground,
        dateTimePickerColor,
        dateTimePickerButtonBackground,

        formulableComponentShade,
        formulableShade,
        validationShade,
        shadedStyle,
    }
}
