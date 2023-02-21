import {FluxUiTreeStateService} from "../../Core/Ports/FluxUiTreeStateService.mjs";
import {FluxUiTreeStateManager} from "../../Core/Ports/FluxUiTreeStateManager.mjs";
import {FluxUiTreeStateManagerAdapter} from "../State/FluxUiTreeStateManagerAdapter.mjs";
import {FluxUiTreeStatePublisher} from "../../Core/Ports/FluxUiTreeStatePublisher.mjs";

/**
 * @typedef {Object} FluxUiTreeStatePublisherAdapter
 * @property {function(string, Object, Object)} publish
 * @property {function(string, string, function)} subscribe
 * @property {function(string, string)} unsubscribe
 */

/**
 * Creates and manages states of tree data
 *
 * @type FluxUiTreeStateApi
 */
export class FluxUiTreeStateApi {
    name = "flux-eco-ui-tree-state";
    /**
     * @var {FluxUiTreeStateService} #service
     */
    #service;

    /**
     * @private
     * @param {FluxUiTreeStateService} service
     */
    constructor(service) {
        this.#service = service;
    }

    /**
     * @property {FluxUiTreeStatePublisherAdapter} fluxUiTreeStatePublisherAdapter
     * @return {Promise<FluxUiTreeStateApi>}
     */
    static async new(fluxUiTreeStatePublisherAdapter) {
        const fluxUiTreeStatePublisher = await FluxUiTreeStatePublisher.new(fluxUiTreeStatePublisherAdapter);
        return new FluxUiTreeStateApi(await FluxUiTreeStateService.new(fluxUiTreeStatePublisher, await FluxUiTreeStateManager.new(await FluxUiTreeStateManagerAdapter.new(fluxUiTreeStatePublisher))));
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