import {TreeStatePublisher} from "../../Core/Ports/TreeStatePublisher.mjs";

export class FluxEcoUiTreeStateManagerAdapter {
    /**
     * @var {FluxUiTreeStatePublisher}
     */
    #fluxUiTreeStatePublisher;

    constructor(fluxUiTreeStatePublisher) {
        this.#fluxUiTreeStatePublisher = fluxUiTreeStatePublisher;
        this.state = new Map();
    }

    /**
     * @param {TreeStatePublisher} fluxUiTreeStatePublisher
     * @return {Promise<FluxEcoUiTreeStateManagerAdapter>}
     */
    static async new(
        fluxUiTreeStatePublisher
    ) {
        return new FluxEcoUiTreeStateManagerAdapter(fluxUiTreeStatePublisher)
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
