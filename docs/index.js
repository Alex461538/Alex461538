let container = undefined;

const pages = {
    "home": ["home.html", "home-lnk"],
    "about": ["about.html", "about-lnk"],
    "guides": ["guides.html", "guides-lnk"]
}

async function loadPage(name) {
    path = (pages[name] || ["home.html", ""])[0]
    btn = (pages[name] || ["", "home-lnk"])[1]

    fetch(path)
        .then(res => res.text())
        .then(html => {
            container.innerHTML = html;

            // Re-run scripts
            container.querySelectorAll('script').forEach(oldScript => {
                const newScript = document.createElement('script');
                if (oldScript.src) {
                    // external script
                    newScript.src = oldScript.src;
                } else {
                    // inline script
                    newScript.textContent = oldScript.textContent;
                }
                document.body.appendChild(newScript);
                newScript.remove(); // optional cleanup
            })

            for (b in pages) {
                document.getElementById(pages[b][1]).classList.add("unfocused")
            }
            document.getElementById(btn).classList.remove("unfocused")
        })
        .catch(error => {
            console.error("Error loading HTML:", error);
        })
}

document.addEventListener("DOMContentLoaded", () => {
    container = document.getElementById("main-card");
    loadPage("home")
})