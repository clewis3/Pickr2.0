window.onload = function() { 

	//event handeler for passwords
	var ipcRenderer = require('electron').ipcRenderer;
	ipcRenderer.on('passwords', (event, arg) => {
    	$('#admin').html(arg[0].admin);
    	$('#teacher').html(arg[1].teacher);
    	$('#ip').html(arg[2].en0);
	});

	//waits two seconds before requesting passwords
	setTimeout(function() {
		ipcRenderer.send("passwords",'get');
	}, 2000);
}

