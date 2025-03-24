function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cookieArr = document.cookie.split(';');
    for (let cookie of cookieArr) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return "";
}

const textArea = document.getElementById('text-area');
textArea.value = getCookie("savedText");

textArea.addEventListener("input", () => {
    setCookie("savedText", textArea.value, 1000);
});

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();

        const textContent = textArea.value.trim();
        const firstWord = textContent.split(/\s+/)[0] || "notes";

        const blob = new Blob([textContent], { type: "text/plain" });

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${firstWord}.txt`;
        a.style.display = "none";

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === 'Tab') {
        event.preventDefault();
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;

        textArea.value = textArea.value.substring(0, start) + "\t" + textArea.value.substring(end);

        textArea.selectionStart = textArea.selectionEnd = start + 1;
    }
});

document.addEventListener('input', function (event) {
    if (event.target.id === 'text-area') {
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + 'px';
    }
});