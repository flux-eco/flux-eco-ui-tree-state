import {TreeStateService} from "../../Core/Ports/TreeStateService.mjs";
import {TreeStateManager} from "../../Core/Ports/TreeStateManager.mjs";
import {FluxEcoUiTreeStateManagerAdapter} from "../State/FluxEcoUiTreeStateManagerAdapter.mjs";
import {TreeStatePublisher} from "../../Core/Ports/TreeStatePublisher.mjs";

/**
 * @typedef {Object} FluxUiTreeStatePublisherAdapter
 * @property {function(string, Object, Object)} publish
 * @property {function(string, string, function)} subscribe
 * @property {function(string, string)} unsubscribe
 */

/**
 * Creates and manages states of tree data
 *
 * @type FluxEcoUiTreeStateApi
 */
export class FluxEcoUiTreeStateApi {
    name = "flux-eco-ui-tree-state";
    /**
     * @var {FluxUiTreeStateService} #service
     */
    #service;

    /**
     * @private
     * @param {TreeStateService} service
     */
    constructor(service) {
        this.#service = service;
    }

    /**
     * @property {FluxUiTreeStatePublisherAdapter} fluxUiTreeStatePublisherAdapter
     * @return {Promise<FluxEcoUiTreeStateApi>}
     */
    static async new(fluxUiTreeStatePublisherAdapter) {
        const fluxUiTreeStatePublisher = await TreeStatePublisher.new(fluxUiTreeStatePublisherAdapter);
        return new FluxEcoUiTreeStateApi(await TreeStateService.new(fluxUiTreeStatePublisher, await TreeStateManager.new(await FluxEcoUiTreeStateManagerAdapter.new(fluxUiTreeStatePublisher))));
    }

    /**
     * @param {string} treeId
     * @param {object} nodeDataSchema - a schema object describing the node data
     * @return {Promise<void>}
     */
    async createTree(treeId, nodeDataSchema) {
        await this.#service.createTree(treeId, nodeDataSchema);
    }

    /**
     * @param {string} treeId
     * @param {string} nodeId
     * @param {object} nodeData
     * @param {boolean} expanded
     * @return {Promise<void>}
     */
    async appendNodeToRoot(treeId, nodeId, nodeData, expanded = true) {
        await this.#service.appendNodeToRoot(treeId, nodeId, nodeData, expanded);
    }

    /**
     * @param {string} treeId
     * @param {string} parentNodeId
     * @param {string} nodeId
     * @param {object} nodeData
     * @param {boolean} expanded
     * @return {Promise<void>}
     */
    async appendNodeToParentNode(treeId, parentNodeId, nodeId, nodeData, expanded = true) {
        await this.#service.appendNodeToParentNode(treeId, parentNodeId, nodeId, nodeData, expanded);
    }

    /**
     * @param {string} treeId
     * @param {string} nodeId
     * @return {Promise<void>}
     */
    async toggleNodeStatusExpanded(treeId, nodeId) {
        await this.#service.toggleNodeStatusExpanded(treeId, nodeId);
    }

    /**
     * @param treeId
     * @return {Promise<TreeState>}
     */
    async getState(treeId) {
        return this.#service.getState(treeId);
    }

    /**
     * @param {string} subscriberId
     * @param {string} treeId
     * @param {function} callback
     * @return {Promise<void>}
     */
    async subscribeToStateChanged(subscriberId, treeId, callback) {
        await this.#service.subscribeToStateChanged(subscriberId, treeId, callback)
    }
}