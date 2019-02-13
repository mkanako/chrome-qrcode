window.onload = function() {
    qr_show = document.getElementById('qr-show')
    qr_edit = document.getElementById('qr-edit')
    textarea = document.getElementsByTagName('textarea')[0]
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, function(tab) {
        make(tab[0].url)
    })

    function toggle(flag) {
        qr_show.style.display = flag ? 'block' : 'none'
        qr_edit.style.display = flag ? 'none' : 'block'
    }

    function make(url) {
        var str = url.trim()
        if (str) {
            var qr = qrcode(0, 'L')
            qr.addData(str)
            qr.make()
            document.getElementById('qr').innerHTML = qr.createImgTag(4, 2)
            textarea.value = str
        }
    }
    document.getElementById('confirm').addEventListener('click', function() {
        make(textarea.value)
        toggle(1)
    })
    document.getElementById('cancle').addEventListener('click', function() {
        toggle(1)
    })
    document.getElementById('qr').addEventListener('click', function() {
        toggle(0)
        textarea.focus()
        textarea.select()
    })
}