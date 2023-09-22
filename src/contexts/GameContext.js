import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as gameService from '../services/gameService';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    gameService.getAll().then((result) => {
      setGames(result);
      // console.log(result);
    });
  }, []);

  const addComment = (gameId, comment) => {
    setGames((state) => {
      const game = state.find((x) => x._id === gameId);

      const comments = game.comments || [];
      comments.push(comment);

      return [...state.filter((x) => x._id !== gameId), { ...game, comments }];
    });
  };

  const gameAdd = (gameData) => {
    setGames((state) => [...state, gameData]);

    navigate('/catalog');
  };

  const gameEdit = (gameId, gameData) => {
    setGames((state) => state.map((x) => (x._id === gameId ? gameData : x)));
  };

  return (
    <GameContext.Provider
      value={{
        games,
        addComment,
        gameAdd,
        gameEdit,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
