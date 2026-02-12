let quiz = {
    currentQuestion: null,
    questionNumber: 0,
    totalAnswered: 0, // TOP
    last5Results: [], // Son 5 sorunun sonuçları (true/false)
    correctInLast5: 0 // DY
};

function startQuiz() {
    document.getElementById('startSection').classList.add('hidden');
    document.getElementById('questionSection').classList.remove('hidden');
    document.getElementById('checkButton').disabled = false;
    generateQuestion();
    updateScoreDisplay();
}

function generateQuestion() {
    quiz.questionNumber++;

    // 5. sorudan itibaren GÖNDER düğmesini göster
    if (quiz.questionNumber >= 5) {
        document.getElementById('sendButtonSection').classList.remove('hidden');
    }

    // Yeni soru oluştur
    quiz.currentQuestion = {
        a: 1,
        b: (Math.floor(Math.random() * 21) - 10) * 2, // Çift sayı -20 ile +20
        c: Math.floor(Math.random() * 41) - 20
    };

    // r ve k hesapla
    quiz.currentQuestion.r = quiz.currentQuestion.b / 2;
    const xVertex = -quiz.currentQuestion.r;
    quiz.currentQuestion.k = quiz.currentQuestion.a * Math.pow(xVertex, 2) +
        quiz.currentQuestion.b * xVertex +
        quiz.currentQuestion.c;

    // Soruyu göster
    displayQuestion();

    // Input alanlarını temizle
    document.getElementById('inputA').value = '';
    document.getElementById('inputR').value = '';
    document.getElementById('inputK').value = '';

    // Cevap kutusunu gizle
    document.getElementById('answerBox').classList.remove('show');
    document.getElementById('feedback').innerHTML = '';

    // Kontrol düğmesini aktif et
    document.getElementById('checkButton').disabled = false;

    // Ekranı en üste kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function displayQuestion() {
    const { a, b, c } = quiz.currentQuestion;
    let bSign = b >= 0 ? '+' : '';
    let cSign = c >= 0 ? '+' : '';

    document.getElementById('originalFunction').innerHTML =
        `f(x) = ${a}x<span class="sup">2</span> ${bSign} ${b}x ${cSign} ${c}`;
}

function checkAndShowAnswer() {
    const inputA = parseFloat(document.getElementById('inputA').value);
    const inputR = parseFloat(document.getElementById('inputR').value);
    const inputK = parseFloat(document.getElementById('inputK').value);

    const tolerance = 0.01;
    const aCorrect = Math.abs(inputA - quiz.currentQuestion.a) < tolerance;
    const rCorrect = Math.abs(inputR - quiz.currentQuestion.r) < tolerance;
    const kCorrect = Math.abs(inputK - quiz.currentQuestion.k) < tolerance;

    const allCorrect = aCorrect && rCorrect && kCorrect;

    // Puan hesapla
    const score = allCorrect ? 1 : 0;

    // Sonucu kaydet
    quiz.last5Results.push(allCorrect);
    if (quiz.last5Results.length > 5) {
        quiz.last5Results.shift(); // İlk elemanı çıkar
    }
    quiz.totalAnswered++;

    // DY'yi güncelle (son 5 sorudaki doğru sayısı)
    quiz.correctInLast5 = quiz.last5Results.filter(r => r === true).length;

    // Lambaları güncelle
    updateLamps();

    // Feedback göster
    let feedback = '<div class="feedback" style="background: ';

    if (allCorrect) {
        feedback += '#d4edda; color: #155724;">✓ Mükemmel! Tüm cevaplar doğru. <strong>+1 Puan</strong></div>';
    } else {
        feedback += '#f8d7da; color: #721c24;">✗ Bazı cevaplar yanlış. <strong>0 Puan</strong></div>';
    }

    document.getElementById('feedback').innerHTML = feedback;

    // Doğru cevabı göster
    showAnswer();

    // Skor gösterimini güncelle
    updateScoreDisplay();

    // Kontrol düğmesini devre dışı bırak
    document.getElementById('checkButton').disabled = true;
}

function showAnswer() {
    const { a, r, k } = quiz.currentQuestion;

    let rDisplay = Number.isInteger(r) ? r : r.toFixed(2);
    let kDisplay = Number.isInteger(k) ? k : k.toFixed(2);

    document.getElementById('answerContent').innerHTML = `
                <div class="function-display" style="font-size: 20px;">
                    f(x) = ${a}(x ${r >= 0 ? '+' : ''} ${rDisplay})<span class="sup">2</span> ${k >= 0 ? '+' : ''} ${kDisplay}
                </div>
                <p style="margin-top: 10px;"><strong>a</strong> = ${a}</p>
                <p><strong>r</strong> = ${rDisplay}</p>
                <p><strong>k</strong> = ${kDisplay}</p>
            `;

    document.getElementById('answerBox').classList.add('show');
}

function nextQuestion() {
    generateQuestion();
}

function updateLamps() {
    const lamps = document.querySelectorAll('.lamp');

    // Tüm lambaları sıfırla
    lamps.forEach(lamp => {
        lamp.classList.remove('correct', 'incorrect');
    });

    // Son 5 sonucu göster (soldan sağa, en son sonuç en solda)
    for (let i = 0; i < quiz.last5Results.length && i < 5; i++) {
        const lampIndex = i;
        const resultIndex = quiz.last5Results.length - 1 - i; // Tersinden al

        if (quiz.last5Results[resultIndex]) {
            lamps[lampIndex].classList.add('correct');
        } else {
            lamps[lampIndex].classList.add('incorrect');
        }
    }
}

