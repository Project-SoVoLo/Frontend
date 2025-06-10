import React, { useState, useEffect } from "react";
import styles from './Diagnosis.module.css';
import axios from "../../api/axios";

const typeMeta = {
  DEPRESSION: { label: "우울", description: "우울감, 무기력 등" },
  ANXIETY: { label: "불안", description: "불안, 초조 등" },
  EARLY_PSYCHOSIS: { label: "조기정신증", description: "정신증 초기 증상" },
  BIPOLAR: { label: "조울증", description: "조울증 관련" },
  STRESS: { label: "스트레스", description: "스트레스 관련" },
  INSOMNIA: { label: "불면", description: "수면 장애" },
  ALCOHOL: { label: "알코올중독", description: "알코올 사용 문제" },
  DEVICE_ADDICTION: { label: "스마트기기 중독", description: "디지털 기기 사용" },
};

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

  const token = localStorage.getItem('token');

  useEffect(() => {
  axios.get("http://localhost:8080/api/diagnosis/types", {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => {
      const data = res.data;
      const mapped = data.map(type => ({
        key: type,
        label: typeMeta[type]?.label || type,
        description: typeMeta[type]?.description || "",
      }));
      setTests(mapped);
      if (mapped.length > 0) setSelectedTest(mapped[0].key);
    })
    .catch(err => {
      alert("진단 유형 목록을 불러오지 못했습니다.");
    });
}, []);


useEffect(() => {
  if (!selectedTest) return;
  setLoading(true);
  axios.get(`http://localhost:8080/api/diagnosis/questions?type=${selectedTest}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => {
      const data = res.data;
      setQuestions(data);
      setAnswers(Array(data.length).fill(null));
      setLoading(false);
    })
    .catch(err => {
      alert("문항을 불러오지 못했습니다.");
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
    // 결과 제출 API 연동 필요!! 나중 수정 !!
    alert("자가진단이 제출되었습니다.");
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
                        <li className={styles.postItem} key={q.questionId}>
                          <div className={styles.postTitle}>{q.content}</div>
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
