import { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import * as gameService from './services/gameService';
import { AuthProvider } from './contexts/AuthContext';
import { GameContext } from './contexts/GameContext';

import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Logout from './components/Logout/Logout';
import CreateGame from './components/CreateGame/CreateGame';
import EditGame from './components/EditGame/EditGame';
import Catalog from './components/Catalog/Catalog';
import GameDetails from './components/GameDetails/GameDetails';
import './App.css';

const Register = lazy(() => import('./components/Register/Register'));

function App() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    gameService.getAll().then((result) => {
      setGames(result);
      // console.log(result);
    });
  }, []);

  return (
    <AuthProvider>
      <div id="box">
        {/*Header*/}
        <Header />
        {/* Main Content */}
        <GameContext.Provider value={{ games, gameAdd, gameEdit }}>
          <main id="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/register"
                element={
                  <Suspense fallback={<span>Loading....</span>}>
                    <Register />
                  </Suspense>
                }
              />
              <Route path="/logout" element={<Logout />} />
              <Route path="/create" element={<CreateGame />} />
              <Route path="/games/:gameId/edit" element={<EditGame />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route
                path="/catalog/:gameId"
                element={<GameDetails games={games} addComment={addComment} />}
              />
            </Routes>
          </main>
        </GameContext.Provider>
      </div>
    </AuthProvider>
  );
}

export default App;