function updateScoreDisplay() {
    const display = document.getElementById('scoreDisplay');
    if (quiz.totalAnswered === 0) {
        display.textContent = `Başlamak için "BAŞLA" butonuna tıklayın`;
    } else if (quiz.totalAnswered < 5) {
        display.textContent = `Çözülen soru: ${quiz.totalAnswered} - En az 5 soru çözmelisiniz`;
    } else {
        display.textContent = `Çözülen soru: ${quiz.totalAnswered} - Son 5 sorudaki doğru: ${quiz.correctInLast5}`;
    }
}

function showSubmitSection() {
    // Minimum 5 soru kontrolü
    if (quiz.totalAnswered < 5) {
        alert('En az 5 soru çözmelisiniz!');
        return;
    }

    document.getElementById('questionSection').classList.add('hidden');
    document.getElementById('submitSection').classList.add('show');
    document.getElementById('sendButtonSection').classList.add('hidden');
    window.scrollTo({ top: document.getElementById('submitSection').offsetTop - 20, behavior: 'smooth' });
}

function goBackToQuestions() {
    document.getElementById('submitSection').classList.remove('show');
    document.getElementById('questionSection').classList.remove('hidden');

    // Eğer en az 5 soru çözüldüyse GÖNDER düğmesini tekrar göster
    if (quiz.questionNumber >= 5) {
        document.getElementById('sendButtonSection').classList.remove('hidden');
    }

    // Şifre görünümünü gizle
    document.getElementById('passwordDisplay').classList.remove('show');

    // Formu temizle
    document.getElementById('studentNumber').value = '';
    document.getElementById('studentName').value = '';
    document.getElementById('studentSurname').value = '';
    document.getElementById('studentClass').value = '';
    document.getElementById('studentSection').value = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generatePassword() {
    // Minimum 5 soru kontrolü
    if (quiz.totalAnswered < 5) {
        alert('En az 5 soru çözmelisiniz!');
        return;
    }

    const studentNumber = parseInt(document.getElementById('studentNumber').value);
    const studentName = document.getElementById('studentName').value.trim();
    const studentSurname = document.getElementById('studentSurname').value.trim();
    const studentClass = document.getElementById('studentClass').value;
    const studentSection = document.getElementById('studentSection').value.trim().toUpperCase();

    // Validasyon
    if (!studentNumber || isNaN(studentNumber)) {
        alert('Lütfen geçerli bir okul numarası girin (sadece rakam).');
        return;
    }

    if (!studentName || !studentSurname) {
        alert('Lütfen adınızı ve soyadınızı girin.');
        return;
    }

    if (!studentClass || studentClass < 1 || studentClass > 12) {
        alert('Lütfen geçerli bir sınıf girin (1-12 arası).');
        return;
    }

    if (!studentSection || !/^[A-Za-z]$/.test(studentSection)) {
        alert('Lütfen geçerli bir şube girin (tek harf).');
        return;
    }

    // ŞİFRE = öğrenci numarası * (öğrenci numarası + DY*100 + TOP)
    const DY = quiz.correctInLast5;
    const TOP = quiz.totalAnswered;
    const password = studentNumber * (studentNumber + DY * 100 + TOP);

    // Şifreyi göster
    document.getElementById('passwordValue').textContent = password;
    document.getElementById('passwordDisplay').classList.add('show');

    // Ekranı şifre bölümüne kaydır
    setTimeout(() => {
        window.scrollTo({
            top: document.getElementById('passwordDisplay').offsetTop - 100,
            behavior: 'smooth'
        });
    }, 100);
}

function copyPassword() {
    const password = document.getElementById('passwordValue').textContent;

    // Kopyalama işlemi
    navigator.clipboard.writeText(password).then(() => {
        alert('Şifre kopyalandı! Artık Google Form\'a yapıştırabilirsiniz.');
    }).catch(() => {
        // Eski tarayıcılar için alternatif
        const textarea = document.createElement('textarea');
        textarea.value = password;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Şifre kopyalandı! Artık Google Form\'a yapıştırabilirsiniz.');
    });
}

function sendToWhatsApp() {
    const studentNumber = document.getElementById('studentNumber').value;
    const studentName = document.getElementById('studentName').value.trim();
    const studentSurname = document.getElementById('studentSurname').value.trim();
    const studentClass = document.getElementById('studentClass').value;
    const studentSection = document.getElementById('studentSection').value.trim().toUpperCase();
    const password = document.getElementById('passwordValue').textContent;

    const message = `${studentNumber} ${studentName} ${studentSurname} ${studentClass} ${studentSection} ${password}`;
    const phoneNumber = "+905070343973";
    const encodedMessage = encodeURIComponent(message);

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

function toggleSign(inputId) {
    const input = document.getElementById(inputId);
    let value = input.value.trim();

    if (value.startsWith('-')) {
        input.value = value.substring(1);
    } else {
        input.value = '-' + value;
    }
}
