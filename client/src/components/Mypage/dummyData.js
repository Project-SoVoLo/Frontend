export const dummyCounselings = Array.from({ length: 37 }, (_, i) => ({
  id: i + 1,
  title: `상담 제목 ${i + 1}`,
  date: `2024-01-${(i + 1).toString().padStart(2, '0')}`,
  content: `이것은 상담 ${i + 1}의 내용입니다.`,
}));

export const dummySelfTests = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  title: `자가진단 ${i + 1}`,
  date: `2024-02-${(i + 1).toString().padStart(2, '0')}`,
  content: `자가진단 ${i + 1}의 세부내용입니다.`,
}));

export const moodData = [
  { date: '2025-05-24', score: 0.11 },
  { date: '2025-05-25', score: -0.47 },
  { date: '2025-05-26', score: -0.92 },
  { date: '2025-05-27', score: -0.24 },
  { date: '2025-05-28', score: -0.31 },
  { date: '2025-05-20', score: -0.65 },
  { date: '2025-05-21', score: -0.12 },
  { date: '2025-05-22', score: 0.38 },
  { date: '2025-05-23', score: 0.76 },
  { date: '2025-05-29', score: 0.58 },
];