/* eslint-disable @typescript-eslint/restrict-template-expressions */

function addWarningToFreetByFreetId(fields) {
  fetch(`/api/controversy-warnings/${fields.freetId}`, {
    method: 'POST',
    body: JSON.stringify({active: false}),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function reportFreetByFreetId(fields) {
  fetch(`/api/controversy-warnings/${fields.freetId}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function getControversyByFreetId(fields) {
  fetch(`/api/controversy-warnings?freetId=${fields.freetId}`, {method: 'GET'})
    .then(showResponse)
    .catch(showResponse);
}
