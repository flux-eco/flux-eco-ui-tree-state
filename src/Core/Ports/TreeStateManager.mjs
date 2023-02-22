export class TreeStateManager {
    #stateManager;

    constructor(stateManager) {
        this.#stateManager = stateManager;
    }

    /**
     * @return {Promise<TreeStateManager>}
     */
    static async new(
        stateManager
    ) {
        return new TreeStateManager(stateManager)
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