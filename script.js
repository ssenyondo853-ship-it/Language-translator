const englishText = document.getElementById("englishText");
const language = document.getElementById("language");
const translateBtn = document.getElementById("translateBtn");
const resultText = document.getElementById("resultText");
const copyBtn = document.getElementById("copyBtn");
const speakBtn = document.getElementById("speakBtn");

translateBtn.addEventListener("click", async () => {
    const text = englishText.value.trim();
    const selectedLanguage = language.value;

    if (text === "") {
        resultText.textContent = "Please enter some English text.";
        return;
    }

    resultText.textContent = "Translating...";

    try {
        const response = await fetch(
    const response = await fetch(
    "https://language-translator-vhqg.onrender.com/api/translate",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: text,
            language: selectedLanguage
        })
    }
);
        const data = await response.json();

        if (data.error) {
            resultText.textContent = data.error;
            return;
        }

        resultText.textContent = data.translation;

    } catch (error) {
        console.error(error);
        resultText.textContent =
            "Could not connect to the translation server.";
    }
});

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(resultText.textContent);
    alert("Translation copied!");
});

speakBtn.addEventListener("click", () => {
    const speech = new SpeechSynthesisUtterance(
        resultText.textContent
    );

    speech.lang = "lg-UG";
    speechSynthesis.speak(speech);
});
