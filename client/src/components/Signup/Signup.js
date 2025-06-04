import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";


function Signup() {
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    password_confirm: "",
    name: "",
    gender: "",
    nickname: "",
    birth: "",
    phone: "",
    email: "",
  });

  const [idChecked, setIdChecked] = useState(false);
  const checkIdDuplicate = () => {
    const savedUser = sessionStorage.getItem("user");
    const savedId = savedUser ? JSON.parse(savedUser).id : null;
    if (formData.id === savedId) {
      alert("이미 존재하는 아이디입니다.");
    } else {
      alert("사용 가능한 아이디입니다.");
      setIdChecked(true);
    }
  };
  const onChangeForm = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "gender") {
      setFormData({ ...formData, [name]: value }); // 하나만 선택 가능
    } else {
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    }

    // 아이디 변경되면 다시 체크해야 함
    if (name === "id") {
      setIdChecked(false);
    }
  };

  const onSubmitForm = (e) => {
    e.preventDefault();

    const { id, password, password_check } = formData;

    if (!id) return alert("아이디를 입력해주세요");
    if (!idChecked) return alert("아이디 중복 확인을 해주세요");
    if (!password) return alert("비밀번호를 입력해주세요");
    if (!password_check) return alert("비밀번호 확인을 입력해주세요");
    if (password !== password_check) return alert("입력한 비밀번호가 같지 않습니다.");

    sessionStorage.setItem("user", JSON.stringify(formData));
    alert("회원가입 성공하였습니다!");
    nav("/login");
  };
  return (
    <div className="signup-container">
      <form className="form-submit" onSubmit={onSubmitForm}>
        <div className="input-box">
          <i className="icon user" />
          <input
            className="id"
            type="text"
            placeholder="아이디"
            onChange={onChangeForm} />
          <button type="button" className="idChecked" onClick={checkIdDuplicate} >
            중복확인
          </button>
        </div>
        <div className="input-box">
          <i className="icon lock" />
          <input
            className="password"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            onSubmit={onChangeForm}
          />
          <i
            className={`icon eye ${showPassword ? "" : "closed"}`}
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
        <div className="input-box">
          <i className="icon lock" />
          <input
          type="password"
            className="password_check"
            placeholder="비밀번호확인"
            onSubmit={onChangeForm}
          />
        </div>
        <div className="input-box">
          <i className="icon email" />
          <input

            type="email"
            placeholder="이메일주소"
            onSubmit={onChangeForm} />
        </div>
        <div className="input-box">
          <i className="icon user" />
          <input
            type="text"
            placeholder="이름"
            onSubmit={onChangeForm}
          />
        </div>
        <div className="input-box">
          <i className="icon user" />
          <input
            type="text"
            placeholder="닉네임"
            onSubmit={onChangeForm}
          />
        </div>
        <div className="input-box">
          <i className="icon calendar" />
          <input
            type="text"
            placeholder="생년월일 8자리"
            onSubmit={onChangeForm}
          />
        </div>
        <div className="select-box">
          <i className="icon antenna" />
          <select>
            <option>통신사 선택</option>
            <option>SKT</option>
            <option>KT</option>
            <option>LG U+</option>
          </select>
        </div>
        <div className="input-box">
          <i className="icon phone" />
          <input
            type="text"
            placeholder="휴대전화번호"
            onSubmit={onChangeForm}
          />
        </div>
        <div className="radio-group">
          <label><input type="radio" name="gender" /> 남자</label>
          <label><input type="radio" name="gender" /> 여자</label>
          <label><input type="radio" name="nationality" /> 내국인</label>
          <label><input type="radio" name="nationality" /> 외국인</label>
        </div>
        <div className="submit-button">
          <button type="submit">회원가입</button>
        </div>
      </form>
    </div>
  );
}

export default Signup;