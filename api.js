document.addEventListener("DOMContentLoaded", async function () {
    const bibleParagraph = document.querySelector("p.bible");
    
    try {
        const response = await fetch("https://bible-api.com/?random=verse");
        if (!response.ok) throw new Error("failed to fetch bible verse");
        
        const data = await response.json();
        //bibleParagraph.textContent = `${data.reference}: ${data.text}`;
        bibleParagraph.textContent = `${data.text}`.toLowerCase();
    } catch (error) {
        console.error("error fetching bible verse:", error);
        bibleParagraph.textContent = "failed to load bible verse.";
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    const randomFact = document.querySelector("p.fact");
    
    try {
        const response = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random");
        if (!response.ok) throw new Error("failed to fetch random fact");
        
        const data = await response.json();
        //bibleParagraph.textContent = `${data.reference}: ${data.text}`;
        randomFact.textContent = `${data.text}`.toLowerCase();
    } catch (error) {
        console.error("error fetching bible verse:", error);
        randomFact.textContent = "failed to load random fact.";
    }
});