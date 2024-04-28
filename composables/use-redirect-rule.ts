
type ruleCallbackType = (() => any) | null;

export const redirectRuleMapState = () => {
    return useState('redirect-rule-map', () => {
        return {
            'guest' : ['lab', 'prototype', 'example', 'login', 'forgot-password', 'two-factor-challenge', 'password-reset-token'],
            'skipable-middleware' : ['index', 'prototype', 'example']
        }
    });
};

export const bootRedirectRule = async function(rules = []){
    useClientReadyState().value = false;

    console.log('bootRedirectRule |+++++++++++++++++++++++++++++++++++++++++++++++++');
    const routeTo = useRouteTo();
    const redirectRuleMap = redirectRuleMapState();
    const {isAuthenticated} = useAuth();
    console.log({'COMPOSABLE REDIRECT RULE IS AUTHENTICATED': isAuthenticated.value});

    const redirectRuleClosure = reactive({
        'skipable-middleware' : {
            'continue': true,//If continue is false, break the rule loop and perform rule callback
            'callback': () => {
                return console.log('COMPOSABLE RULE SKIPABLE MIDDLEWARE CALLBACK');
            }
        },
        'guest' : {
            'continue': !isAuthenticated.value,
            'callback': () => {
                return navigateTo("/", {replace: true});
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

        console.log('bootRedirectRule with callback ClientReadyState = true');
        useClientReadyState().value = true;

    } else {
        console.log('bootRedirectRule without callback ClientReadyState = true');
        useClientReadyState().value = true;
    }
};