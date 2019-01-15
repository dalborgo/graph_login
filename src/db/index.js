'use strict'

const couchbase = require('couchbase')

const cluster = new couchbase.Cluster(`couchbase://10.0.2.36`)
const bucket = cluster.openBucket('ottoman', '902100')

const ottoman = require('ottoman')
ottoman.store = new ottoman.CbStoreAdapter(bucket, couchbase)

module.exports = {
  bucket,
  ottoman
}
