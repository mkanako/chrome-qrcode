window.onload = function() {
    qr_obj = new QRCode(document.getElementById("qr"), {
        correctLevel: QRCode.CorrectLevel.L
    })
    qr_show = document.getElementById('qr-show')
    qr_edit = document.getElementById('qr-edit')
    textarea = document.getElementsByTagName('textarea')[0]
    qr_str = ''
    chrome.tabs.query({ active: true }, function(tab) {
        var url = tab[0].url
        if (url) {
            if (RegExp('^chrome-extension:\/\/' + chrome.i18n.getMessage("@@extension_id")).test(url)) {
                chrome.runtime.sendMessage({ ready: 1 }, function(response) {
                    if (response && response.str) {
                        qr_str = response.str
                        make()
                    }
                })
                chrome.runtime.onMessage.addListener(
                    function(request, sender, sendResponse) {
                        if (request && request.str) {
                            qr_str = request.str
                            make()
                        }
                    })
            } else {
                qr_str = url
                make()
            }
        }
    })

    function make() {
        var str = qr_str.trim()
        if (!str) return
        textarea.value = str
        var width = Math.max(200, qr_str.length);
        width = Math.min(width, 400);
        qr_obj._oDrawing._elCanvas.height = qr_obj._oDrawing._elCanvas.width = width;
        qr_obj._htOption.width = qr_obj._htOption.height = width;
        qr_obj.makeCode(str);
        qr_show.style.display = 'block'
        qr_edit.style.display = 'none'
    }
    document.getElementById('confirm').addEventListener('click', function() {
        qr_str = textarea.value
        make()
    })
    document.getElementById('cancle').addEventListener('click', function() {
        qr_show.style.display = 'block'
        qr_edit.style.display = 'none'
    })
    document.getElementById('qr').addEventListener('click', function() {
        qr_show.style.display = 'none'
        qr_edit.style.display = 'block'
    })
}
