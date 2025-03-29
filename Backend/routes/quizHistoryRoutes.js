const express = require("express");
const QuizHistory = require("../models/QuizHistory");
const User = require("../models/User");

const router = express.Router();

// Fetch all saved quiz histories
router.get("/histories", async (req, res) => {
  try {
    const histories = await QuizHistory.find().populate(
      "userId",
      "auth0Id email"
    ); // Populate user details
    res.status(200).json(histories);
  } catch (err) {
    console.error("❌ Error fetching all quiz histories:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/save-history", async (req, res) => {
  try {
    const { auth0Id, score, correctAnswers, totalQuestions, questions } =
      req.body;

    // Validate input
    if (!auth0Id || !questions || questions.length === 0) {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    // Find user
    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compute difficulty breakdown
    const difficultyBreakdown = { easy: 0, medium: 0, hard: 0 };
    const tagAnalysis = {};

    questions.forEach(({ difficulty, tags, userAnswer, correct_answer }) => {
      if (difficulty) difficultyBreakdown[difficulty]++;

      (tags || []).forEach((tag) => {
        if (!tagAnalysis[tag]) tagAnalysis[tag] = { correct: 0, total: 0 };
        tagAnalysis[tag].total += 1;
        if (userAnswer === correct_answer) {
          tagAnalysis[tag].correct += 1;
        }
      });
    });

    // Create new quiz history entry
    const quizHistory = new QuizHistory({
      userId: user._id,
      auth0Id,
      score,
      correctAnswers,
      totalQuestions,
      difficultyBreakdown,
      tagAnalysis,
      questions: questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options, // ✅ Include options
        userAnswer: q.userAnswer || null,
        correct_answer: q.correct_answer || "N/A",
        difficulty: q.difficulty || "unknown",
        explanation: q.explanation || "No explanation available",
        references: q.references || [],
        tags: q.tags || [],
        userScore: q.userScore || 0, // ✅ Include userScore
      })),
    });

    await quizHistory.save();
    res
      .status(201)
      .json({ message: "Quiz history saved successfully!", quizHistory });
  } catch (err) {
    console.error("❌ Error saving quiz history:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Fetch all quiz history for a user using auth0Id
router.get("/user-histories/:auth0Id", async (req, res) => {
  try {
    const history = await QuizHistory.find()
      .populate("userId", "auth0Id email")
      .then((histories) =>
        histories.filter((h) => h.userId.auth0Id === req.params.auth0Id)
      );

    if (!history || history.length === 0) {
      return res
        .status(404)
        .json({ message: "No quiz history found for this user" });
    }

    res.status(200).json(history);
  } catch (err) {
    console.error("❌ Error fetching quiz history:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Fetch specific quiz history using historyId
router.get("/user-history/:historyId", async (req, res) => {
  try {
    const history = await QuizHistory.findById(req.params.historyId).populate(
      "userId",
      "auth0Id email"
    );

    if (!history) {
      return res.status(404).json({ message: "Quiz history not found" });
    }

    res.status(200).json(history);
  } catch (err) {
    console.error("❌ Error fetching specific quiz history:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
