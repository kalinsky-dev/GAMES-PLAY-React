import { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import uniqid from 'uniqid';

import * as gameService from './services/gameService';
import { AuthContext } from './contexts/AuthContext';

import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Logout from './components/Logout/Logout';
import CreateGame from './components/CreateGame/GreateGame';
import Catalog from './components/Catalog/Catalog';
import GameDetails from './components/GameDetails/GameDetails';
import './App.css';

const Register = lazy(() => import('./components/Register/Register'));

function App() {
  const [games, setGames] = useState([]);
  const [auth, setAuth] = useState({});
  const navigate = useNavigate();

  const userLogin = (authData) => {
    setAuth(authData);
  };

  const userLogout = () => {
    setAuth({});
  };

  const addComment = (gameId, comment) => {
    setGames((state) => {
      const game = state.find((x) => x._id === gameId);

      const comments = game.comments || [];
      comments.push(comment);

      return [...state.filter((x) => x._id !== gameId), { ...game, comments }];
    });
  };

  const addGameHandler = (gameData) => {
    setGames((state) => [
      ...state,
      {
        ...gameData,
        _id: uniqid(),
      },
    ]);

    navigate('/catalog');
  };

  useEffect(() => {
    gameService.getAll().then((result) => {
      setGames(result);
      console.log(result);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user: auth, userLogin, userLogout }}>
      <div className="App">
        <div id="box">
          {/*Header*/}
          <Header />
          {/* Main Content */}
          <main id="main-content">
            <Routes>
              <Route path="/" element={<Home games={games} />} />
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
              <Route
                path="/create"
                element={<CreateGame addGameHandler={addGameHandler} />}
              />
              <Route path="/catalog" element={<Catalog games={games} />} />
              <Route
                path="/catalog/:gameId"
                element={<GameDetails games={games} addComment={addComment} />}
              />
            </Routes>
          </main>

          {/* Edit Page ( Only for the creator )*/}
          {/* <section id="edit-page" className="auth">
          <form id="edit">
            <div className="container">
              <h1>Edit Game</h1>
              <label htmlFor="leg-title">Legendary title:</label>
              <input type="text" id="title" name="title" defaultValue="" />
              <label htmlFor="category">Category:</label>
              <input type="text" id="category" name="category" defaultValue="" />
              <label htmlFor="levels">MaxLevel:</label>
              <input
                type="number"
                id="maxLevel"
                name="maxLevel"
                min={1}
                defaultValue=""
              />
              <label htmlFor="game-img">Image:</label>
              <input type="text" id="imageUrl" name="imageUrl" defaultValue="" />
              <label htmlFor="summary">Summary:</label>
              <textarea name="summary" id="summary" defaultValue={""} />
              <input className="btn submit" type="submit" defaultValue="Edit Game" />
            </div>
          </form>
        </section> */}
        </div>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
