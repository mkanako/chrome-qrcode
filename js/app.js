window.onload = function() {
    // setTimeout(function() {
    qr_show = document.getElementById('qr-show')
    qr_edit = document.getElementById('qr-edit')
    textarea = document.getElementsByTagName('textarea')[0]
    qr_str = ''
    chrome.tabs.query({
        active: true
    }, function(tab) {
        var url = tab[0].url
        if (url) {
            if (RegExp('^chrome-extension:\/\/' + chrome.i18n.getMessage("@@extension_id")).test(url)) {
                chrome.runtime.sendMessage({
                    ready: 1
                }, function(response) {
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
        var canvas = document.getElementsByTagName('canvas')
        if (canvas.length) {
            document.getElementById('qr').removeChild(canvas[0])
        }
        document.getElementById('qr').appendChild(qrcanvas({
            data: str,
            cellSize: 6,
        }))
        textarea.value = str
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
        textarea.focus()
        textarea.select()
    })
    // }, 200)
}