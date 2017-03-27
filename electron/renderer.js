window.onload = function() { 

	//gets the users ip adress
	$.get("http://ipinfo.io", function(response) {
		$('#ip').html(response.ip);
	}, "jsonp");

	//event handeler for passwords
	var ipcRenderer = require('electron').ipcRenderer;
	ipcRenderer.on('passwords', (event, arg) => {
    	$('#admin').html(arg[0].admin);
    	$('#teacher').html(arg[1].teacher);
	});

	//waits two seconds before requesting passwords
	setTimeout(function() {
		ipcRenderer.send("passwords",'get');
	}, 2000);
}

