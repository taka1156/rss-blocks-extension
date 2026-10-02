chrome.action.onClicked.addListener(async () => {
  await setupRules();
  const url = chrome.runtime.getURL("src/feeds.html");
  const tabs = await chrome.tabs.query({ url });
  if (tabs.length) {
    chrome.tabs.update(tabs[0].id, { active: true });
    chrome.windows.update(tabs[0].windowId, { focused: true });
  } else {
    chrome.tabs.create({ url });
  }
});

// この拡張機能のページ内に埋め込むiframeに限り、埋め込み禁止ヘッダーを外す
async function setupRules() {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [{
      id: 1,
      priority: 1,
      action: {
        type: "modifyHeaders",
        responseHeaders: [
          { header: "x-frame-options", operation: "remove" },
          { header: "content-security-policy", operation: "remove" }
        ]
      },
      condition: { resourceTypes: ["sub_frame"], initiatorDomains: [chrome.runtime.id] }
    }]
  });
}
chrome.runtime.onInstalled.addListener(setupRules);
chrome.runtime.onStartup.addListener(setupRules);

const refreshAlarm = 'refresh-feeds';
const refreshIntervalMinutes = 4 * 60;

function scheduleFeedRefresh() {
  chrome.alarms.create(refreshAlarm, {
    periodInMinutes: refreshIntervalMinutes,
  });
}

chrome.runtime.onInstalled.addListener(scheduleFeedRefresh);
chrome.runtime.onStartup.addListener(scheduleFeedRefresh);
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === refreshAlarm) {
    chrome.runtime.sendMessage({ type: refreshAlarm }).catch(() => {});
  }
});
