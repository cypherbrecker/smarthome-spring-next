"use client";
import { useState } from "react";
import styles from "./help.module.css";

const Question = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={styles.questionContainer} onClick={onClick}>
      <div className={`${styles.question} ${isOpen ? styles.open : ""}`}>
        {question}
      </div>
      {isOpen && <div className={styles.answer}>{answer}</div>}
    </div>
  );
};

const Help = () => {
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestionIndex(openQuestionIndex === index ? null : index);
  };

  const questions = [
    {
      question: "Question 1: How can I create a room?",
      answer: "You can create a room inside the `Room Management` menu option.",
    },
    {
      question: "Question 2: How can I invite someone into my home?",
      answer:
        "Inside the `Team` menu point, below the user's table there is a plus icon, if you click on that you can invite members into your smart home if you type the name of your friend. ",
    },
    {
      question: "Question 3: How can I delete a specific room?",
      answer:
        "In the main menu you have to use your cursor on the room's name and there will be a pop trash icon, you just have to click on that.",
    },
  ];

  return (
    <div className={styles.helpContainer}>
      {questions.map((item, index) => (
        <Question
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openQuestionIndex === index}
          onClick={() => toggleQuestion(index)}
        />
      ))}
    </div>
  );
};

export default Help;
