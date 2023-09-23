import * as request from './requester';

const baseUrl = 'http://localhost:3030/data/comments';

export const create = (gameId, comment) =>
  request.post(baseUrl, { gameId, text: comment });

export const getByGameId = (gameId) => {
  const relationQuery = encodeURIComponent(`author=_ownerId:users`);
  const searchQuery = encodeURIComponent(`gameId="${gameId}"`);

  return request.get(`${baseUrl}?where=${searchQuery}&load=${relationQuery}`);
};
