class BaseView {
    
    constructor() {

        let events = {};

        MicroEvent.mixin(events);

        this.events = events;

    }

    init() {

    }

    bind(event, func) {

        this.events.bind(event, func);
    }

    unbind(event, func) {

        this.events.unbind(event, func);
    }

    trigger(event, ...args) {

        args.unshift(event);

        this.events.trigger.apply(this.events, args);
    }
}