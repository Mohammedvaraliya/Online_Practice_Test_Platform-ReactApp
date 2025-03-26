const mongoose = require("mongoose");

const quizHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  auth0Id: { type: String, required: true },
  score: Number,
  correctAnswers: Number,
  totalQuestions: Number,
  difficultyBreakdown: {
    easy: Number,
    medium: Number,
    hard: Number,
  },
  tagAnalysis: Object,
  date: { type: Date, default: Date.now },
  questions: [
    {
      id: Number,
      question: String,
      options: [String],
      userAnswer: String,
      correct_answer: String,
      difficulty: String,
      explanation: String,
      references: [String],
      tags: [String],
      userScore: Number,
    },
  ],
});

module.exports = mongoose.model("QuizHistory", quizHistorySchema);
