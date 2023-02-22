export class TreeStateEventsRecorder {
    /**
     * @type {array}
     */
    recordedEvents = [];

    constructor() {
    }

    static new() {
        return new TreeStateEventsRecorder();
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