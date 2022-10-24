/* eslint-disable @typescript-eslint/restrict-template-expressions */

function commentOnFreetByFreetId(fields) {
  console.log(fields);
  fetch(`/api/comments/${fields.freetId}`, {
    method: 'POST',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    body: JSON.stringify({content: fields.commentContent}),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function getCommentsByFreetId(fields) {
  fetch(`/api/comments?freetId=${fields.freetId}`, {method: 'GET'})
    .then(showResponse)
    .catch(showResponse);
}

function getAllComments(fields) {
  fetch('/api/comments', {method: 'GET'})
    .then(showResponse)
    .catch(showResponse);
}
