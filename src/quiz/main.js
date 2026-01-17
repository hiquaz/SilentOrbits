// Made by Joy James
// Declaring Variables

const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
let shuffledQuestions, currentQuestionIndex;
const questionImage = document.getElementById('planet-image');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const questions = [
  {
    question: "Rác thải ngoài vũ trụ là gì?",
    image: "./img/sun.png",
    altText: "Space Debris",
    answers: [
      { text: "Các thiên thạch tự nhiên bay quanh Trái Đất.", correct: false },
      { text: "Các vật thể nhân tạo không còn hoạt động tồn tại trong không gian.", correct: true },
      { text: "Các hành tinh nhỏ trong hệ Mặt Trời.", correct: false },
      { text: "Các đám mây khí ngoài Trái Đất.", correct: false }
    ]
  },
  {
    question: "Đâu là nguồn gốc chính tạo ra rác thải ngoài vũ trụ?",
    image: "./img/sun.png",
    altText: "Rocket debris",
    answers: [
      { text: "Hoạt động núi lửa trên Trái Đất.", correct: false },
      { text: "Va chạm giữa các thiên thạch tự nhiên.", correct: false },
      { text: "Vệ tinh hỏng và tầng tên lửa sau khi hoàn thành nhiệm vụ.", correct: true },
      { text: "Bão Mặt Trời.", correct: false }
    ]
  },
  {
    question: "Rác thải ngoài vũ trụ chủ yếu tồn tại ở khu vực nào quanh Trái Đất?",
    image: "./img/sun.png",
    altText: "Low Earth Orbit",
    answers: [
      { text: "Bề mặt Trái Đất.", correct: false },
      { text: "Trong khí quyển thấp.", correct: false },
      { text: "Quỹ đạo thấp quanh Trái Đất (LEO).", correct: true },
      { text: "Bên trong Mặt Trăng.", correct: false }
    ]
  },
  {
    question: "Vì sao rác thải ngoài vũ trụ lại nguy hiểm dù có kích thước nhỏ?",
    image: "./img/sun.png",
    altText: "High speed debris",
    answers: [
      { text: "Vì chúng có nhiệt độ rất cao.", correct: false },
      { text: "Vì chúng chứa chất phóng xạ.", correct: false },
      { text: "Vì chúng di chuyển với vận tốc rất lớn.", correct: true },
      { text: "Vì chúng phát ra sóng điện từ mạnh.", correct: false }
    ]
  },
  {
    question: "Tốc độ trung bình của rác thải ngoài vũ trụ trong quỹ đạo Trái Đất là bao nhiêu?",
    image: "./img/sun.png",
    altText: "Orbital speed",
    answers: [
      { text: "Khoảng 1–2 km/s.", correct: false },
      { text: "Khoảng 3–4 km/s.", correct: false },
      { text: "Khoảng 7–8 km/s.", correct: true },
      { text: "Trên 20 km/s.", correct: false }
    ]
  },
  {
    question: "Loại rác thải nào sau đây được xem là rác thải ngoài vũ trụ?",
    image: "./img/sun.png",
    altText: "Broken satellite",
    answers: [
      { text: "Vệ tinh đang hoạt động.", correct: false },
      { text: "Trạm vũ trụ đang sử dụng.", correct: false },
      { text: "Mảnh vỡ từ vệ tinh đã hỏng.", correct: true },
      { text: "Tàu thăm dò đang hoạt động.", correct: false }
    ]
  },
  {
    question: "Rác thải ngoài vũ trụ có thể gây ra hậu quả nào sau đây?",
    image: "./img/sun.png",
    altText: "Satellite collision",
    answers: [
      { text: "Gây ô nhiễm nguồn nước.", correct: false },
      { text: "Gây va chạm và phá hủy vệ tinh.", correct: true },
      { text: "Gây động đất.", correct: false },
      { text: "Làm thay đổi khí hậu Trái Đất.", correct: false }
    ]
  },
  {
    question: "Mảnh rác thải kích thước chỉ vài mm có thể gây nguy hiểm vì:",
    image: "./img/sun.png",
    altText: "Micro debris",
    answers: [
      { text: "Có khối lượng rất lớn.", correct: false },
      { text: "Có nhiệt độ cực cao.", correct: false },
      { text: "Di chuyển với tốc độ quỹ đạo rất cao.", correct: true },
      { text: "Phát ra bức xạ mạnh.", correct: false }
    ]
  },
  {
    question: "Quỹ đạo nào có mật độ rác thải cao nhất hiện nay?",
    image: "./img/sun.png",
    altText: "Earth orbit",
    answers: [
      { text: "Quỹ đạo địa tĩnh (GEO).", correct: false },
      { text: "Quỹ đạo thấp quanh Trái Đất (LEO).", correct: true },
      { text: "Quỹ đạo Mặt Trăng.", correct: false },
      { text: "Quỹ đạo sao Hỏa.", correct: false }
    ]
  },
  {
    question: "Đối tượng nào dễ bị ảnh hưởng nhất bởi rác thải ngoài vũ trụ?",
    image: "./img/sun.png",
    altText: "Space station",
    answers: [
      { text: "Máy bay dân dụng.", correct: false },
      { text: "Tàu thủy.", correct: false },
      { text: "Vệ tinh và trạm vũ trụ.", correct: true },
      { text: "Tàu ngầm.", correct: false }
    ]
  },
  {
    question: "Nguyên nhân nào làm số lượng rác thải ngoài vũ trụ ngày càng tăng?",
    image: "./img/sun.png",
    altText: "Satellite launch",
    answers: [
      { text: "Sự gia tăng hoạt động phóng vệ tinh.", correct: true },
      { text: "Sự thay đổi thời tiết.", correct: false },
      { text: "Sự bốc hơi của khí quyển.", correct: false },
      { text: "Hoạt động của núi lửa.", correct: false }
    ]
  },
  {
    question: "Rác thải ngoài vũ trụ thường tồn tại trong không gian bao lâu?",
    image: "./img/sun.png",
    altText: "Long lasting debris",
    answers: [
      { text: "Vài ngày.", correct: false },
      { text: "Vài tháng.", correct: false },
      { text: "Vài năm.", correct: false },
      { text: "Có thể hàng chục đến hàng trăm năm.", correct: true }
    ]
  },
  {
    question: "Hiện tượng va chạm dây chuyền giữa các mảnh rác được gọi là gì?",
    image: "./img/sun.png",
    altText: "Kessler effect",
    answers: [
      { text: "Hiệu ứng nhà kính.", correct: false },
      { text: "Hiệu ứng Kessler.", correct: true },
      { text: "Hiệu ứng Doppler.", correct: false },
      { text: "Hiệu ứng quang điện.", correct: false }
    ]
  },
  {
    question: "Rác thải ngoài vũ trụ chủ yếu là vật thể:",
    image: "./img/sun.png",
    altText: "Artificial objects",
    answers: [
      { text: "Tự nhiên.", correct: false },
      { text: "Sinh học.", correct: false },
      { text: "Nhân tạo.", correct: true },
      { text: "Hóa học.", correct: false }
    ]
  },
  {
    question: "Khi rác thải va chạm với vệ tinh đang hoạt động, điều gì có thể xảy ra?",
    image: "./img/sun.png",
    altText: "Damaged satellite",
    answers: [
      { text: "Vệ tinh hoạt động tốt hơn.", correct: false },
      { text: "Không có ảnh hưởng gì.", correct: false },
      { text: "Vệ tinh bị hư hỏng hoặc phá hủy.", correct: true },
      { text: "Vệ tinh thay đổi màu sắc.", correct: false }
    ]
  },
  {
    question: "Mảnh rác có kích thước lớn thường nguy hiểm hơn vì:",
    image: "./img/sun.png",
    altText: "Large debris",
    answers: [
      { text: "Có màu sắc dễ nhìn thấy.", correct: false },
      { text: "Khó kiểm soát và gây thiệt hại lớn khi va chạm.", correct: true },
      { text: "Có khả năng phát sáng.", correct: false },
      { text: "Có nhiệt độ thấp.", correct: false }
    ]
  },
  {
    question: "Rác thải ngoài vũ trụ ảnh hưởng trực tiếp đến lĩnh vực nào sau đây?",
    image: "./img/sun.png",
    altText: "Satellite communication",
    answers: [
      { text: "Giao thông đường bộ.", correct: false },
      { text: "Nông nghiệp.", correct: false },
      { text: "Thông tin liên lạc vệ tinh.", correct: true },
      { text: "Du lịch biển.", correct: false }
    ]
  },
  {
    question: "Đơn vị đo vận tốc của rác thải ngoài vũ trụ thường là:",
    image: "./img/sun.png",
    altText: "Speed unit",
    answers: [
      { text: "m/s.", correct: false },
      { text: "km/h.", correct: false },
      { text: "km/s.", correct: true },
      { text: "m/phút.", correct: false }
    ]
  },
  {
    question: "Đâu KHÔNG phải là rác thải ngoài vũ trụ?",
    image: "./img/sun.png",
    altText: "Active space station",
    answers: [
      { text: "Mảnh vỡ tên lửa.", correct: false },
      { text: "Vệ tinh hỏng.", correct: false },
      { text: "Trạm vũ trụ đang hoạt động.", correct: true },
      { text: "Mảnh vỡ sau va chạm vệ tinh.", correct: false }
    ]
  },
  {
    question: "Việc tìm hiểu về rác thải ngoài vũ trụ giúp học sinh:",
    image: "./img/sun.png",
    altText: "Space education",
    answers: [
      { text: "Giải trí là chính.", correct: false },
      { text: "Hiểu thêm về thiên văn học cổ đại.", correct: false },
      { text: "Nâng cao nhận thức về môi trường không gian và khoa học công nghệ.", correct: true },
      { text: "Học cách phóng vệ tinh.", correct: false }
    ]
  }
];
// ===== BỘ CÂU HỎI 2: PHÂN LOẠI RÁC THẢI NGOÀI VŨ TRỤ =====
questions.push(
  {
    question: "Tiêu chí nào được sử dụng để phân loại rác thải ngoài vũ trụ trong website?",
    image: "./img/sun.png",
    altText: "Space debris",
    answers: [
      { text: "Màu sắc của rác thải.", correct: false },
      { text: "Khối lượng, kích thước và quỹ đạo chuyển động.", correct: true },
      { text: "Thời gian phóng vào không gian.", correct: false },
      { text: "Quốc gia phóng vệ tinh.", correct: false }
    ]
  },
  {
    question: "Rác thải ngoài vũ trụ được chia thành các nhóm chính nào trong đề tài?",
    image: "./img/sun.png",
    altText: "Satellite debris",
    answers: [
      { text: "Rác kim loại và rác nhựa.", correct: false },
      { text: "Rác tự nhiên và rác nhân tạo.", correct: false },
      { text: "Rác nhẹ và rác nặng, khó xử lí.", correct: true },
      { text: "Rác nguy hiểm và rác không nguy hiểm.", correct: false }
    ]
  },
  {
    question: "Đâu là ví dụ của rác thải nhẹ ngoài vũ trụ?",
    image: "./img/sun.png",
    altText: "Orbit debris",
    answers: [
      { text: "Tầng tên lửa cũ.", correct: false },
      { text: "Vệ tinh lớn đã ngừng hoạt động.", correct: false },
      { text: "Mảnh vỡ nhỏ từ vệ tinh sau va chạm.", correct: true },
      { text: "Trạm vũ trụ.", correct: false }
    ]
  },
  {
    question: "Rác thải nào được xem là rác nặng, khó xử lí?",
    image: "./img/sun.png",
    altText: "Large debris",
    answers: [
      { text: "Mảnh rác có kích thước vài mm.", correct: false },
      { text: "Mảnh rác dễ cháy khi vào khí quyển.", correct: false },
      { text: "Vệ tinh hỏng hoặc tầng tên lửa lớn.", correct: true },
      { text: "Bụi không gian.", correct: false }
    ]
  }
);

