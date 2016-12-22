var tabId;
var str;
chrome.contextMenus.create({
    "title": "生成二维码",
    "contexts": ["link", "selection"],
    "onclick": function(info, tab) {
        str = info.linkUrl || info.selectionText;
        str = str.toString().trim();
        if (str) {
            if (tabId) {
                chrome.tabs.update(tabId, {
                    active: true,
                    // url: 'chrome-extension://' + chrome.i18n.getMessage("@@extension_id") + '/popup.html'
                }, function(tab2) {
                    if (chrome.runtime.lastError) {
                        console.log(chrome.runtime.lastError.message);
                        chrome.tabs.create({
                            active: true,
                            url: 'chrome-extension://' + chrome.i18n.getMessage("@@extension_id") + '/popup.html'
                        }, function(tab3) {
                            tabId = tab3.id;
                        });
                    } else {
                        // chrome.tabs.executeScript(tabId,{code:'app.qr_str=\''+str+'\';app.make();'});
                        chrome.runtime.sendMessage({ str: str });
                    }
                });
            } else {
                chrome.tabs.create({
                    active: true,
                    url: 'chrome-extension://' + chrome.i18n.getMessage("@@extension_id") + '/popup.html'
                }, function(tab2) {
                    tabId = tab2.id;
                });
            }
        }
    }
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (request.ready && str)
        sendResponse({ str: str });
});
