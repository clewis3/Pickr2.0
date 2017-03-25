window.onload = function() { $.get("http://ipinfo.io", function(response) {
	$('#ip').html(response.ip);
	}, "jsonp");

	var ipcRenderer = require('electron').ipcRenderer;
	ipcRenderer.on('passwords', (event, arg) => {
    	console.log(arg);
    	$('#admin').html(arg[0].admin);
    	$('#teacher').html(arg[1].teacher);
	});

	setTimeout(function() {
		ipcRenderer.send("passwords",'get');
	}, 2000);
}

