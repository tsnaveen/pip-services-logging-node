import { ComponentSet } from 'pip-services-runtime-node';
import { ComponentConfig } from 'pip-services-runtime-node';
import { DynamicMap } from 'pip-services-runtime-node';

import { LoggingMongoDbPersistence } from '../../src/persistence/LoggingMongoDbPersistence';
import { LoggingPersistenceFixture } from './LoggingPersistenceFixture';

let options = new DynamicMap(require('../../../config/config'));
let dbOptions = new ComponentConfig(null, options.getMap('persistence'));

suite('LoggingMongoDbPersistence', ()=> {
    // Skip test if mongodb is not configured
    if (dbOptions.getRawContent().getString('descriptor.type') != 'mongodb')
        return; 
    
    let db = new LoggingMongoDbPersistence();
    db.configure(dbOptions);

    let fixture = new LoggingPersistenceFixture(db);

    suiteSetup((done) => {
        db.link(new ComponentSet());
        db.open(done);
    });
    
    suiteTeardown((done) => {
        db.close(done);
    });
    
    setup((done) => {
        db.clearTestData(done);
    });
    
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });
});