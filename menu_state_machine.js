import { createMachine } from 'xstate';

export const menuMachine = createMachine({
    context: {
    },
    initial: 'mainMenu',
    states: {
        mainMenu: {
            on: {
                'candle_and_blessing': { target: 'addCandleAndBlessing' },
            },
        },
        addCandleAndBlessing: {
            initial: "candleSelection",
            states: {
                candleSelection: {
                    on: {
                        "selected": { target: 'candlePlacement'}
                    }
                },
                candlePlacement: {
                    on: {
                        "placed": { target: 'writeBlessing'}
                    }
                },
                writeBlessing: {
                    on: {
                        "blessed": { target: 'done'},
                        "cancel": { target: 'done'}
                    }
                },
                done: {
                    type: 'final',
                },
            },
            onDone: {
                target: 'mainMenu',
            },
        },
        other: {
            on: {
            },
        },
    },
});