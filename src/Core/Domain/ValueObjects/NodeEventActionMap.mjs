/**
 * An event-action map where each key is an event name and each value is an array of action names.
 *
 * @type NodeEventActionMap
 * @property {string} eventName
 * @property {string} actionName
 */
export class NodeEventActionMap {
    /**
     * @param {array<EventActionMapping>} eventActionMappings - An array of event-action mappings.
     * @returns {NodeEventActionMap}
     */
    new(eventActionMappings) {
        // Initialize an empty map
        const eventActionMap = {};

        // Loop over each mapping in the array
        eventActionMappings.forEach((mapping) => {
            // Check if the event name already exists in the map
            if (mapping.eventId in eventActionMap) {
                // If it exists, append the action name to the existing array of action names
                eventActionMap[mapping.eventName].push(mapping.actionName);
            } else {
                // If it doesn't exist, create a new array of action names with the current action name
                eventActionMap[mapping.eventName] = [mapping.actionName];
            }
        });

        return eventActionMap;
    }
}