// ===== BỘ CÂU HỎI 3: GIẢI PHÁP XỬ LÍ =====
questions.push(
  {
    question: "Giải pháp phù hợp nhất để xử lí rác thải nhẹ ngoài vũ trụ là gì?",
    image: "./img/sun.png",
    altText: "Debris handling",
    answers: [
      { text: "Giữ nguyên rác trên quỹ đạo.", correct: false },
      { text: "Đưa rác vào khí quyển Trái Đất để đốt cháy.", correct: true },
      { text: "Thu gom và đưa về Trái Đất.", correct: false },
      { text: "Đưa rác ra xa Hệ Mặt Trời.", correct: false }
    ]
  },
  {
    question: "Khi rác thải nhẹ đi vào khí quyển Trái Đất, hiện tượng nào xảy ra chủ yếu?",
    image: "./img/sun.png",
    altText: "Atmosphere entry",
    answers: [
      { text: "Rác thải bị đông cứng lại.", correct: false },
      { text: "Rác thải quay trở lại quỹ đạo cũ.", correct: false },
      { text: "Rác thải bị đốt cháy do ma sát với khí quyển.", correct: true },
      { text: "Rác thải rơi nguyên vẹn xuống mặt đất.", correct: false }
    ]
  },
  {
    question: "Rác thải nặng, khó xử lí thường được đề xuất giải pháp nào?",
    image: "./img/sun.png",
    altText: "Heavy debris",
    answers: [
      { text: "Đưa vào khí quyển ngay.", correct: false },
      { text: "Giữ nguyên trên quỹ đạo hoạt động.", correct: false },
      { text: "Đưa ra khỏi quỹ đạo hoạt động an toàn.", correct: true },
      { text: "Nghiền nhỏ trong không gian.", correct: false }
    ]
  }
);

