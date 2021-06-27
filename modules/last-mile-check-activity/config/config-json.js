module.exports = function configJSON(req) {
  return {
    workflowApiVersion: '1.1',
    metaData: {
      // the location of our icon file
      icon: `images/icon.png`,
      category: 'customer',
      isConfigured: false,
      configurationDisabled: false
    },
    // For Custom Activity this must say, "REST"
    key: "REST-1",
    type: 'REST',
    lang: {
      'en-US': {
        name: 'Last Mile Check',
        description: 'Last Mile Check'
      }
    },
    arguments: {
      execute: {
        // See: https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/how-data-binding-works.htm
        inArguments: [
          {
            city: ""
          }
        ],
        outArguments: [
          {
            temperature: ""
          }
        ],
        // Fill in the host with the host that this is running on.
        // It must run under HTTPS
        url: `https://${req.headers.host}/modules/last-mile-check-activity/execute`,
        // The amount of time we want Journey Builder to wait before cancel the request. Default is 60000, Minimal is 1000
        timeout: 10000,
        // how many retrys if the request failed with 5xx error or network error. default is 0
        retryCount: 3,
        // wait in ms between retry.
        retryDelay: 1000,
        // The number of concurrent requests Journey Builder will send all together
        concurrentRequests: 5
      }
    },
    configurationArguments: {
      publish: {
        url: `https://${req.headers.host}/modules/last-mile-check-activity/publish`
      },
      validate: {
        url: `https://${req.headers.host}/modules/last-mile-check-activity/validate`
      },
      stop: {
        url: `https://${req.headers.host}/modules/last-mile-check-activity/stop`
      }
    },
    userInterfaces: {
      configurationSupportsReadOnlyMode : true,
      configInspector: {
        size: 'scm-lg',
        emptyIframe: true
      }
    },
    schema: {
      arguments: {
        execute: {
          inArguments: [{
            city: {
              dataType: 'Text',
              direction: 'in',
              access: 'visible'
            }
          }],
          outArguments: [{
            temperature: {
              dataType: 'Text',
              direction: 'out',
              access: 'visible'
            }
          }]
        }
      }
    }
  };
};
