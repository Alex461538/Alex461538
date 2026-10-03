class ProjectCard extends HTMLElement {
    set project(value) {
        this.data = value;
        this.render();
    }

    render() {
        const styles = {
            software: "💻",
            plush: "🧵",
            experiment: "🧪",
            video: "📺"
        };
        const p = this.data;
        const icon = styles[p.type] ?? "📦";

        this.innerHTML = `
            <article class="project-card">
                <section class="project-card-info">
                    <h2 class="name">${icon} ${p.name}</h2>
                    <p class="brief">${p.brief}</p>

                    <div class="project-techs">
                        ${p.techs.map(t => `<span>${t}</span>`).join("")}
                    </div>

                    <div class="project-link-buttons">
                        ${p["play-it-on"]
                            ? `<a target="_blank" class="link-button" href="${p["play-it-on"]}">💡 Play it</a>`
                            : ""
                        }

                        ${p["source-on"]
                            ? `<a target="_blank" class="link-button" href="${p["source-on"]}">📂 Source</a>`
                            : ""
                        }

                        ${p["docs-on"]
                            ? `<a target="_blank" class="link-button" href="${p["docs-on"]}">⁉️ Docs</a>`
                            : ""
                        }
                    </div>
                </section>
                <div class="banner" style="background-image: url('${p.banner}')"></div>
            </article>
        `;
    }
}

customElements.define("project-card", ProjectCard);