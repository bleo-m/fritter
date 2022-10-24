/* eslint-disable @typescript-eslint/restrict-template-expressions */

function reactToFreetByFreetId(fields) {
  fetch(`/api/reactions/${fields.freetId}`, {
    method: 'POST',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    body: JSON.stringify({emotion: fields.reaction}),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function updateReactToFreetByFreetId(fields) {
  fetch(`/api/reactions/${fields.freetId}`, {
    method: 'PUT',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    body: JSON.stringify({emotion: fields.reaction}),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}
