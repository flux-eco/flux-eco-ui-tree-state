/**
 * @type TreeCreatedEvent
 * @property {TreeState} treeState
 */
export class TreeCreatedEvent {
    /**
     * @param {TreeState} treeState
     * @return {TreeCreatedEvent}
     */
    static new(treeState) {
        return {
            treeState
        }
    }
}

