import MIDIWatcher from './midi_watcher';
import MIDIMessageHandlerConfigurationRow from './midi_message_handler_configuration_row';
import { GOTO_SLIDE, NEXT_SLIDE, PREVIOUS_SLIDE } from './constants';
import MIDIMessage from './midi_message';

class MIDIMessageHandlerConfigurationUI {
  static ACTION_DESCRIPTIONS = {
    [PREVIOUS_SLIDE]: 'Go to previous slide',
    [NEXT_SLIDE]: 'Go to next slide',
    [GOTO_SLIDE]: 'Go to slide #',
  };

  static SETTINGS_KEY = 'settings';

  get actions() {
    return Object.keys(this.constructor.ACTION_DESCRIPTIONS);
  }

  constructor({ container, midiInputs }) {
    this.onMidiMessage = this.onMidiMessage.bind(this);
    this.container = container;
    this.midiInputs = midiInputs;

    this.midiWatcher = new MIDIWatcher({
      midiInputs,
      onMIDIMessage: this.onMidiMessage,
      messageTypes: [MIDIMessage.NOTE_ON, MIDIMessage.CONTROL_CHANGE, MIDIMessage.PROGRAM_CHANGE],
    });

    this.constructor.fetchSettings((settings) => {
      this.settings = settings;
      this.buildRows();
    });
  }

  static fetchSettings(callback) {
    chrome.storage.sync.get(this.SETTINGS_KEY, ({ settings: json }) => {
      if (json) {
        const settings = JSON.parse(json);
        callback(settings);
      } else {
        callback({});
      }
    });
  }

  static storeSettings(settings, callback) {
    console.log('save:', settings);
    chrome.storage.sync.set({[this.SETTINGS_KEY]: JSON.stringify(settings)}, callback);
  }

  storeActionSettings(action, settings) {
    this.settings = {
      ...this.settings,
      [action]: settings
    };

    this.constructor.storeSettings(this.settings);
  }

  buildRows() {
    this.rows = this.actions.reduce((rows, action) => {
      const row = new MIDIMessageHandlerConfigurationRow({
        action,
        container: this.container,
        midiInputs: this.midiInputs,
        settings: this.settings[action] || {},
        description: this.constructor.ACTION_DESCRIPTIONS[action],
        onRecordToggled: (action) => this.onRecordToggled(action),
        saveSettings: (settings) => this.storeActionSettings(action, settings)
      });

      return {...rows, [action]: row};
    }, {});
  }

  onRecordToggled(row) {
    if (row.recording.get()) {
      this.actions.filter((action) => action !== row.action).forEach((action) => {
        this.rows[action].setRecording(false);
      });

      this.listenOnDevice(row.device.get());
    } else {
      this.midiWatcher.stop();
    }

    this.midiInputs.forEach((input) => {
      console.log(input.name, input.onmidimessage ? 'listening' : '-');
    });
  }

  listenOnDevice(deviceName) {
    switch (deviceName) {
      case 'none':
        break;
      case 'all':
        this.midiWatcher.listenOnAll();
        break;
      default:
        this.midiWatcher.listenOn(deviceName);
    }
  }

  onMidiMessage({ data }) {
    this.midiWatcher.stop();

    this.actions.forEach((action) => {
      const row = this.rows[action];

      if (row.recording.get()) {
        row.assignMIDIMessage(data);
      }
    });
  }
}

export default MIDIMessageHandlerConfigurationUI;
