// LOGIC FOR CREATING QUIZ/QUESTIONS

import { pool } from '../models/db.js';

// ✅ Create a quiz (Only Teacher) - TEMPORARY: Auth disabled for deployment
export const createQuiz = async (req, res) => {
  const { title, description, time_limit } = req.body;
  const user = req.session.user;

  // TEMPORARY: Use default user ID 1 if session doesn't work
  const userId = user?.id || 1;

  // if (!user || user.role !== 'faculty') {
  //   return res.status(403).json({ msg: "Only teachers can create quizzes" });
  // }

  try {
    const [result] = await pool.query(
      'INSERT INTO quizzes (title, description, time_limit, created_by) VALUES (?, ?, ?, ?)',
      [title, description, time_limit, userId]
    );
    res.status(201).json({ msg: "Quiz created", quiz_id: result.insertId });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Add question to a quiz (Only Teacher) - TEMPORARY: Auth disabled
export const addQuestion = async (req, res) => {
  const { quiz_id, question, option_a, option_b, option_c, option_d, correct_option } = req.body;
  const user = req.session.user;

  // if (!user || user.role !== 'faculty') {
  //   return res.status(403).json({ msg: "Only teachers can add questions" });
  // }

  try {
    await pool.query(
      `INSERT INTO questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_option)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [quiz_id, question, option_a, option_b, option_c, option_d, correct_option]
    );
    res.status(201).json({ msg: "Question added" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


export const getAllQuizzes = async (req, res) => {
  try {
    const [quizzes] = await pool.query('SELECT id, title, description, time_limit FROM quizzes');
    res.json({ quizzes });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching quizzes', error: err.message });
  }
};

export const getQuizQuestions = async (req, res) => {
  const quizId = req.params.quizId;
  try {
    const [questions] = await pool.query(
      'SELECT id, question, option_a, option_b, option_c, option_d FROM questions WHERE quiz_id = ?',
      [quizId]
    );
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching questions', error: err.message });
  }
};

export const submitQuiz = async (req, res) => {
  const { quiz_id, answers } = req.body;
  const user = req.session.user;

  // TEMPORARY: Use default student ID 2 if session doesn't work
  const userId = user?.id || 2;
  
  // if (!user || user.role !== 'student') {
  //   return res.status(403).json({ msg: "Only students can submit quizzes" });
  // }

  try {
    const [questions] = await pool.query(
      'SELECT id, correct_option FROM questions WHERE quiz_id = ?',
      [quiz_id]
    );

    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] && answers[q.id] === q.correct_option) {
        score++;
      }
    });

    await pool.query(
      'INSERT INTO submissions (student_id, quiz_id, score) VALUES (?, ?, ?)',
      [userId, quiz_id, score]
    );

    res.json({ msg: "Quiz submitted", score });
  } catch (err) {
    res.status(500).json({ msg: 'Error submitting quiz', error: err.message });
  }
};


export const getLeaderboard = async (req, res) => {
  const quizId = req.params.quizId;
  try {
    const [rows] = await pool.query(
      `SELECT u.name, s.score, s.submitted_at
       FROM submissions s
       JOIN users u ON s.student_id = u.id
       WHERE s.quiz_id = ?
       ORDER BY s.score DESC, s.submitted_at ASC
       LIMIT 10`,
      [quizId]
    );
    res.json({ leaderboard: rows });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching leaderboard', error: err.message });
  }
};