// ===== BỘ CÂU HỎI 4: AI & MÔ PHỎNG 3D =====
questions.push(
  {
    question: "Trong website nghiên cứu, AI được sử dụng chủ yếu để làm gì?",
    image: "./img/sun.png",
    altText: "AI classification",
    answers: [
      { text: "Thiết kế giao diện website.", correct: false },
      { text: "Phân loại rác thải và đề xuất giải pháp xử lí.", correct: true },
      { text: "Tăng tốc độ Internet.", correct: false },
      { text: "Tạo hiệu ứng âm thanh.", correct: false }
    ]
  },
  {
    question: "Mô hình 3D trong website giúp người dùng hiểu rõ nhất nội dung nào?",
    image: "./img/sun.png",
    altText: "3D orbit",
    answers: [
      { text: "Cấu trúc bên trong Trái Đất.", correct: false },
      { text: "Quỹ đạo chuyển động và kịch bản xử lí rác thải.", correct: true },
      { text: "Lịch sử hàng không.", correct: false },
      { text: "Cách chế tạo vệ tinh.", correct: false }
    ]
  }
);

// ===== BỘ CÂU HỎI 5: GIÁO DỤC & STEM =====
questions.push(
  {
    question: "Rác thải ngoài vũ trụ ảnh hưởng như thế nào đến môi trường không gian?",
    image: "./img/sun.png",
    altText: "Space environment",
    answers: [
      { text: "Không gây ảnh hưởng đáng kể.", correct: false },
      { text: "Làm tăng nguy cơ va chạm và hư hỏng vệ tinh.", correct: true },
      { text: "Chỉ ảnh hưởng thiên thạch tự nhiên.", correct: false },
      { text: "Tự biến mất nhanh chóng.", correct: false }
    ]
  },
  {
    question: "Thông điệp chính mà đề tài muốn truyền tải là gì?",
    image: "./img/satellite.png",
    altText: "STEM education",
    answers: [
      { text: "Công nghệ không gian chỉ dành cho chuyên gia.", correct: false },
      { text: "Rác thải vũ trụ không thể giải quyết.", correct: false },
      { text: "Khoa học và công nghệ có thể bảo vệ môi trường không gian.", correct: true },
      { text: "Chỉ cần phát triển vệ tinh mới.", correct: false }
    ]
  }
);


