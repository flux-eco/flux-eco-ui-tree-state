export class FluxUiTreeStateEventsRecorder {
    /**
     * @type {array}
     */
    recordedEvents = [];

    constructor() {
    }

    static new() {
        return new FluxUiTreeStateEventsRecorder();
    }

    recordEvent(event) {
        this.recordedEvents.push(event);
    }

    getRecordedEvents() {
        const events = this.recordedEvents;
        this.recordedEvents = [];
        return events;
    }
}