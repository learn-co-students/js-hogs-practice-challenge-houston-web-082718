document.addEventListener('DOMContentLoaded', () => {

    getHogs()
    getNewHogForm().addEventListener('submit', event => newHog(event));
    getEditHogForm().addEventListener('submit', event => {
        submitEditHog(event)
    });

})

function getHogs() {
    fetch('http://localhost:3000/hogs').then(resp => resp.json()).then(renderHogs).then(addDeleteListener).then(addEditListener)
}

function renderHogs(data) {
    const hogContainer = getHogsContainer();
    hogContainer.innerHTML = `
    <table>
        <thead>
            <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Specialty</th>
                <th>Medal</th>
                <th>Weight</th>
                <th>Greased?</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tbody id="hogs-list">
            ${hogsList(data)}
        </tbody>
    </table>`

}

function getHogsContainer() {
    return document.getElementById('hog-container');
}

function getNewHogForm() {
    return document.getElementById('new-hog-form');
}

function getEditHogForm() {
    return document.getElementById('edit-hog');
}

function hogsList(data) {
    let hogsList = ""

    data.forEach(hog => {

        hogsList += `
        <tr id="hog" data-hog-id="${hog.id}">
            <td><img src="${hog.image}"></td>
            <td>${hog.name}</td>
            <td>${hog.specialty}</td>
            <td>${hog['highest medal achieved']}</td>
            <td>${hog["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"]}</td>
            <td>${hog.greased}</td>
            <td><button>Edit</button></td>
            <td><button>Delete</button></td>
        </tr>`

    });

    return hogsList
}

function addDeleteListener() {

    Array.from(document.querySelectorAll('#hog')).forEach(node => {
        let hogRowArray = Array.from(node.children);

        hogRowArray[hogRowArray.length - 1].children[0].addEventListener('click', event => {

            //do a fetch 'DELETE' request to delete this row
            //Then either take it out of DOM or call get hogs again
            deleteHog(event.target.parentNode.parentNode.dataset.hogId);
        });
    })

};

function addEditListener() {

    Array.from(document.querySelectorAll('#hog')).forEach(node => {
        let hogRowArray = Array.from(node.children);
        hogRowArray[hogRowArray.length - 2].children[0].addEventListener('click', event => {
            editHog(event.target.parentNode.parentNode);
        });
    })
}

function deleteHog(id) {
    fetch(`http://localhost:3000/hogs/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    }).then(() => getHogs())
}

function editHog(params) {

    document.getElementById('new-hog').style.display = 'none';
    let editHog = getEditHogForm();
    let editHogForm = document.getElementById('edit-hog-form')
    editHog.style.display = 'flex';


    editHogForm.children[0].value = params.children[1].innerHTML;
    editHogForm.children[2].value = params.children[2].innerHTML;
    editHogForm.children[4].value = params.children[3].innerHTML;
    editHogForm.children[6].value = params.children[4].innerHTML;
    editHogForm.children[8].value = './'.concat(params.children[0].children[0].src.slice(78));

    editHogForm.children[10].children[0].checked = params.children[5].innerHTML;
    editHogForm.children[12].value = params.dataset.hogId;

    //Name, Specialty, medal, weight, image, greased


}

function switchToNewForm() {
    document.getElementById('new-hog').style.display = 'flex';
    document.getElementById('edit-hog-form').style.display = 'none';
}

function newHog(e) {
    //fetch request with a post and put in the information in the body
    e.preventDefault();
    let data = {
        name: e.target.name.value,
        specialty: e.target.specialty.value,
        greased: e.target.greased.checked,
        "weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water": e.target.weight.value,
        "highest medal achieved": e.target.medal.value,
        image: e.target.img.value
    }

    fetch('http://localhost:3000/hogs', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(data)
    }).then(getHogs).then(getNewHogForm().reset())

    //clear the form and get request for the new hogs
}

function submitEditHog(e) {
    //fetch with patch and put the information in the body
    //switch back to the new form and get request for the hogs
    e.preventDefault();
    let data = {
        name: e.target.name.value,
        specialty: e.target.specialty.value,
        greased: e.target.greased.checked,
        "weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water": e.target.weight.value,
        "highest medal achieved": e.target.medal.value,
        image: e.target.img.value
    }



    fetch(`http://localhost:3000/hogs/${e.target.id.value}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(data)
    }).then(getHogs).then(document.getElementById('edit-hog-form').reset()).then(switchToNewForm)
}