// Start the game

startButton.addEventListener('click', startGame);

// Make next button show next question

nextButton.addEventListener('click',() => {
  currentQuestionIndex++;
  setNextQuestion();
})

function startGame() {
  shuffledQuestions = questions.sort(() => Math.random() - .5);
  currentQuestionIndex = 0;
  startButton.classList.add('hide');
  questionContainerElement.classList.remove('hide');
  setNextQuestion();
}

// Set and show the next question

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
questionElement.innerText = question.question;
questionImage.src = question.image;
questionImage.alt = question.altText;
question.answers.forEach(answer => {
  const button = document.createElement('button');
  button.innerText = answer.text;
  button.classList.add('btn');
  if(answer.correct) {
    button.dataset.correct = answer.correct;
  }
  button.addEventListener('click', selectAnswer);
  answerButtonsElement.appendChild(button);
})
}

function resetState() {
  nextButton.classList.add('hide');
  while(answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

// Selecting the answer and displaying correct/wrong colors

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;
  setStatusClass(document.body, correct);
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct);
  })
  // Restart quiz
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide');
  } else {
    startButton.innerText = 'Restart';
    startButton.classList.remove('hide');
    startButton.classList.add('orange-btn')
  }
}

function setStatusClass(element,correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add('correct');
  } else {
    element.classList.add('wrong');
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct');
  element.classList.remove('wrong');
}
