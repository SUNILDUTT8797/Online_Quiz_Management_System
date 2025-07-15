// API ENDPOINTS.

import express from 'express';
import {
  createQuiz,
  addQuestion,
  getAllQuizzes,
  getQuizQuestions,
  submitQuiz,
  getLeaderboard
} from '../controllers/quizController.js';


const router = express.Router();

router.get('/:quizId/leaderboard', getLeaderboard);
router.get('/:quizId/questions', getQuizQuestions);

router.post('/create', createQuiz);
router.post('/add-question', addQuestion);

router.get('/all', getAllQuizzes);
router.post('/submit', submitQuiz);



export default router;
