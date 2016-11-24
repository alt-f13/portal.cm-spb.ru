/**
 * Map function - use `emit(key, value)1 to generate rows in the output result.
 * @link http://docs.couchdb.org/en/latest/couchapp/ddocs.html#reduce-and-rereduce-functions
 *
 * @param {object} doc - Document Object.
 */
function(doc) {
  if (doc.type == "schedule" && doc._id > (Math.floor(Date.now() / 1000)-86400*7)) {
      emit([doc._id], '');
    }
  }
