const couchbase = require('couchbase')
const ottoman = require('ottoman-in')
const cluster = new couchbase.Cluster(`couchbase://10.0.2.36`)
const bucket = cluster.openBucket('ottoman', '902100')
const viewQuery = couchbase.ViewQuery
ottoman.store = new ottoman.CbStoreAdapter(bucket, couchbase)

export {
  bucket,
  viewQuery,
  ottoman
}
