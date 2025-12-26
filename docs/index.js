let main_card = undefined
let project_list_card = undefined
let project_info_card = undefined
let project_list = []

function printProjects(select_name = "")
{
    if (select_name == "")
    {
        return;
    }

    selected_project = undefined;

    let i = 0;
    project_list_card.innerHTML = "";
    for (const project of project_list)
    {
        if (project.name == select_name)
        {
            selected_project = project;
        }
        project_list_card.innerHTML += `
            <button onclick="printProjects('${project.name}')" class="a${i % 4} ${project.name == select_name ? "selected" : ""}" >
                ${project.name}
            </button>
        `;
        i++;
    }

    if (selected_project == undefined)
    {
        return;
    }

    let cache_key = selected_project.updated_at.replaceAll(/[\:\-]/g, "_");
    let img_url = `https://opengraph.githubassets.com/${cache_key}/${selected_project.owner.login}/${selected_project.name}`;
    let pages_url = `https://${selected_project.owner.login}.github.io/${selected_project.name}/`

    let k = "<a href=" + pages_url + " class=\"option-btn\" ><img src=\"_static/img/icon/ext.png\" />Website</a>";
    
    project_info_card.innerHTML = `
        ${selected_project.description}
        </br>
        </br>
        <div class="buttons" >
            <a href="${selected_project.html_url}" class="option-btn" ><img src="_static/img/icon/github.png" />Github</a>
            ${selected_project.has_pages ? k : ""}
        </div>
    `
}

async function getProjects() {
    project_list = await fetch("https://api.github.com/users/Alex461538/repos").then((response) => {
        if (response.status >= 400 && response.status < 600) {
            console.error("Bad response from server");
            return []
        }
        return response.json();
    }).then((data) => {
        if (!Array.isArray(data))
        {
            console.error("Bad response from server");
            return []
        }
        return data;
    }).catch((error) => {
        // Your error is here!
        console.error(error)
        return []
    });

    project_list = project_list.filter(p => p.name != p.owner.login).reverse()

    printProjects( project_list.length > 0 ? project_list[0].name : "" )
}

document.addEventListener("DOMContentLoaded", () => {
    main_card = document.getElementById("main-card");
    project_list_card = document.getElementById("project-list");
    project_info_card = document.getElementById("project-info");

    getProjects()
})