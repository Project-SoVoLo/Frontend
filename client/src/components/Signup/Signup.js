import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

function Signup() {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirm: "",
    name: "",
    gender: "",
    nickname: "",
    birth: "",
    phone: "",
  });

  const [emailChecked, setEmailChecked] = useState(false);

  const checkEmailDuplicate = () => {
    const savedUser = sessionStorage.getItem("user");
    const savedEmail = savedUser ? JSON.parse(savedUser).email : null;
    if (formData.email === savedEmail) {
      alert("이미 존재하는 이메일입니다.");
      setEmailChecked(false);
    } else {
      alert("사용 가능한 이메일입니다.");
      setEmailChecked(true);

    }
  };

  const onChangeForm = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      checkEmailDuplicate(false);
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    const { email, password, password_confirm } = formData;

    if (!email) return alert("아이디를 입력해주세요 (이메일형식)");
    if (!emailChecked) return alert("아이디 중복 확인을 해주세요");
    if (!password) return alert("비밀번호를 입력해주세요");
    if (!password_confirm) return alert("비밀번호 확인을 입력해주세요");
    if (password !== password_confirm) return alert("입력한 비밀번호가 같지 않습니다.");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/register",
        {
          userEmail: formData.email,
          password: formData.password,
          userName: formData.name,
          nickname: formData.nickname,
          userBirth: parseInt(formData.birth),
          userGender: formData.gender,
          userPhone: formData.phone,
        }
      );

      const { token, nextStep, userEmail, role, expiresAt } = response.data;

      // JWT 토큰 저장
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userEmail", userEmail);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("expiresAt", expiresAt);

      alert("회원가입 성공하였습니다!");
      nav(nextStep || "/");
    } catch (error) {
      alert("회원가입 실패: " + (error.response?.data?.error || "알 수 없는 오류"));
      const nextStep = error.response?.data?.nextStep || "/signup";
      nav(nextStep);
    }
  };

  return (
    <div className="signup-container">
      <form className="form-submit" onSubmit={onSubmitForm}>
        <div className="input-box">
          <input
            className="email"
            name="email"
            type="text"
            placeholder="이메일"
            onChange={onChangeForm}
          />
          <button type="button" className="emailChecked" onClick={checkEmailDuplicate}>
            중복확인
          </button>
        </div>
        <div className="input-box">
          <input
            className="password"
            name="password"
            type="password"
            placeholder="비밀번호"
            onChange={onChangeForm}
          />
        </div>
        <div className="input-box">
          <input
            className="password_confirm"
            name="password_confirm"
            type="password"
            placeholder="비밀번호확인"
            onChange={onChangeForm}
          />
        </div>
        <div className="input-box">
          <input
            type="text"
            name="name"
            placeholder="이름"
            onChange={onChangeForm}
          />
        </div>
        <div className="input-box">
          <input
            type="text"
            name="nickname"
            placeholder="닉네임"
            onChange={onChangeForm}
          />
        </div>
        <div className="input-box">
          <input
            type="text"
            name="birth"
            placeholder="생년월일 8자리 (예: 19991231)"
            onChange={onChangeForm}
          />
        </div>
        <div className="input-box">
          <input
            type="text"
            name="phone"
            placeholder="휴대전화번호"
            onChange={onChangeForm}
          />
        </div>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="gender"
              value="M"
              checked={formData.gender === "M"}
              onChange={onChangeForm}
            />
            남자
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="F"
              checked={formData.gender === "F"}
              onChange={onChangeForm}
            />
            여자
          </label>
        </div>
        <div className="submit-button">
          <button id="register" type="submit">회원가입</button>
        </div>
      </form>
    </div>
  );
}

export default Signup;