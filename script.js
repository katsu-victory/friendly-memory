document.getElementById("suggestForm").addEventListener("submit", suggestAndSubmit);

async function suggestAndSubmit(event) {
    event.preventDefault();

    const userId = document.getElementById("userId").value;
    const count = parseInt(document.getElementById("userCount").value);
    if (!userId || isNaN(count)) {
        alert("ユーザーIDとカウントを入力してください。");
        return;
    }

    const symptoms = [
        document.querySelector('input[name="fatigue"]:checked').value,
        document.querySelector('input[name="muscle_pain"]:checked').value,
        document.querySelector('input[name="breathlessness"]:checked').value
    ];

    let course;
    if (count >= 1 && count <= 3) {
        course = 1;
    } else if (count >= 4 && count <= 6) {
        course = 2;
    } else if (count >= 7 && count <= 9) {
        course = 3;
    } else if (count >= 10 && count <= 12) {
        course = 4;
    } else if (count >= 13 && count <= 15) {
        course = 5;
    } else {
        course = 6;
    }

    let stopExercise = false;
    symptoms.forEach(value => {
        if (value === '重度') {
            stopExercise = true;
        } else if (value === '中程度') {
            course = Math.max(course - 2, 1);
        } else if (value === '軽度') {
            course = Math.max(course - 1, 1);
        }
    });

    const programSuggestion = document.getElementById('program-suggestion');
    if (stopExercise) {
        programSuggestion.innerHTML = "運動中止が推奨されます。体調を整えてから再開しましょう。";
    } else {
        const courseLinks = {
            1: "https://forms.gle/5U6NiNpwS5zwpBhdA",
            2: "https://forms.gle/SwrqqV44AddakW3E7",
            3: "https://forms.gle/ZrLYJJnHHigH1wuC7",
            4: "https://forms.gle/WoSL5G6CxAYR7Mvs6",
            5: "https://forms.gle/VGwBYdtgL2D8GXSE9",
            6: "https://forms.gle/rc1dBT3chiJEQdZo8"
        };
        programSuggestion.innerHTML = `推奨される運動コース: コース ${course} <br><a href="${courseLinks[course]}" target="_blank">コース${course}の詳細はこちら</a>`;
    }

    const exerciseDateData = {
        type: "exercise_date",
        userId: userId,
        userCount: count,
        fatigue: symptoms[0],
        muscle_pain: symptoms[1],
        breathlessness: symptoms[2],
        suggestedCourse: course
    };

    try {
        await fetch("https://script.google.com/macros/s/AKfycbwt4C9BB2ohyoYiPNq9moCOa4of-WGdLFrE1TBSRs4b7AI7Xz_eQNiCFxquRlkzlCT3/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            mode: "no-cors",
            body: JSON.stringify(exerciseDateData)
        });
    } catch (error) {
        console.error("データ送信中にエラーが発生しました:", error);
        alert("データ送信中にエラーが発生しました。");
    }
}
