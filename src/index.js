document.addEventListener('DOMContentLoaded', () => {

    getHogs();

    function getHogs() {
        fetch('http://localhost:3000/hogs')
        .then(response => response.json())
        .then(showHogs)
    } // function getHogs
    
    function showHogs(hogs) {
        const hogContainer = document.getElementById('hog-container');
        hogContainer.innerHTML = "";
        
        // create divs and give them the class hog-card and put their information in there, 
        // Most of the hog info is just text, but greased is a boolean, and it's better to 
        // display that as a checkbox, that is either checked if the hog is greased, or 
        // unchecked if not.
        hogs.forEach((hog) => {
            hogContainer.innerHTML += `<div class='hog-card'id="${hog.id}">
                    <h1><img src="${hog.image}"></h1>
                    <p>Name: ${hog.name}</p>
                    <p>Specialty: ${hog.specialty}</p>
                    Greased: <input type="checkbox" name="greased" class="greased-checkbox" data-check-box-id="${hog.id}" ${hog.greased ? "checked" : ""}>
                    <p>Weight: ${hog["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"]}</p>
                    <p>Highest Medal: ${hog["highest medal achieved"]}</p>
                    <button class="delete-button" data-button-id="${hog.id}">Delete Hog</button>
                </div>`;
        })
    } // function showHogs

    // create a form that will both post a new hog to the server, and render your fresh 
    // hog on the page.
    const submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', (event) => {
        event.preventDefault();
        const hogForm = event.target.parentNode;
        const inputs = hogForm.querySelectorAll('input');
        
        fetch('http://localhost:3000/hogs', {
            method: 'POST',
            body: JSON.stringify({
                name: inputs[0].value,
                specialty: inputs[1].value,
                "highest medal achieved": inputs[2].value,
                "weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water": inputs[3].value,
                image: inputs[4].value,
                greased: inputs[5].checked
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(getHogs)

        hogForm.reset();
    }) //click submit button

    const hogContainer = document.getElementById('hog-container');
    hogContainer.addEventListener('click', (event) => {
        event.preventDefault();
        
        // all of the hogs will also have delete buttons, so when a hog is deleted, it will 
        // remove its data from the server, and clear it off the page.
        if (event.target.className === 'delete-button') {
            fetch(`http://localhost:3000/hogs/${event.target.dataset.buttonId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(getHogs)
        } // if delete button

        // finish making that checkbox work so that you can grease/ungrease the hogs at 
        // will, and that actually toggles the boolean for that hog in the backend, so it 
        // persists.
        if (event.target.className === 'greased-checkbox') {
            inputs = event.target.parentNode.children;

            fetch(`http://localhost:3000/hogs/${event.target.dataset.checkBoxId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    image: inputs[0].value,
                    name: inputs[1].value,
                    specialty: inputs[2].value,
                    greased: inputs[3].checked,
                    "weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water": inputs[4].value,
                    "highest medal achieved": inputs[5].value
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(getHogs)
        } // if greased-checkbox
        
    }) // click

}) // DOMContentLoaded
