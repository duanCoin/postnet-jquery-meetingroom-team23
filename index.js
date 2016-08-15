function showMessage(message) {
    $("#console").text(message);
    $('#input').val('');
    $('#input').select();
}
let mainMenu = '';
let state = 'chose';
let choseType = '';

function send() {
    let input = $("#input").val();

    if (state === 'chose') {
        if (input === '3') {
            showMessage('');
            $('#input').attr("disabled", true);
            $('button').attr("disabled", true);
        } else {
            $.ajax({
                url: 'http://localhost:3000/chose/' + input,
                
                success: function (data) {
                    if (data !== 'Please give right input:') {
                        state = 'translate';
                        choseType = input;
                    }
                    showMessage(data);
                }
            });
        }

    } else if (state === 'translate') {
        if (choseType === '1') {
            translate('http://localhost:3000/zipcode-to-barcode/' + input, 'zipcode');
        } else if (choseType === '2') {
            translate('http://localhost:3000/barcode-to-zipcode/' + input, 'barcode')
        }
    }
}

function translate(url, codeType) {
    $.ajax({
        url: url,
        success: function (data) {
            if (data === false) {
                data = 'Please give right ' + codeType;
            } else {
                state = 'chose';
                data += `
${mainMenu}`;
            }
            showMessage(data);
        }
    });
}

function start() {
    $.get('http://localhost:3000/main-menu', function (data) {
        mainMenu = data;
        showMessage(mainMenu);
    });
}

start();

