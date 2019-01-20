'use strict'

const couchbase = require('couchbase')
const ottoman = require('ottoman')

const cluster = new couchbase.Cluster(`couchbase://127.0.0.1`)
const bucket = cluster.openBucket('ottoman', '902100')

ottoman.store = new ottoman.CbStoreAdapter(bucket, couchbase)
export { bucket, ottoman };
