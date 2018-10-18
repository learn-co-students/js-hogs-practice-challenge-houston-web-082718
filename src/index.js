document.addEventListener('DOMContentLoaded', function() {
	function fetchAndRender() {
		fetch('http://localhost:3000/hogs')
			.then(resp => resp.json())
			.then(data => (hogs = data))
			.then(card => {
				hogContainer = document.getElementById('hog-container');
				hogContainer.innerHTML = '';
				hogs.forEach(hog => {
					hogCard(hog);
				});
			});
	}
	fetchAndRender();

	function hogCard(hog) {
		if (hog.greased) {
			var greased = 'checked';
		} else {
			var greased = '';
		}
		hogContainer.innerHTML += `
        <div id=${hog.id}><br><hr><h2>${hog.name}</h2><p>Specialty: ${
			hog.specialty
		}</p><p>Weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water: ${
			hog[
				'weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water'
			]
		}</p><p>Highest medal achieved: ${hog['highest medal achieved']}</p>
        Greased: <input id='${
			hog.id
		}checkbox' type="checkbox" name="greased" ${greased}>
        <br><img src=${hog.image}>
        <button class='delete'>Delete</button>
        </div>
         `;
	}

	hogForm = document.querySelector('.hog-form');
	hogForm.addEventListener('submit', function(event) {
		event.preventDefault();
		debugger;
		const data = {
			name: event.target.name.value,
			specialty: event.target.specialty.value,
			'highest medal achieved': event.target.medal.value,
			'weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water': parseInt(
				event.target.weight.value
			),
			image: event.target.img.value,
			greased: event.target.greased.checked
		};
		fetch('http://localhost:3000/hogs', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then(data => {
				hogContainer.innerHTML = '';
			})
			.then(fetchAndRender);
	});

	function deleteHog(hogID) {
		fetch(`http://localhost:3000/hogs/${hogID}`, {
			method: 'DELETE'
		}).then(fetchAndRender);
	}

	function toggleCheckbox(hogID) {
		greased = hogs[hogID].greased;
		data = {greased: !greased};
		fetch(`http://localhost:3000/hogs/${hogID}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(data)
		});
	}

	document.addEventListener('click', function(event) {
		if (event.target.className === 'delete') {
			let hogID = event.target.parentNode.id;
			deleteHog(hogID);
		} else if (event.target.type === 'checkbox') {
			let hogID = event.target.parentNode.id;
			toggleCheckbox(hogID);
		}
	});
});
