import React, { useState } from 'react';
import "./Diagnosis.css";

const questions = [
  '1. 매사에 흥미나 즐거움이 거의 없다.',
  '2. 기분이 가라앉거나 우울하거나 희망이 없다고 느낀다.',
  '3. 잠들기 어렵거나 자주 깬다. 혹은 잠을 너무 많이 잔다.',
  '4. 피곤하다고 느끼거나 기운이 거의 없다.',
  '5. 식욕이 줄었다. 혹은 너무 많이 먹는다.',
  '6. 내 자신이 실패자로 여겨지거나 자신과 가족을 실망시켰다고 느낀다.',
  '7. 신문을 읽거나 TV를 보는 것과 같은 일상적인 일에 집중하기 어렵다.',
    [
    '8. 다른 사람들이 눈치 챌 정도로 평소보다 말과 행동이 느리다.',
    '\u00A0\u00A0\u00A0\u00A0혹은 너무 안절부절 못해서 가만히 앉아 있을 수 없다.'
    ],
  '9. 차라리 죽는 것이 낫겠다고 생각하거나, 어떻게든 자해를 하려고 생각한다.',
];

const options = [
  '전혀 아니다',
  '아니다',
  '보통이다',
  '그렇다',
  '매우 그렇다'
];

function Diagnosis() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('검사가 제출되었습니다.');
  };

  return (
    <div className="diagnosis-container">
      <h2 className="diagnosis-title">자가진단 검사</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div className="diagnosis-question-block" key={index}>
            <div className="diagnosis-question">
              {Array.isArray(question)
                ? question.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i !== question.length - 1 && <br />}
                    </React.Fragment>
                  ))
                : question}
            </div>
            <div className="diagnosis-options">
              {options.map((option, i) => (
                <label className="diagnosis-radio" key={i}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={() => handleChange(index, option)}
                    required
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button className="diagnosis-submit-btn" type="submit">
          제출
        </button>
      </form>
    </div>
  );
}

export default Diagnosis;
