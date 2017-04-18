# Logging Microservice

This is a logging microservice from Pip.Services library. 
It collects execution logs from distributed microservices, stores 
and provides a single entry point to read all of them.

The microservice currently supports the following deployment options:
* Deployment platforms: Standalone Process, Seneca Plugin
* External APIs: HTTP/REST, Seneca
* Persistence: Memory

This microservice has no dependencies on other microservices.

<a name="links"></a> Quick Links:

* [Download Links](doc/Downloads.md)
* [Development Guide](doc/Development.md)
* [Configuration Guide](doc/Configuration.md)
* [Deployment Guide](doc/Deployment.md)
* Implementations in other languages
  - [Python](https://github.com/pip-services-infrastructure/pip-services-logging-python)
* Client SDKs
  - [Node.js SDK](https://github.com/pip-services-infrastructure/pip-clients-logging-node)
  - [Python SDK](https://github.com/pip-services-infrastructure/pip-clients-logging-python)
* Communication Protocols
  - [HTTP Version 1](doc/HttpProtocolV1.md)
  - [Seneca Version 1](doc/SenecaProtocolV1.md)

## Contract

Logical contract of the microservice is presented below. For physical implementation (HTTP/REST, Thrift, Seneca, Lambda, etc.),
please, refer to documentation of the specific protocol.

```typescript
class LogMessageV1 {	
	public time: Date;
	public source: string;
	public level: LogLevel;
	public correlation_id: string;
	public error: ErrorDescription;
	public message: string;
}

interface ILoggingV1 {
    readMessages(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<LogMessageV1>) => void): void;

    readErrors(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<LogMessageV1>) => void): void;

    writeMessage(correlationId: string, message: LogMessageV1,
        callback?: (err: any, message: LogMessageV1) => void): void;
    
    writeMessages(correlationId: string, messages: LogMessageV1[],
        callback?: (err: any) => void): void;

    clear(correlationId: string, callback?: (err: any) => void): void;
}
```

## Download

Right now the only way to get the microservice is to check it out directly from github repository
```bash
git clone git@github.com:pip-services-infrastructure/pip-services-logging.git
```

Pip.Service team is working to implement packaging and make stable releases available for your 
as zip downloadable archieves.

## Run

Add **config.yaml** file to the root of the microservice folder and set configuration parameters.
As the starting point you can use example configuration from **config.example.yaml** file. 

Example of microservice configuration
```yaml
- descriptor: "pip-services-container:container-info:default:default:1.0"
  name: "pip-services-logging"
  description: "Logging microservice"

- descriptor: "pip-services-commons:logger:console:default:1.0"
  level: "trace"

- descriptor: "pip-services-logging:persistence:memory:default:1.0"

- descriptor: "pip-services-logging:controller:default:default:1.0"

- descriptor: "pip-services-logging:service:http:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 8080
```
 
For more information on the microservice configuration see [Configuration Guide](Configuration.md).

Start the microservice using the command:
```bash
node run
```

## Use

The easiest way to work with the microservice is to use client SDK. 
The complete list of available client SDKs for different languages is listed in the [Quick Links](#links)

If you use Node.js then you should add dependency to the client SDK into **package.json** file of your project
```javascript
{
    dependencies: {
        ...
        "pip-clients-logging-node": "^1.0.*"
        ...
    }
}
```

Inside your code get the reference to the client SDK
```javascript
var sdk = new require('pip-clients-logging-node');
```

Define client configuration parameters that match configuration of the microservice external API
```javascript
// Client configuration
var config = {
    connection: {
        protocol: 'http',
        host: 'localhost', 
        port: 8080
    }
};
```

Instantiate the client and open connection to the microservice
```javascript
// Create the client instance
var client = sdk.LoggingHttpClientV1(config);

// Connect to the microservice
client.open(null, function(err) {
    if (err) {
        console.error('Connection to the microservice failed');
        console.error(err);
        return;
    }
    
    // Work with the microservice
    ...
});
```

Now the client is ready to perform operations
```javascript
// Log a message
client.writeMessage(
    null,
    {
        time: new Date(),
        level: 2,
        message: 'Restarted server'
    },
    function (err, message) {
        ...
    }
);
```

```javascript
var now = new Date();

// Get the list system activities
client.readMessages(
    null,
    {
        from_time: new Date(now.getTime() - 24 * 3600 * 1000),
        to_time: now,
        search: 'server'
    },
    {
        total: true,
        skip: 0, 
        take: 10  
    },
    function(err, page) {
    ...    
    }
);
```    

## Acknowledgements

This microservice was created and currently maintained by *Sergey Seroukhov*.

