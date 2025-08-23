import React, { useState, useEffect, useCallback } from "react";
import styles from "./Community.module.css";

import cn1 from "../../Images/cardnews/cn1.png";
import cn2 from "../../Images/cardnews/cn2.png";
import cn3 from "../../Images/cardnews/cn3.png";
import cn4 from "../../Images/cardnews/cn4.png";
import cn5 from "../../Images/cardnews/cn5.png";
import cn6 from "../../Images/cardnews/cn6.png";

const items = [
  {
    title: "기록의 중요성",
    date: "2025.04.15",
    desc: "매일의 감정을 기록하세요. 정신건강을 관리하는 첫 걸음입니다!",
    img: cn1,
    content: [
      "하루 3줄만 적어도 스트레스 인식 능력이 향상돼요.",
      "감정·사건·신체반응(예: 심장 두근거림)을 함께 적으면 트리거 파악이 쉬워집니다.",
      "주 1회 ‘돌아보기’로 무엇이 도움 됐는지 체크하면 자기조절감이 커집니다.",
      "툴 팁: 날짜/기분(1~5)/한 줄 요약 포맷으로 시작하면 오래 갑니다."
    ]
  },
  {
    title: "사회적 연결과 행복",
    date: "2025.04.10",
    desc: "사회적 관계가 우리의 행복과 정신 건강에 미치는 영향에 대해 알아보세요.",
    img: cn2,
    content: [
      "짧은 대화라도 고립감을 낮추고 회복탄력성을 높여요.",
      "‘정기적 연결 루틴’(주 1회 전화, 월 1회 만남)을 달력에 고정하세요.",
      "관계의 질이 중요합니다. 소진되는 관계는 빈도를 줄이고 지지적 관계를 늘리세요.",
      "감사 메시지 1통이 우울·불안 완화에 유의미한 효과가 있다는 연구가 많습니다."
    ]
  },
  {
    title: "마음을 위한 운동",
    date: "2025.04.05",
    desc: "운동이 마음 건강에 미치는 긍정적인 영향에 대해 알아보세요.",
    img: cn3,
    content: [
      "주 3회 20~30분의 가벼운 유산소만으로도 기분이 개선돼요.",
      "‘너무 바쁘면 5분’ 규칙: 5분만 걸어도 시작 장벽이 낮아집니다.",
      "햇빛 노출+걷기 조합은 수면 리듬 안정에 도움을 줍니다.",
      "체크리스트: 운동 전/후 기분 점수 기록 → 동기 유지에 큰 도움."
    ]
  },
  {
    title: "휴가와 정신건강",
    date: "2025.04.03",
    desc: "휴가가 정신 건강에 미치는 긍정적인 영향에 대해 알아보세요. 자주 쉬어가며 스트레스를 줄이세요.",
    img: cn4,
    content: [
      "짧은 마이크로바케이션(반나절~1일)도 번아웃 예방에 효과적입니다.",
      "‘완전 오프’ 구간(알림 off, 업무앱 로그아웃)을 명확히 만드세요.",
      "휴식 계획에는 ‘회복 활동(자연, 수면, 가벼운 운동)’을 포함시키세요.",
      "복귀 전날 30분 정리 루틴을 두면 복귀 스트레스가 줄어듭니다."
    ]
  },
  {
    title: "수면과 감정 균형",
    date: "2025.03.30",
    desc: "잠을 충분히 자는 것이 감정 균형에 미치는 영향을 알아보세요.",
    img: cn5,
    content: [
      "취침·기상 시간 고정이 최우선(주말 포함 ±1시간 이내).",
      "취침 2시간 전 스크린 타임 줄이고, 카페인은 오후 2시 이후 피하세요.",
      "‘걱정 리스트’는 잠자리 전에 종이에 적고, 침대에서는 오직 수면/휴식만.",
      "기상 직후 햇빛 노출 10분은 강력한 생체시계 리셋 방법입니다."
    ]
  },
  {
    title: "자가진단",
    date: "2025.03.27",
    desc: "우울증 자가진단을 통해 자신의 마음 상태를 평가해보세요. 초기 증상을 놓치지 마세요.",
    img: cn6,
    content: [
      "2주 이상 지속된 우울감/흥미저하/수면변화가 있다면 평가가 필요합니다.",
      "자가진단은 ‘출발점’일 뿐, 결과가 높으면 전문가 상담을 검토하세요.",
      "위험 신호(자해 생각, 극단적 계획)는 즉시 주변에 알리고 도움을 요청하세요.",
      "기록→상담→생활습관 조정의 3단계 루프로 회복경로를 만드세요."
    ]
  }
];

export default function CardNews() {
  const [activeIdx, setActiveIdx] = useState(null);

  const handleKey = useCallback((e) => {
    if (activeIdx === null) return;
    if (e.key === "Escape") setActiveIdx(null);
    if (e.key === "ArrowRight") setActiveIdx((i) => (i + 1) % items.length);
    if (e.key === "ArrowLeft") setActiveIdx((i) => (i - 1 + items.length) % items.length);
  }, [activeIdx]);

  useEffect(() => {
    if (activeIdx !== null) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleKey);
        document.body.style.overflow = "";
      };
    }
  }, [activeIdx, handleKey]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {items.map((it, i) => (
          <article
            key={i}
            className={styles.card}
            onClick={() => setActiveIdx(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setActiveIdx(i)}
            aria-label={`${it.title} 상세 보기`}
          >
            <div className={styles.thumbWrap}>
              <img className={styles.thumb} src={it.img} alt={it.title} loading="lazy" />
            </div>
            <div className={styles.body}>
              <div className={styles.metaRow}>
                <h3 className={styles.title}>{it.title}</h3>
                <time className={styles.date}>{it.date}</time>
              </div>
              <p className={styles.desc}>{it.desc}</p>
            </div>
          </article>
        ))}
      </div>

      {/* 상세 모달 */}
      {activeIdx !== null && (
  <div className={styles.modalBackdrop} onClick={() => setActiveIdx(null)}>
    <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
      <button className={styles.closeBtn} onClick={() => setActiveIdx(null)} aria-label="닫기">×</button>

      <img className={styles.modalImg} src={items[activeIdx].img} alt={items[activeIdx].title} />

      {/* 상세 내용 영역 */}
      <div className={styles.modalBody}>
        <h3 className={styles.modalTitle}>{items[activeIdx].title}</h3>
        <time className={styles.modalDate}>{items[activeIdx].date}</time>
        <ul className={styles.modalList}>
          {items[activeIdx].content.map((line, idx) => (
            <li key={idx}>{line}</li>
          ))}
        </ul>

        {/* ✅ 상세 영역 하단 좌우 네비게이션 */}
        <div className={styles.modalFooter}>
          <button
            className={`${styles.navBtn} ${styles.prevBtn}`}
            onClick={() => setActiveIdx((i) => (i - 1 + items.length) % items.length)}
          >
            ← 이전
          </button>
          <button
            className={`${styles.navBtn} ${styles.nextBtn}`}
            onClick={() => setActiveIdx((i) => (i + 1) % items.length)}
          >
            다음 →
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
