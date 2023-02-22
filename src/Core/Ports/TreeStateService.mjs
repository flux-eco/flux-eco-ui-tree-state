import {TreeStateEventsRecorder} from "../Domain/TreeStateEventsRecorder.mjs";
import {TreeStateAggregate} from "../Domain/TreeStateAggregate.mjs";
import {Id} from "../Domain/ValueObjects/Id.mjs";
import {TreeStateManager} from "./TreeStateManager.mjs";
import {TreeStatePublisher} from "./TreeStatePublisher.mjs";

export class TreeStateService {
    /**
     * @var {FluxUiTreeStatePublisher}
     */
    #fluxUiTreeStatePublisher;
    /**
     * @var {FluxUiTreeStateManager}
     */
    #fluxUiTreeStateManager;

    /**
     * @private
     */
    constructor(fluxUiTreeStatePublisher, fluxUiTreeDataStateManager) {
        this.#fluxUiTreeStatePublisher = fluxUiTreeStatePublisher;
        this.#fluxUiTreeStateManager = fluxUiTreeDataStateManager;
    }

    /**
     * @param {TreeStatePublisher} fluxUiTreeStatePublisher
     * @param {TreeStateManager} fluxUiTreeDataStateManager
     * @return {Promise<TreeStateService>}
     */
    static async new(
        fluxUiTreeStatePublisher,
        fluxUiTreeDataStateManager
    ) {
        return new TreeStateService(fluxUiTreeStatePublisher, fluxUiTreeDataStateManager)
    }

    /**
     * @param {string} treeId
     * @param {object} nodeDataSchema
     * @return {Promise<void>}
     */
    async createTree(treeId, nodeDataSchema) {
        const eventRecorder = TreeStateEventsRecorder.new();
        const aggregate = TreeStateAggregate.create(eventRecorder, treeId, nodeDataSchema);

        const recordedEvents = eventRecorder.getRecordedEvents();
        if (recordedEvents.length > 0) {
            await this.#fluxUiTreeStateManager.setState(aggregate.id.path, aggregate.getState())
        }
    }

    /**
     * @param {string} treeId
     * @param {string} nodeId
     * @param {object} nodeData
     * @param {boolean} expanded
     * @return {Promise<void>}
     */
    async appendNodeToRoot(treeId, nodeId, nodeData, expanded) {
        const eventRecorder = TreeStateEventsRecorder.new();
        const treeState = await this.#fluxUiTreeStateManager.getState(Id.newTreeId(treeId).path);
        const aggregate = await TreeStateAggregate.fromState(eventRecorder, treeState);

        await aggregate.appendNodeToRoot(nodeId, nodeData, expanded);
        const recordedEvents = eventRecorder.getRecordedEvents();
        if (recordedEvents.length > 0) {
            await this.#fluxUiTreeStateManager.setState(aggregate.id.path, aggregate.getState())
        }
    }

    /**
     * @param {string} treeId
     * @param {string} parentNodeId
     * @param {string} nodeId
     * @param {object} nodeData
     * @param {boolean} expanded
     * @return {Promise<void>}
     */
    async appendNodeToParentNode(treeId, parentNodeId, nodeId, nodeData, expanded = false) {
        const eventRecorder = TreeStateEventsRecorder.new();

        const treeState = await this.#fluxUiTreeStateManager.getState(Id.newTreeId(treeId).path);
        const aggregate = await TreeStateAggregate.fromState(eventRecorder, treeState);

        await aggregate.appendNodeToParentNode(parentNodeId, nodeId, nodeData, expanded)
        const recordedEvents = eventRecorder.getRecordedEvents();
        if (recordedEvents.length > 0) {
            await this.#fluxUiTreeStateManager.setState(aggregate.id.path, aggregate.getState())
        }
    }

    /**
     * @param {string} treeId
     * @param {string} nodeId
     * @return {Promise<void>}
     */
    async toggleNodeStatusExpanded(treeId, nodeId) {
        const eventRecorder = TreeStateEventsRecorder.new();
        const treeState = await this.#fluxUiTreeStateManager.getState(Id.newTreeId(treeId).path);
        const aggregate = await TreeStateAggregate.fromState(eventRecorder, treeState);
        await aggregate.toggleNodeStatusExpanded(nodeId);
        const recordedEvents = eventRecorder.getRecordedEvents();
        if (recordedEvents.length > 0) {
            await this.#fluxUiTreeStateManager.setState(aggregate.id.path, aggregate.getState())
        }
    }

    /**
     * @param {string} treeId
     * @return {TreeState}
     */
    async getState(treeId) {
        return await this.#fluxUiTreeStateManager.getState(Id.newTreeId(treeId).path);
    }

    /**
     * @param {string} subscriberId
     * @param {string} treeId
     * @param {function} callback
     * @return {Promise<void>}
     */
    async subscribeToStateChanged(subscriberId, treeId, callback) {
        this.#fluxUiTreeStatePublisher.subscribe(subscriberId, Id.newTreeId(treeId).path, callback);
    }
}