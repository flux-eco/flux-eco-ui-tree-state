import {FluxUiTreeStatePublisher} from "../../Core/Ports/FluxUiTreeStatePublisher.mjs";

export class FluxUiTreeStateManagerAdapter {
    /**
     * @var {FluxUiTreeStatePublisher}
     */
    #fluxUiTreeStatePublisher;

    constructor(fluxUiTreeStatePublisher) {
        this.#fluxUiTreeStatePublisher = fluxUiTreeStatePublisher;
        this.state = new Map();
    }

    /**
     * @param {FluxUiTreeStatePublisher} fluxUiTreeStatePublisher
     * @return {Promise<FluxUiTreeStateManagerAdapter>}
     */
    static async new(
        fluxUiTreeStatePublisher
    ) {
        return new FluxUiTreeStateManagerAdapter(fluxUiTreeStatePublisher)
    }

    async setState(idPath, newState) {
        const oldState = await {...await this.state.get(idPath)};
        await this.state.set(idPath, newState);
        this.#fluxUiTreeStatePublisher.publish(idPath, newState, oldState)
    }

    async getState(idPath) {
        if (this.state.has(idPath)) {
            return await this.state.get(idPath)
        }
        return {};
    }
}
