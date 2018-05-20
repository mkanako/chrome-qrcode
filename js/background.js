(function() {
    var extensionId = chrome.i18n.getMessage("@@extension_id")
    var popup_tabId, str
    chrome.contextMenus.create({
        "title": "生成二维码",
        "contexts": ["link", "selection"],
        "onclick": function(info, tab) {
            str = info.linkUrl || info.selectionText
            str = str.toString().trim()
            if (str) {
                if (popup_tabId) {
                    chrome.tabs.update(popup_tabId, {
                        active: true
                    }, function(tab) {
                        if (chrome.runtime.lastError) {
                            console.log(chrome.runtime.lastError.message)
                            chrome.tabs.create({
                                active: true,
                                url: 'chrome-extension://' + extensionId + '/popup.html'
                            }, function(tab) {
                                popup_tabId = tab.id
                            })
                        } else {
                            // chrome.tabs.executeScript(popup_tabId,{code:'app.qr_str=\''+str+'\'app.make()'})
                            chrome.runtime.sendMessage({
                                str: str
                            })
                        }
                    })
                } else {
                    chrome.tabs.create({
                        active: true,
                        url: 'chrome-extension://' + extensionId + '/popup.html'
                    }, function(tab) {
                        popup_tabId = tab.id
                    })
                }
            }
        }
    })
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension")
        if (request.ready && str) {
            sendResponse({
                str: str
            })
        }
    })
})()