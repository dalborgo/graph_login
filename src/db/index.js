'use strict';

const couchbase = require('couchbase');

const cluster = new couchbase.Cluster(`couchbase://10.0.2.36`)
const auth = {username: 'ottoman', password: '902100'}
cluster.authenticate(auth);
const bucket = cluster.openBucket('ottoman')


const ottoman = require('ottoman');
ottoman.store = new ottoman.CbStoreAdapter(bucket, couchbase);

module.exports = {
  bucket,
  ottoman
};
