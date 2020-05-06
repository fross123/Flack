// Get value of display_name from local storage
if (!localStorage.getItem('display_name'))
	localStorage.setItem('display_name', "");

// Load current display_name
document.addEventListener('DOMContentLoaded', () => {
	document.querySelector('#display_name').innerHTML = localStorage.getItem('display_name');
	
	//update display_name with text input
	document.querySelector('#form').onsubmit = () => {
		const name = document.querySelector('#name').value;
		
		document.querySelector('#display_name').innerHTML = name;
		localStorage.setItem('display_name', name);
	};
});
