function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/`;
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

function getAllCookies() {
    return document.cookie
        .split('; ')
        .map(cookie => cookie.split('=')[0])
        .filter(name => !["currentDoc"].includes(name));
}

const textArea = document.getElementById('text-area');
textArea.style.fontFamily = "Consolas, monospace";

let currentDoc = getCookie("currentDoc") || "Main Page";

function loadDocument(docName) {
    currentDoc = docName;
    textArea.value = getCookie(docName);
    setCookie("currentDoc", docName, 1000);
}

loadDocument(currentDoc);

textArea.addEventListener("input", () => {
    setCookie(currentDoc, textArea.value, 1000);
});

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        if (!currentDoc) {
            alert("No document is currently open.");
            return;
        }
        setCookie(currentDoc, textArea.value.trim(), 1000);
    } else if (event.ctrlKey && event.key === 'q') {
        event.preventDefault();
        let textContent = textArea.value.trim();
        
        if (!textContent) {
            alert("Cannot save an empty document!");
            return;
        }

        let docName = currentDoc;
        if (currentDoc === "Main Page" || !currentDoc) {
            docName = textContent.split(/\s+/).slice(0, 2).join(" ") || "New Document";
        }

        const blob = new Blob([textContent], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${docName}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else if (event.ctrlKey && event.key === 'e') {
        event.preventDefault();
        const newName = prompt("Enter new document name:", "");
        if (newName) {
            const content = getCookie(currentDoc);
            setCookie(newName, content, 1000);
            document.cookie = `${currentDoc}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
            currentDoc = newName;
            alert(`Renamed to "${newName}"`);
        }
    } else if (event.ctrlKey && event.key === 'd') {
        event.preventDefault();
        const docName = prompt("Enter new document name:", "");
        if (docName) {
            setCookie(docName, "", 1000);
            loadDocument(docName);
        }
    } else if (event.ctrlKey && event.key === 'g') {
        event.preventDefault();
        showDocumentManager();
    } else if (event.ctrlKey && event.key === 'u') {
        event.preventDefault();
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".txt";
        input.style.display = "none";
        input.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    textArea.value = reader.result;
                    setCookie(currentDoc, textArea.value.trim(), 1000);
                };
                reader.readAsText(file);
            }
        });
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    } else if (event.key === 'Tab') {
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

function showDocumentManager() {
    let overlay = document.createElement("div");
    overlay.style.fontFamily = "Consolas, monospace";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0,0,0,0.7)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "1000";

    let modal = document.createElement("div");
    modal.style.fontFamily = "Consolas, monospace";
    modal.style.background = "#222";
    modal.style.color = "#fff";
    modal.style.padding = "20px";
    modal.style.borderRadius = "10px";
    modal.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.3)";
    modal.style.width = "300px";
    modal.style.textAlign = "center";

    let title = document.createElement("h2");
    title.style.fontFamily = "Consolas, monospace";
    title.innerText = "Select a Document";
    title.style.color = "#fff";
    modal.appendChild(title);

    let docList = document.createElement("ul");
    docList.style.fontFamily = "Consolas, monospace";
    docList.style.listStyle = "none";
    docList.style.padding = "0";
    docList.style.maxHeight = "200px";
    docList.style.overflowY = "auto";

    let allDocs = getAllCookies();
    if (allDocs.length === 0) {
        let emptyMsg = document.createElement("p");
        emptyMsg.innerText = "No saved documents.";
        emptyMsg.style.color = "#bbb";
        modal.appendChild(emptyMsg);
    } else {
        allDocs.forEach(doc => {
            let listItem = document.createElement("li");
            listItem.style.display = "flex";
            listItem.style.justifyContent = "space-between";
            listItem.style.alignItems = "center";
            listItem.style.padding = "5px 0";

            let docButton = document.createElement("button");
            docButton.style.fontFamily = "Consolas, monospace";
            docButton.innerText = doc;
            docButton.style.flexGrow = "1";
            docButton.style.border = "1px solid #555";
            docButton.style.background = "#333";
            docButton.style.color = "#fff";
            docButton.style.cursor = "pointer";
            docButton.style.padding = "5px";
            docButton.style.borderRadius = "5px";
            docButton.onclick = () => {
                loadDocument(doc);
                document.body.removeChild(overlay);
            };

            let deleteButton = document.createElement("button");
            deleteButton.style.fontFamily = "Consolas, monospace";
            deleteButton.innerText = "x";
            deleteButton.style.color = "white";
            deleteButton.style.background = "red";
            deleteButton.style.border = "none";
            deleteButton.style.padding = "5px 9px";
            deleteButton.style.cursor = "pointer";
            deleteButton.style.borderRadius = "50%";
            deleteButton.style.marginLeft = "10px";
            deleteButton.onclick = () => {
                document.cookie = `${doc}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
                document.body.removeChild(overlay);
                showDocumentManager(); // Refresh the menu after deleting
            };


            listItem.appendChild(docButton);
            listItem.appendChild(deleteButton);
            docList.appendChild(listItem);
        });
    }

    modal.appendChild(docList);

    let closeButton = document.createElement("button");
    closeButton.style.fontFamily = "Consolas, monospace";
    closeButton.innerText = "Close";
    closeButton.style.marginTop = "10px";
    closeButton.style.background = "#444";
    closeButton.style.color = "#fff";
    closeButton.style.border = "none";
    closeButton.style.padding = "5px 10px";
    closeButton.style.cursor = "pointer";
    closeButton.style.borderRadius = "5px";
    closeButton.onclick = () => document.body.removeChild(overlay);

    modal.appendChild(closeButton);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

document.addEventListener('input', function (event) {
    if (event.target.id === 'text-area') {
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + 'px';
    }
});
