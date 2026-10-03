const refreshAlarm = 'refresh-feeds';
const refreshIntervalMinutes = 4 * 60;

export default defineBackground(() => {
  const setupRules = async () => {
    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: [
        {
          id: 1,
          priority: 1,
          action: {
            type: 'modifyHeaders',
            responseHeaders: [
              { header: 'x-frame-options', operation: 'remove' },
              { header: 'content-security-policy', operation: 'remove' },
            ],
          },
          condition: {
            resourceTypes: ['sub_frame'],
            initiatorDomains: [browser.runtime.id],
          },
        },
      ],
    });
  };

  const openInitialPage = async () => {
    await setupRules();
    const url = browser.runtime.getURL('/feed.html');
    const [tab] = await browser.tabs.query({ url });
    if (tab?.id !== undefined) {
      await browser.tabs.update(tab.id, { active: true });
      if (tab.windowId !== undefined) {
        await browser.windows.update(tab.windowId, { focused: true });
      }
      return;
    }
    await browser.tabs.create({ url });
  };

  const scheduleFeedRefresh = () => {
    browser.alarms.create(refreshAlarm, {
      periodInMinutes: refreshIntervalMinutes,
    });
  };

  browser.action.onClicked.addListener(() => {
    void openInitialPage();
  });

  browser.runtime.onInstalled.addListener(() => {
    void setupRules();
    scheduleFeedRefresh();
  });

  browser.runtime.onStartup.addListener(() => {
    void setupRules();
    scheduleFeedRefresh();
  });

  browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === refreshAlarm) {
      void browser.runtime.sendMessage({ type: refreshAlarm }).catch(() => {});
    }
  });
});
