const { MongoClient, ServerApiVersion } = require('mongodb');

/**
 * @class MongoDB
 * @description Connects to MongoDB
    * @constructor
    * @params {Object} props
    * @params {String} props.username
    * @params {String} props.pass
    * @params {String} props.cluster
    * @params {String} props.app_name
    * @returns {Object}
 */
function MongoDB(props = {}) {
    if (!props) return;
    if (!props.username || !props.pass || !props.cluster || !props.app_name) return;

    const _uri = `mongodb+srv://${props.username}:${props.pass}@${props.cluster}.pfrsx.mongodb.net/?retryWrites=true&w=majority&appName=${props.app_name}`;
    let _client;

    /**
     * @function run
     * @description Connects to MongoDB
        * @returns {Object}
     */
    const run = async () => {
        _client = new MongoClient(_uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        console.log("Connecting to MongoDB...");
        try {
            // Connect the client to the server	(optional starting in v4.7)
            await _client.connect();
            // Send a ping to confirm a successful connection
            await _client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            return { error: false, name: "connected", client: _client };
        } catch (err) {
            // Ensures that the client will close when you finish/error
            return { error: true, name: "connection_closed", err };
        }
    };
    /**
     * @function close
     * @description Closes the connection to MongoDB
        * @returns undefined
     */
    const close = async () => {
        if (!_client) return { error: true, name: "client_not_found" };
        await _client.close();
    };
    /**
     * @function check_db
     * @description Checks if a database exists
        * @params {String} db
        * @returns {Boolean}
     */
    const check_db = async (db) => {
        if (!_client) return { error: true, name: "client_not_found" };
        if (!db) return { error: true, name: "db_arg_not_found" };
        const dbs = await _client.db().admin().listDatabases();
        if (!dbs) return { error: true, name: "no_dbs_found" };
        if (dbs.databases.length < 1) return { error: true, name: "dbs_dont_exist" };
        const exists = dbs.databases.some((d) => d.name === db);
        return exists;
    };
    /**
     * @function check_collection
     * @description Checks if a collection exists
        * @params {String} db
        * @params {String} collection
        * @returns {Boolean}
     */
    const check_collection = async (db, collection) => {
        if (!_client) return { error: true, name: "client_not_found" };
        if (!db || !collection) return { error: true, name: "db_collection_not_found" };
        const _db_ = _client.db(db);
        const collections = await _db_.listCollections().toArray();
        if (!collections) return { error: true, name: "no_collections_found" };
        if (collections.length < 1) return { error: true, name: "collections_dont_exist" };
        const exists = collections.some((c) => c.name === collection);
        return exists;
    }
    /**
     * @function query
     * @description Queries MongoDB
        * @params {String} db
        * @params {String} collection
        * @params {Object} opts
        * @params {String} opts.method
        * @params {Object} opts.query
        * @params {Object} opts.options
        * @params {Boolean} opts.to_array
        * @returns {Object | Error}
     */
    const query = async (db, collection, opts = {}) => {
        if (!_client) return { error: true, name: "client_not_found" };
        if (!db || !collection) return { error: true, name: "db_collection_not_found" };
        if (!opts.method) return { error: true, name: "method_arg_not_found" };
        const db_exists = await check_db(db);
        if (!db_exists) return { error: true, name: "db_not_found" };
        const _db_ = _client.db(db);
        const collection_exists = await check_collection(db, collection);
        if (!collection_exists) return { error: true, name: "collection_not_found" };
        const _collection_ = _db_.collection(collection);
        if (!_collection_[opts.method]) return { error: true, name: "method_not_found" };
        const query = opts.query || {};
        const options = opts.options || {};
        const q = await _collection_[opts.method](query, options);

        return {error: false, name: "query_success", result: opts.to_array ? await q.toArray() : q };
    };
    /**
     * @function query_scheme
        * @description Queries MongoDB with a scheme
        * @params {String} db
        * @params {Object} scheme
        * @params {Object} opts
        * @params {Object} opts.options
        * @params {Boolean} opts.to_array
        * @returns {Object | Error}
        * @see Scheme
     */
    const query_scheme = async (db, scheme, opts = {}) => {
        if(!scheme) return { error: true, name: "scheme_arg_not_found" };
        if(!scheme.collection) return { error: true, from: "MongoDB - query_scheme", name: "collection_name_not_found" };
        if(!scheme.values) return { error: true, from: "MongoDB - query_scheme", name: "scheme_values_not_found" };
        opts.query = scheme.values;
        const q = await query(db, scheme.collection, opts);
        return q;
    };
    const __public = {
        run,
        close,
        query,
        query_scheme,
    };
    return __public;
}

exports.MongoDB = MongoDB;
