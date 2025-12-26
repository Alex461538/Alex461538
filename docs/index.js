let main_card = undefined
let project_list_card = undefined
let project_info_card = undefined
let project_list = []

function imageUrlToBase64(url) {
  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.blob();
    })
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));
}

async function setProjectImage(project)
{
    let banner_src_data = await imageUrlToBase64(`https://raw.githubusercontent.com/${project.owner.login}/${project.name}/refs/heads/main/banner.png`)
        .then(blob => blob)
        .catch(err => {
            return ""
        })
    
    if (!banner_src_data)
    {
        banner_src_data = await imageUrlToBase64(`https://raw.githubusercontent.com/${project.owner.login}/${project.name}/refs/heads/main/guide.png`)
        .then(blob => blob)
        .catch(err => {
            return ""
        })
    }

    if (banner_src_data)
    {
        document.getElementById("prj-info-img").src = banner_src_data
    }
    else
    {
        document.getElementById("prj-info-img").src = "_static/img/banner.png"
    }

    document.getElementById("prj-info-img").classList.add("opened")
}

async function printProjects(select_name = "")
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

    let pages_url = `https://${selected_project.owner.login}.github.io/${selected_project.name}/`;

    document.getElementById("prj-info-img").classList.remove("opened");
    document.querySelector("#project-info .descr").innerHTML = selected_project.description;
    document.querySelector("#project-info .buttons").innerHTML = `
        <a href="${selected_project.html_url}" class="option-btn" ><img src="_static/img/icon/github.png" />Github</a>
        ${selected_project.has_pages ? "<a href=" + pages_url + " class=\"option-btn\" ><img src=\"_static/img/icon/ext.png\" />Website</a>" : ""}
    `;

    setTimeout(() => {
        document.getElementById("prj-info-img").src = "_static/img/loading.gif";
        setProjectImage(selected_project)
    }, 400);
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

    await printProjects( project_list.length > 0 ? project_list[0].name : "" )
}

document.addEventListener("DOMContentLoaded", () => {
    main_card = document.getElementById("main-card");
    project_list_card = document.getElementById("project-list");
    project_info_card = document.getElementById("project-info");

    getProjects()
})