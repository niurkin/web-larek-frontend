import {State, TransitionMap, StateChangedEvent} from "../types";
import {IEvents} from "./base/events";

export class ShopStates {
    protected currentState: State = 'browsing';
    protected transitions: TransitionMap;

    constructor (protected events: IEvents, transitions: TransitionMap) {
        this.transitions = transitions;
    }

    dispatch(event: string, data?: unknown) {
        const nextState = this.transitions[this.currentState]?.[event];
        if (nextState) {
            this.setState(nextState);

            const payload: StateChangedEvent = {
                state: this.currentState,
                data: data as any,
            };

            this.events.emit('state:changed', payload);
            console.log(`State: ${this.getState()}`)
          }
    }

    setState(value: State) {
        this.currentState = value;
    }

    getState(): State {
        return this.currentState;
    }
}