import React, { useState, useEffect } from "react";
import styles from './Diagnosis.module.css';

const choices = [
  { value: 1, label: "전혀 아니다" },
  { value: 2, label: "아니다" },
  { value: 3, label: "보통이다" },
  { value: 4, label: "그렇다" },
  { value: 5, label: "그렇지 않다" },
];

function Diagnosis() {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/diagnosis/types")
      .then(res => res.json())
      .then(data => {
        setTests(data);
        if (data.length > 0) setSelectedTest(data[0].key);
      });
  }, []);

  useEffect(() => {
    if (!selectedTest) return;
    setLoading(true);
    fetch(`http://localhost:8080/api/diagnosis/questions?type=${selectedTest}`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setAnswers(Array(data.length).fill(null));
        setLoading(false);
      });
  }, [selectedTest]);

  const handleAnswerChange = (questionIdx, value) => {
    setAnswers(prev =>
      prev.map((ans, idx) => (idx === questionIdx ? value : ans))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answers.some(ans => ans === null)) {
      alert("모든 문항에 답변해 주세요.");
      return;
    }
    // 결과 처리 로직 추가해야 함. API 연결 필요. 어디로 보낼것인가.
    alert("자가진단이 제출되었습니다.\n(실제 결과 계산 및 안내는 추가 구현 필요)");
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.sidebar}>
          <div className={styles.buttonContainer}>
            {tests.map((test) => (
              <button
                key={test.key}
                className={`${styles.categoryBtn} ${selectedTest === test.key ? styles.categoryBtnActive : ""}`}
                onClick={() => setSelectedTest(test.key)}
              >
                <h3>{test.label}</h3>
                <p>{test.description}</p>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={`${styles.content} ${styles.contentActive}`}>
            {selectedTest && (
              <>
                <h2>
                  {tests.find(t => t.key === selectedTest)?.label} 자가진단
                </h2>
                <p className={styles.contentDescription}>
                  {tests.find(t => t.key === selectedTest)?.description} 관련 자가진단 문항입니다.
                </p>
                {loading ? (
                  <div>로딩 중...</div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <ul className={styles.postList}>
                      {questions.map((q, idx) => (
                        <li className={styles.postItem} key={idx}>
                          <div className={styles.postTitle}>{q}</div>
                          <div style={{ marginTop: "10px", marginBottom: "15px" }}>
                            {choices.map(choice => (
                              <label key={choice.value} style={{ marginRight: "15px" }}>
                                <input
                                  type="radio"
                                  name={`question_${idx}`}
                                  value={choice.value}
                                  checked={answers[idx] === choice.value}
                                  onChange={() => handleAnswerChange(idx, choice.value)}
                                />
                                {choice.label}
                              </label>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="submit"
                      className={styles.actionBtn}
                      style={{ marginTop: "20px" }}
                    >
                      제출
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Diagnosis;
