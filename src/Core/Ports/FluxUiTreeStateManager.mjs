export class FluxUiTreeStateManager {
    #stateManager;

    constructor(stateManager) {
        this.#stateManager = stateManager;
    }

    /**
     * @return {Promise<FluxUiTreeStateManager>}
     */
    static async new(
        stateManager
    ) {
        return new FluxUiTreeStateManager(stateManager)
    }

    /**
     *
     * @param {string} idPath
     * @param {TreeState} newState
     * @return {Promise<void>}
     */
    async setState(idPath, newState) {
        await this.#stateManager.setState(idPath, newState)
    }

    /**
     *
     * @param {string} idPath
     * @return {Promise<TreeState>}
     */
    async getState(idPath) {
        return this.#stateManager.getState(idPath)
    }
}