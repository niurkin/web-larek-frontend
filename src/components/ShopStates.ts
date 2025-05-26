import {State, TransitionMap, StateChangedEvent} from "../types";
import {IEvents} from "./base/events";

export class ShopStates {
    protected currentState: State = 'browsing';
    protected previousState: State | undefined = undefined;
    protected transitions: TransitionMap;

    constructor (protected events: IEvents, transitions: TransitionMap) {
        this.transitions = transitions;
    }

    dispatch(event: string, data?: unknown) {
        const nextState = this.transitions[this.currentState]?.[event];
        if (nextState) {
            this.previousState = this.currentState;
            this.setState(nextState);

            const payload: StateChangedEvent = {
                state: this.currentState,
                data: data as any,
            };

            this.events.emit('state:changed', payload);
          }
    }

    setState(value: State) {
        this.currentState = value;
    }

    getState(): State {
        return this.currentState;
    }

    getPreviousState(): State | 'none' {
        return this.previousState;
    }
}