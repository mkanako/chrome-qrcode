app = new Vue({
    el: '#app',
    data: {
        qr_str: '',
        qr_obj: null
    },
    mounted: function() {
        this.qr_obj = new QRCode(document.getElementById("qr"), {
            correctLevel: QRCode.CorrectLevel.L,
        });
        var vm = this;
        chrome.tabs.query({ active: true }, function(tab) {
            var url = tab[0].url;
            if (url) {
                if (RegExp('^chrome-extension:\/\/' + chrome.i18n.getMessage("@@extension_id")).test(url)) {
                    chrome.runtime.sendMessage({ ready: 1 }, function(response) {
                        vm.qr_str = response.str;
                        vm.make();
                    });
                    chrome.runtime.onMessage.addListener(
                        function(request, sender, sendResponse) {
                            if (request.str) {
                                vm.qr_str = request.str;
                                vm.make();
                            }
                        });
                } else {
                    vm.qr_str = url;
                    vm.make();
                }
            }
        })
    },
    methods: {
        make: function(event) {
            var width;
            var minWidth = 128;
            var maxWidth = 360;
            var rate = 2;
            this.qr_str = this.qr_str.toString().trim();
            if (!this.qr_str) return;
            width = this.qr_str.length * rate;
            if (width < minWidth) {
                width = minWidth
            } else if (width > maxWidth) {
                width = maxWidth
            }
            this.qr_obj._oDrawing._elCanvas.height = this.qr_obj._oDrawing._elCanvas.width = width;
            this.qr_obj._htOption.width = this.qr_obj._htOption.height = width;
            this.qr_obj.makeCode(this.qr_str);
        }
    }
})
