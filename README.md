# Online Practice Test Platform

---

## Problem Statement

**Task 1: Online Practice Test Platform**

### Objective

Implement a login system (including Google OAuth) and a signup system that directs users to a personalized dashboard. This dashboard will start an online quiz with a personalized experience based on Computerized Adaptive Testing (CAT). The demonstration uses 20 MCQ questions in mathematics for students in classes 7th to 10th.

### Requirements

1. **User Authentication:**
   1. Implement a login system with email and password.
   2. Include Google OAuth for login.
   3. Provide a signup option.
2. **Dashboard:**
   1. Upon successful login, direct users to a personalized dashboard.
   2. The dashboard should allow users to start an online quiz.
3. **Quiz System:**
   1. The quiz should have 20 MCQ questions with varying initial weightages based on difficulty.
   2. Each question should have different tags (e.g., algebra, geometry) to classify the type of question.
   3. Implement Computerized Adaptive Testing (CAT) to adapt the difficulty of the quiz based on the user's performance.
4. **Result Evaluation and Reporting:**
   1. Upon submission of the quiz, generate a report evaluating the user's performance.
   2. Provide suggestions for further improvements.
5. **Technologies:**
   1. Use MERN stack (mandatory).
6. **Documentation:**
   1. Provide detailed documentation of your code and implementation process.
7. **Submission:**
   1. Host your project on GitHub and provide the repository link.

## Implementation

### User Authentication

I implemented a robust authentication system that includes:

1. **Email and Password Login:** Users can sign up and log in using their email and password.
2. **Google OAuth:** Users can also log in using their Google accounts for a seamless and secure authentication experience.

Auth0 provides a comprehensive solution that simplifies the integration of both email/password and Google login functionalities, ensuring secure and efficient user authentication.

### Dashboard

Upon successful authentication, users are redirected to a personalized dashboard that includes:

1. **Navbar:** Navigation options for the user to access different features of the application.
2. **Start Quiz Button:** Users can start the online quiz directly from the dashboard.

### Quiz System

The quiz system is designed with three difficulty levels: easy, medium, and hard. Each question has a specific point value based on its difficulty:

1. **Easy:** 2 points
2. **Medium:** 3 points
3. **Hard:** 4 points

### Question Structure

The questions are stored in JSON files, categorized by difficulty. Below is a sample structure of a question in the JSON file:

```json
[
  {
    "id": 1,
    "question": "-67 x (-1) = ?",
    "options": ["-1", "-67", "67", "1"],
    "correct_answer": "67",
    "difficulty": "easy",
    "tags": ["arithmetic"],
    "explanation": "Multiplying any number by -1 changes its sign. Here, -67 multiplied by -1 results in 67.",
    "references": ["<https://www.mathsisfun.com/numbers/multiplication.html>"]
  }
]
```

### Computerized Adaptive Testing (CAT)

The CAT system adapts the difficulty of the quiz based on the user's performance:

1. If the user answers an easy question correctly, the next question will be of medium difficulty. If they answer a medium question correctly, the next will be hard. If they answer a hard question correctly, the next will be another hard question.
2. Conversely, if the user answers a medium question incorrectly, the next question will be easy. If they answer a hard question incorrectly, the next will be medium.

This ensures that the quiz adjusts to the user's level, providing a balanced challenge.

### Result Evaluation and Reporting

Upon completing the quiz, a comprehensive report is generated that includes:

1. **Score:** The total points scored by the user.
2. **Correct Answers:** The number of correct answers out of the total questions answered.
3. **Pie Chart Visualization:** A pie chart showing the distribution of correct answers across different tags (e.g., algebra, geometry).

Additionally, the report provides a detailed review of all 20 questions submitted by the user:

1. **User's Answer and Correct Answer:** For each question, the user's answer and the correct answer are displayed.
2. **Explanations and References:** If the user's answer is incorrect, an explanation is provided along with additional reference URLs to help the user understand the concept of the particular question.
3. **Visual Highlighting:** Correctly answered questions are highlighted with a green border, making it easy for users to identify their correct responses at a glance.

This detailed report helps users understand their performance, identify areas for improvement, and offers resources to enhance their understanding of specific topics.

## Getting Started

### Prerequisites

Ensure you have the following installed:

1. Node.js

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MohammedVaraliya-2/Online_Practice_Test_Platform.git

   ```

   ```jsx
   cd Online_Practice_Test_Platform
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the application:**

   ```bash
   npm run dev
   ```

### Usage

1. Open your browser and navigate to the url provided by the server [`http://localhost:5173/`](http://localhost:5173/).
2. Sign up or log in using your email and password or Google account.
3. Start the quiz from the dashboard and answer the questions.
4. View the result report and analyze your performance.

The Online Practice Test Platform provides a comprehensive solution for personalized quiz experiences using CAT. The implementation includes robust authentication, adaptive testing, and detailed performance reporting. The project is well-documented and meets the specified requirements, providing a valuable tool for students to enhance their learning experience.
