/**
 * Custom activities load inside an iframe. We'll use postmonger to manage
 * the cross-document messaging between Journey Builder and the activity
 */
import Postmonger from 'postmonger';

const connection = new Postmonger.Session();

let activity = null;
let eventDefinitionKey = null;

// NOTE: Wait for the document to load before we doing anything
document.addEventListener('DOMContentLoaded', function main() {

    // setup our ui event handlers
    setupEventHandlers();

    // Bind the initActivity event...
    // Journey Builder will respond with "initActivity" after it receives the "ready" signal
    connection.on('initActivity', onInitActivity);

    connection.on("requestedTriggerEventDefinition", function (
      eventDefinitionModel
    ) {
      if (eventDefinitionModel) {
        eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
      }
    });

    connection.trigger('ready');
});

/**
 * 
 * @description {*} this function is triggered by Journey Builder via Postmonger.
 *  Journey Builder will send us a copy of the activity here.
 */
function onInitActivity(payload) {

    // set the activity object from this payload. We'll refer to this object as we
    // modify it before saving.
    activity = payload;

    const hasInArguments = Boolean(
        activity.arguments &&
        activity.arguments.execute &&
        activity.arguments.execute.inArguments &&
        activity.arguments.execute.inArguments.length > 0
    );

    const inArguments = hasInArguments ? activity.arguments.execute.inArguments : [];

    console.log('-------- triggered:onInitActivity({obj}) --------');
    console.log('activity:\n ', JSON.stringify(activity, null, 4));
    console.log('Has In Arguments: ', hasInArguments);
    console.log('inArguments', inArguments);
    console.log('-------------------------------------------------');

    connection.trigger('requestTriggerEventDefinition');
}

function onDoneButtonClick() {
    let payload = activity;

    // we set must metaData.isConfigured to true in order to tell JB that
    // this activity is ready for activation
    payload.metaData.isConfigured = true;

    payload.arguments.execute.inArguments[0].dummyInput = "{{Event." + eventDefinitionKey + ".\"City\"}}";
    connection.trigger('updateActivity', payload);

    // now request that Journey Builder closes the inspector/drawer
    connection.trigger('requestInspectorClose');
}

function onCancelButtonClick() {
    // tell Journey Builder that this activity has no changes.
    // we wont be prompted to save changes when the inspector closes
    connection.trigger('setActivityDirtyState', false);

    // now request that Journey Builder closes the inspector/drawer
    connection.trigger('requestInspectorClose');
}

function setupEventHandlers() {
    // Listen to events on the form
    document.getElementById('done').addEventListener('click', onDoneButtonClick);
    document.getElementById('cancel').addEventListener('click', onCancelButtonClick);
}
