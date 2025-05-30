document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".sidebar li");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      contents.forEach(content => content.classList.remove("active"));
      const selected = document.getElementById(tab.dataset.tab);
      selected.classList.add("active");

      switch (tab.dataset.tab) {
        case "counseling":
          loadCounselingList();
          break;
        case "selftest":
          renderPaginatedList(dummySelfTests, "selftest", "자가진단 내역이 없습니다.");
          break;
        case "emotion":
          loadEmotionGraph();
          break;
        case "editprofile":
          loadProfileForm();
          break;
      }
    });
  });

  // 상담내역 리스트 & 상세 페이지 전환
  function loadCounselingList() {
    // fetch("/api/counseling") 대신 임시 데이터 사용
    renderPaginatedList(dummyCounselings, "counseling", "상담기록이 없습니다.");
  }

  function renderPaginatedList(data, containerId, emptyMessage, itemsPerPage = 15) {
    const container = document.getElementById(containerId);
    const listContainer = document.createElement("div");
    listContainer.className = "list-container";

    const pagination = document.createElement("div");
    pagination.className = "pagination";

    if (data.length === 0) {
      container.innerHTML = `<p>${emptyMessage}</p>`;
      return;
    }

    let currentPage = 1;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    function renderPage(page) {
      currentPage = page;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pageData = data.slice(start, end);

      listContainer.innerHTML = `
        <table>
          <tr><th>제목</th><th>날짜</th></tr>
          ${pageData.map(d => `<tr class="clickable-row" data-id="${d.id}"><td>${d.title}</td><td>${d.date}</td></tr>`).join('')}
        </table>
      `;

      // 상담내용보기
      listContainer.querySelectorAll(".clickable-row").forEach(row => {
        row.addEventListener("click", () => {
          const id = row.dataset.id;
          const item = data.find(d => d.id == id);
          renderDetail(containerId, item);
        });
      });

      // 페이지네이션
      pagination.innerHTML = "";
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === page) btn.classList.add("active");
        btn.addEventListener("click", () => renderPage(i));
        pagination.appendChild(btn);
      }
    }

    container.innerHTML = "";
    container.appendChild(listContainer);
    container.appendChild(pagination);
    renderPage(1);
  }

  // 상담내용
  function renderDetail(containerId, item) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
      <h3>${item.title}</h3>
      <p><strong>날짜:</strong> ${item.date}</p>
      <p><strong>내용:</strong><br>${item.content}</p>
      <button class="back-button">← 목록으로</button>
    `;
    container.querySelector(".back-button").addEventListener("click", () => {
      renderPaginatedList(dummyCounselings, containerId, "상담기록이 없습니다.");
    });
  }

  // 감정 그래프
  // const graph_url = '/api/emotion-graph'
  // function loadEmotionGraph() {
  //   const container = document.getElementById('emotion');
  //   fetch(graph_url)
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data.length === 0) {
  //         container.innerHTML = `<p>감정 기록이 없습니다.</p>`;
  //         return;
  //       }

  //       container.innerHTML = `<canvas id="emotionChart" width="600" height="300"></canvas>`;
  //       const ctx = document.getElementById('emotionChart').getContext('2d');
  //       new Chart(ctx, {
  //         type: 'line',
  //         data: {
  //           labels: data.map(d => d.date),
  //           datasets: [{
  //             label: '감정 점수',
  //             data: data.map(d => d.score),
  //             borderColor: 'blue',
  //             backgroundColor: 'rgba(0, 0, 255, 0.1)',
  //             fill: true
  //           }]
  //         },
  //         options: {
  //           responsive: true,
  //           scales: {
  //             y: {
  //               beginAtZero: true,
  //               max: 100
  //             }
  //           }
  //         }
  //       });
  //     })
  //     .catch(() => {
  //       container.innerHTML = `<p>감정 그래프를 불러오는 중 오류가 발생했습니다.</p>`;
  //     });
  // }
  function loadEmotionGraph() {
  const container = document.getElementById('emotion');

  // 여기에서 moodData를 직접 사용
  const data = moodData;

  if (data.length === 0) {
    container.innerHTML = `<p>감정 기록이 없습니다.</p>`;
    return;
  }

  container.innerHTML = `<canvas id="emotionChart" width="600" height="300"></canvas>`;
  const ctx = document.getElementById('emotionChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.date),
      datasets: [{
        label: '감정 점수',
        data: data.map(d => d.score),
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          max: 1
        }
      }
    }
  });
}


  // 개인정보  
    function loadProfileForm() {
      const container = document.getElementById("editprofile");

      container.innerHTML = `
      <form id="profileForm">
        <div class="form-group">
          <label for="name">이름</label>
          <input type="text" id="name" name="name" />
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" name="password" />
        </div>
        <div class="form-group">
          <label for="phone">전화번호</label>
          <input type="text" id="phone" name="phone" />
        </div>
        <div class="form-group">
          <label for="email">이메일</label>
          <input type="email" id="email" name="email" />
        </div>
        <button type="submit">변경</button>
      </form>
    `;

      document.getElementById("profileForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const data = {
          name: document.getElementById('name').value,
          password: document.getElementById('password').value,
          phone: document.getElementById('phone').value,
          email: document.getElementById('email').value
        };
        const profile_url = '/api/update-profile'
        fetch(profile_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(res => res.json())
          .then(result => {
            if (result.success) {
              alert('정보가 성공적으로 변경되었습니다!');
            } else {
              alert('변경 실패: ' + result.message);
            }
          })
          .catch(err => {
            console.error('Error:', err);
            alert('서버 오류가 발생했습니다.');
          });
      });
    }

  // 임시 더미 데이터
  const dummyCounselings = Array.from({ length: 37 }, (_, i) => ({
    id: i + 1,
    title: `상담 제목 ${i + 1}`,
    date: `2024-01-${(i + 1).toString().padStart(2, '0')}`,
    content: `이것은 상담 ${i + 1}의 내용입니다. 자세한 상담 기록이 여기에 표시됩니다.`
  }));

  const dummySelfTests = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    title: `자가진단 ${i + 1}`,
    date: `2024-02-${(i + 1).toString().padStart(2, '0')}`,
    content: `자가진단 ${i + 1}의 세부내용입니다.`
  }));

 const moodData = [
  { date: '2025-05-24', score: 0.11 },
  { date: '2025-05-25', score: -0.47 },
  { date: '2025-05-26', score: -0.92 },
  { date: '2025-05-27', score: -0.24 },
  { date: '2025-05-28', score: -0.31 },
  { date: '2025-05-20', score: -0.65 },
  { date: '2025-05-21', score: -0.12 },
  { date: '2025-05-22', score: 0.38 },
  { date: '2025-05-23', score: 0.76 },
  { date: '2025-05-29', score: 0.58 }
];

  // 초기 탭
  tabs[0].click();
});