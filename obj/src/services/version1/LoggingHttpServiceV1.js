"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_net_node_1 = require("pip-services-net-node");
class LoggingHttpServiceV1 extends pip_services_net_node_1.CommandableHttpService {
    constructor() {
        super('logging');
        this._dependencyResolver.put('controller', new pip_services_commons_node_1.Descriptor('pip-services-logging', 'controller', 'default', '*', '1.0'));
    }
}
exports.LoggingHttpServiceV1 = LoggingHttpServiceV1;
//# sourceMappingURL=LoggingHttpServiceV1.js.map