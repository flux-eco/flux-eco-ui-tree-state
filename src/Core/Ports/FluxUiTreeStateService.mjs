import {FluxUiTreeStateEventsRecorder} from "../Domain/FluxUiTreeStateEventsRecorder.mjs";
import {FluxUiTreeStateAggregate} from "../Domain/FluxUiTreeStateAggregate.mjs";
import {Id} from "../Domain/ValueObjects/Id.mjs";
import {FluxUiTreeStateManager} from "./FluxUiTreeStateManager.mjs";
import {FluxUiTreeStatePublisher} from "./FluxUiTreeStatePublisher.mjs";

export class FluxUiTreeStateService {
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
     * @param {FluxUiTreeStatePublisher} fluxUiTreeStatePublisher
     * @param {FluxUiTreeStateManager} fluxUiTreeDataStateManager
     * @return {Promise<FluxUiTreeStateService>}
     */
    static async new(
        fluxUiTreeStatePublisher,
        fluxUiTreeDataStateManager
    ) {
        return new FluxUiTreeStateService(fluxUiTreeStatePublisher, fluxUiTreeDataStateManager)
    }

    /**
     * @param {string} treeId
     * @param {object} nodeDataSchema
     * @return {Promise<void>}
     */
    async createTree(treeId, nodeDataSchema) {
        const eventRecorder = FluxUiTreeStateEventsRecorder.new();
        const aggregate = FluxUiTreeStateAggregate.create(eventRecorder, treeId, nodeDataSchema);

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
        const eventRecorder = FluxUiTreeStateEventsRecorder.new();
        const treeState = await this.#fluxUiTreeStateManager.getState(Id.newTreeId(treeId).path);
        const aggregate = await FluxUiTreeStateAggregate.fromState(eventRecorder, treeState);

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
        const eventRecorder = FluxUiTreeStateEventsRecorder.new();

        const treeState = await this.#fluxUiTreeStateManager.getState(Id.newTreeId(treeId).path);
        const aggregate = await FluxUiTreeStateAggregate.fromState(eventRecorder, treeState);

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
        const eventRecorder = FluxUiTreeStateEventsRecorder.new();
        const treeState = await this.#fluxUiTreeStateManager.getState(Id.newTreeId(treeId).path);
        const aggregate = await FluxUiTreeStateAggregate.fromState(eventRecorder, treeState);
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