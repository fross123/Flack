// Get value of display_name from local storage
if (!localStorage.getItem('display_name')) {
	localStorage.setItem('display_name', "");
	localStorage.setItem('display_name_created', false)
}

// Load current display_name
document.addEventListener('DOMContentLoaded', () => {

	var display_name = localStorage.getItem('display_name');
	var display_name_created = localStorage.getItem('display_name_created');

	if (!display_name_created) {
		load_page('channels');
	}

	//update display_name with text input
	document.querySelector('#form').onsubmit = () => {
		const name = document.querySelector('#name').value;
		display_name = name;
		display_name_created = true;
		localStorage.setItem('display_name', name);
		localStorage.setItem('display_name_created', true);
		load_page('channels');
		return false;
	};

	document.querySelector('#display_name').innerHTML = display_name;
});



// Update text on popping state.
window.onpopstate = e => {
	const data = e.state;
	document.title = data.title;
	document.querySelector('#body').innerHTML = data.text;
};

// Renders contents of new page in main view.
function load_page(name) {
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
}
