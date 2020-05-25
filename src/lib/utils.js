const SETTINGS_KEY = 'settings';

export function fetchSettings(callback) {
  console.log('fetching extension settings...');

  chrome.storage.sync.get(SETTINGS_KEY, ({ settings: json }) => {
    console.log('fetched settings:', json);

    if (json) {
      const settings = JSON.parse(json);
      callback(settings);
    } else {
      callback({});
    }
  });
}

export function withMIDIInputs(callback) {
  console.log('requesting midi access...');

  navigator.requestMIDIAccess()
    .then((midiAccess) => {
      console.log('midi access granted');
      const inputs = Array.from(midiAccess.inputs.values());
      callback(inputs);
    })
    .catch((error) => {
      console.log('midi access denied:', error);
    });
}

export function injectScript(file) {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', chrome.extension.getURL(`/${file}`));
  document.body.appendChild(script);
}
