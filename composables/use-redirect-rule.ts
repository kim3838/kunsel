
type ruleCallbackType = (() => any) | null;

export const redirectRuleMapState = () => {
    return useState('redirect-rule-map', () => {
        return {
            'guest' : ['lab', 'prototype', 'example', 'login', 'forgot-password', 'two-factor-challenge', 'password-reset-token'],
            'sample-middleware' : ['index', 'prototype', 'example']
        }
    });
};

export const bootRedirectRule = async function(rules = []){
    console.log('BEFORE bootRedirectRule clientReadyState: ' +useClientReadyState().value );
    console.log('bootRedirectRule ClientReadyState = false');
    useClientReadyState().value = false;
    console.log('AFTER bootRedirectRule clientReadyState: ' +useClientReadyState().value );

    const routeTo = useRouteTo();
    const redirectRuleMap = redirectRuleMapState();
    const {isAuthenticated} = useAuth();
    console.log('bootRedirectRule |+++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log({'COMPOSABLE REDIRECT RULE IS AUTHENTICATED': isAuthenticated.value});

    const redirectRuleClosure = reactive({
        'guest' : {
            'continue': !isAuthenticated.value,
            'callback': () => {
                return navigateTo("/", {replace: true});
            }
        },
        'sample-middleware' : {
            'continue': true,
            'callback': () => {
                return console.log('COMPOSABLE RULE SAMPLE MIDDLEWARE CALLBACK');
            }
        }
    });
    let ruleCallback: ruleCallbackType = null;
    console.log({'COMPOSABLE REDIRECT RULE ROUTE TO': routeTo.value.name});
    console.log({'COMPOSABLE REDIRECT RULE MAP': redirectRuleMap.value});

    rules.every(rule => {

        console.log({'COMPOSABLE RULE' : rule});

        if(redirectRuleMap.value[rule].includes(routeTo.value.name)){
            console.log({'COMPOSABLE RULE CLOSURE': redirectRuleClosure[rule]});
            console.log({'COMPOSABLE RULE CLOSURE CONTINUE TYPE': typeof redirectRuleClosure[rule].continue});
            console.log({'COMPOSABLE RULE CLOSURE CALLBACK TYPE': typeof redirectRuleClosure[rule].callback});

            let continueNextRule = redirectRuleClosure[rule].continue;

            console.log({'COMPOSABLE RULE CLOSURE CONTINUE': continueNextRule});

            if(!continueNextRule){
                ruleCallback = redirectRuleClosure[rule].callback;
                console.log({'ruleCallback TYPE': typeof ruleCallback});
            }

            return continueNextRule;
        } {
            return true;
        }
    });

    if(typeof ruleCallback == 'function'){
        console.log({'COMPOSABLE RULE CLOSURE CALLBACK CALL': ruleCallback});

        ruleCallback();

        setTimeout(()=>{
            console.log('bootRedirectRule with callback ClientReadyState = true');
            useClientReadyState().value = true;
        }, 300);

    } else {
        console.log('bootRedirectRule without callback ClientReadyState = true');
        useClientReadyState().value = true;
    }
};