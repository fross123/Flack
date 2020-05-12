// Get value of display_name from local storage
if (!localStorage.getItem('display_name')) {
	localStorage.setItem('display_name', "");
	localStorage.setItem('display_name_created', false);
}

document.addEventListener('DOMContentLoaded', () => {
	var display_name = localStorage.getItem('display_name');
	var display_name_created = localStorage.getItem('display_name_created');

	document.querySelector('#form').onsubmit = () => {
		const request = new XMLHttpRequest();
		const name = document.querySelector('#name').value;
		display_name = name;
		display_name_created = true;

		localStorage.setItem('display_name', display_name);
		localStorage.setItem('display_name_created', display_name_created);

		request.open('POST', '/display_name');

		request.onload = () => {
			const data = JSON.parse(request.responseText);

			// Update the result
			if (data.success) {
				const contents = `Welcome ${data.name}.`
				document.querySelector('#display_name').innerHTML = contents;
				location.reload();
			}
			else {
				document.querySelector('#display_name').innerHTML = 'ERROR OCCURED.';
			}
		}

		// Add data to Send
		const data = new FormData();
		data.append('display_name', display_name);

		// Send request
		request.send(data);
		return false;
	};
});

// Update text on popping state.
window.onpopstate = e => {
	const data = e.state;
	document.title = data.title;
	document.querySelector('#body').innerHTML = data.text;
};

// Renders contents of new page in main view.
function load_page(name, display_name) {
	const request = new XMLHttpRequest();

	// Get request for "name".
	request.open('GET', `/${name}`);

	request.onload = () => {
		const response = request.responseText;
		document.querySelector('#body').innerHTML = response;

		// Push state to URL.
		document.title = name;
		history.pushState({'title': name, 'text': response}, name, name);
	};
	request.send();
};
