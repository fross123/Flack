// Get value of display_name from local storage
if (!localStorage.getItem('display_name'))
	localStorage.setItem('display_name', "");

// Load current display_name
document.addEventListener('DOMContentLoaded', () => {
	var display_name = localStorage.getItem('display_name');
	
	// Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
	
	// When connected
	socket.on('connect', () => {
		
		//update display_name with text input
		document.querySelector('#form').onsubmit = () => {
			const name = document.querySelector('#name').value;
			display_name = name;
			localStorage.setItem('display_name', name);
			socket.emit('register display_name', {'display_name'}: display_name);
		};
	});
	
	document.querySelector('#display_name').innerHTML = display_name;
});
