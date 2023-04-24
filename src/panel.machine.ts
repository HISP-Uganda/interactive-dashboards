import { createMachine } from "xstate";
export const panelMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QCU4EsBeYCGAjANmAAQAO2AdmPgHRoSEDEJA9muQC5gBOEzA7uQDaABgC6iUC1hp2aZuQkgAHogCMAJgDs1dQFYAnAA4DmgMwA2ACzrLh-QBoQAT0Tn11TVrf7Nl4Zt1dS10AXxDHVGksPEJSCipqCC5sKCg2KCZWDm4AW2YANzARcSQQKRk5BVKVBF1TUx1zTX9Lc2FA-V1VRxcEAFozalVVQ1bja0tTfWswiPRogmIyShoklLTyDJY2Ti4AVxJixXLZeUUa1VNtQ00Ri1MDfTb-HrVTd399TvUnrUM7QyzECRTA4RZxFaJZKpdLUcjMLg5bD4BhHUonSrnRBdSzUAwWVRmcymQmTV4IdQkobCSydcyGVTmLqjSxAkELWLLBJrGGbagAY2Y+Hw2BIsEgqLEx2Y0lOVVANQs7nUKtUnSC+nUwmm5nJen01E1lJGVgZhgebPmYM58VW0I2Wyyu35FH5VDRkhlFTO1TUuncY2EbmG-pG-z1wx0T2Eat8VysdTC4RA8IgcEU7OtS1t0tlmN9-Xq1EM6lUwnLk3U5mrwXJfUZwmobUsqkskyCWs0lqiWYhCTohFz3vlyjUuMJdi+uia9QetnJlw+minrYC0xVXeTmZi2chPIdQ7lWIQJNxKtL6tpWp1ddxtkp5enNzn9O7oJ3fbt61h8MRyMP+YKogtKNvoNIGK2oxVoY7QLkEhrqnYbYQT8m5zD2H5cl+vJQAKQoimKkAAT6QG1HoCHVtq5jDM0nTkqYwiGE2+iMlWZjmvophtkmIRAA */
    id: "Resizeable panel",
    initial: "idle",
    states: {
        idle: {
            on: {
                pointerdown: "dragging",
            },
        },
        dragging: {
            on: {
                pointermove: {
                    actions: "updateWidth",
                },
                pointerup: { target: "idle" },

                pointercancel: { target: "idle" },
            },
            // states: {
            //     normal: {
            //         always: {
            //             target: "collapsed",
            //             cond: "ctx.width < 100",
            //         },
            //     },

            //     collapsed: {
            //         always: {
            //             target: "normal",
            //             cond: "ctx.width >= 100",
            //         },
            //     },
            // },

            // initial: "normal",
            entry: "setPointerCapture",
            exit: "releasePointerCapture",
        },
    },
});
