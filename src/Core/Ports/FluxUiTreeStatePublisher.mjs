export class FluxUiTreeStatePublisher {
    #statePublisher;

    constructor(statePublisher) {
        this.#statePublisher = statePublisher;
    }

    /**
     * @return {Promise<FluxUiTreeStatePublisher>}
     */
    static async new(
        statePublisher
    ) {
        return new FluxUiTreeStatePublisher(statePublisher)
    }

    /**
     *
     * @param {string} idPath
     * @param {object} newState
     * @param {object} oldState
     */
    publish(idPath, newState, oldState) {
        this.#statePublisher.publish(idPath, newState, oldState)
    }

    /**
     * @param {string} subscriberId
     * @param {string} idPath
     * @param {function} callback
     */
    subscribe(subscriberId, idPath, callback) {
        this.#statePublisher.subscribe(subscriberId, idPath, callback)
    }

    /**
     * @param {string} subscriberId
     * @param {string} idPath
     */
    unsubscribe(subscriberId, idPath) {
        this.#statePublisher.unsubscribe(subscriberId, idPath)
    }
}