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