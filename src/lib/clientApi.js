

import axios from "axios";

const clientApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default clientApi;



// Route::get('/',function(){
//   return response()->json([
//       "message"=>"Hello from api"
//   ]);
// });
// // Auth routes
// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/login', [AuthController::class, 'login']);

// // Protected routes
// Route::middleware('jwt')->group(function () {
//   // Auth
//   Route::get('/user', [AuthController::class, 'getUser']);
//   Route::post('/logout', [AuthController::class, 'logout']);
//   Route::put('/user', [AuthController::class, 'updateUser']);

//   // Tournaments
//   Route::apiResource('tournaments', TournamentController::class);
//   Route::post('tournaments/{tournament}/players', [TournamentController::class, 'addPlayer']);
//   Route::get('tournaments/{tournament}/players', [TournamentController::class, 'getPlayers']);
//   Route::delete('tournaments/{tournament}/players/{player}', [TournamentController::class, 'removePlayer']);

//   // Matches
//   Route::apiResource('matches', MatchController::class);
//   Route::post('matches/{match}/scores', [MatchController::class, 'updateScore']);
