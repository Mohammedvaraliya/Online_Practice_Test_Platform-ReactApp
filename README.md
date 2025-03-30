# **Online Practice Test Platform**

🚀 **Live Application:** [Online Practice Test Platform](https://online-practice-test-platform.netlify.app/)

---

## **Overview**

The **Online Practice Test Platform** is a web-based application designed to provide an adaptive and personalized quiz experience using **Computerized Adaptive Testing (CAT)**. The platform dynamically adjusts question difficulty based on user performance, ensuring an optimal learning experience.

This project is built using the **MERN stack (MongoDB, Express.js, React, Node.js)** and implements **Google Auth0 for authentication**. All quiz-related operations are handled via a well-structured **REST API** with a dedicated backend.

---

## **Features**

### **1. User Authentication**

✅ Secure authentication using **Google Auth0**.  
✅ Upon successful login, user details are stored in **MongoDB** for future interactions.

### **2. Personalized Dashboard**

✅ Upon authentication, users are redirected to a **dashboard** where they can:

- Start a quiz.
- View quiz history.

### **3. Quiz System with Adaptive Difficulty**

✅ The quiz consists of **10 multiple-choice questions (MCQs)**.  
✅ Uses **Computerized Adaptive Testing (CAT)** to adjust question difficulty dynamically based on the user's performance.  
✅ Questions are categorized into **easy, medium, and hard**, with different scoring weights:

- **Easy:** 2 points
- **Medium:** 3 points
- **Hard:** 4 points

### **4. Database & API Structure**

✅ **MongoDB** is used to store user authentication details and **quiz history**.  
✅ The backend features **separate API endpoints for each operation**, including:

- Fetching quiz questions.
- Storing quiz history.
- Retrieving past quiz results.

### **5. Result Evaluation & Reporting**

✅ At the end of the quiz, a **detailed report** is generated, displaying:

- Total **score**.
- Number of **correct answers**.
- A **pie chart visualization** of performance based on question categories.  
  ✅ The report includes **explanations and references** for incorrectly answered questions, helping users improve.

---

## **Technology Stack**

| Component             | Technology Used                |
| --------------------- | ------------------------------ |
| Frontend              | **React (Vite), Tailwind CSS** |
| Backend               | **Node.js, Express.js**        |
| Database              | **MongoDB (Atlas)**            |
| Authentication        | **Google Auth0**               |
| Deployment (Frontend) | **Netlify**                    |
| Deployment (Backend)  | **Render**                     |

---

## **Data Structure & Sample Question Format**

All quiz questions are stored in **JSON format** and categorized by difficulty level.

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
    "references": ["https://www.mathsisfun.com/numbers/multiplication.html"]
  }
]
```

---

## **Computerized Adaptive Testing (CAT) Logic**

📌 The quiz adapts based on the user's performance:

- ✅ **Correct Answer** → Next question is of **higher difficulty**.
- ❌ **Wrong Answer** → Next question is of **lower difficulty**.
- **Progression Path:**
  - Easy → Medium → Hard
  - Medium → Hard / Easy
  - Hard → Hard / Medium

This ensures that each user receives a **personalized and challenging quiz experience**.

---

## **Backend API Overview**

The backend is built using **Node.js & Express.js**, with **MongoDB** as the database. It includes **separate API endpoints for each operation** to ensure modularity and maintainability.

### **Key API Endpoints:**

| Method   | Endpoint                    | Description                         |
| -------- | --------------------------- | ----------------------------------- |
| **POST** | `/api/auth/login`           | Authenticate users via Google Auth0 |
| **POST** | `/api/quiz/start`           | Fetch quiz questions dynamically    |
| **POST** | `/api/quiz/save-history`    | Save user quiz history in MongoDB   |
| **GET**  | `/api/quiz/history/:userId` | Retrieve past quiz results          |

All API requests and responses are **JSON-based** and follow RESTful standards.

---

## **Result Evaluation & Reporting**

Upon quiz completion, a **detailed performance report** is generated, including:

📊 **Score Summary**  
✅ **Correct Answers Count**  
📌 **Explanations for incorrect answers**  
🔗 **Reference links for further learning**  
📈 **Pie Chart visualization**

This ensures users can review their answers and improve accordingly.

---

## **Deployment Details**

- 🌍 **Frontend:** Deployed on **Netlify** – [Online Practice Test Platform](https://online-practice-test-platform.netlify.app/)
- 🔥 **Backend:** Deployed on **Render**

---

## **Conclusion**

The **Online Practice Test Platform** is a powerful **adaptive testing system** that enhances the learning experience through **dynamic question difficulty adjustments** and **detailed result analysis**.

This project successfully integrates:  
✅ **MERN Stack** for efficient full-stack development.  
✅ **Google Auth0 Authentication** for secure login.  
✅ **MongoDB** for storing user data and quiz history.  
✅ **REST APIs** to maintain modular and scalable architecture.  
✅ **Adaptive Testing Algorithm** for personalized quizzes.

🔹 **Live Demo:** [Online Practice Test Platform](https://online-practice-test-platform.netlify.app/)

🚀 **Happy Learning!** 🎯

---
