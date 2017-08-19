(function() {
    let element = function(id) {
        return document.getElementById(id);
    }

    // Get Elements
    let status = element('status');
    let messages = element('messages');
    let textarea = element('textarea');
    let username = element('username');
    let clear = element('clear');

    // Set default status
    let statusDefault = status.textContent;
    let setStatus = function(s) {
        // Set status
        status.textContent = s;

        if (s !== statusDefault) {
            let delay = setTimeout(function() {
                setStatus(statusDefault);
            }, 4000);
        }
    }

    // Connect to socket.io
    let socket = io.connect('http://127.0.0.1:4000');

    //Check for connection
    if (socket !== undefined) {
        console.log('Connected to socket ...');

        socket.on('output', function(data) {
            if (data.length) {
                for (let x = 0; x < data.length; x++) {
                    // Build out message  
                    let message = document.createElement('div');
                    message.setAttribute('class', 'chat-message');
                    message.innerHTML = "<strong>" + data[x].name + "</strong>:    " + data[x].message;
                    messages.appendChild(message);
                    messages.insertBefore(message, messages.firstChild);
                }
            }
        });

        // Get Status From Server
        socket.on('status', function(data) {
            // get message status
            setStatus(typeof data === 'object' ? data.message : data)

            // If status is clear
            if (data.clear) {
                textarea.value = '';
            }
        });

        // Handle Input
        textarea.addEventListener('keydown', function() {
            if (event.which === 13 && event.shiftKey == false) {
                // Emit to server input
                socket.emit('input', {
                    name: username.value,
                    message: textarea.value
                });

                event.preventDefault();
            }
        });

        // Handle Chat Clear
        clear.addEventListener('click', function() {
            socket.emit('clear');
        });

        // Clear Message
        socket.on('cleared', function() {
            messages.textContent = '';
        });
    }
})();