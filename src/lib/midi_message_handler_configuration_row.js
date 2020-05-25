import { button, div, h3, option, table } from './dom_utils';
import Observable from './observable';
import Computed from './computed';
import MIDIMessage from './midi_message';

class MIDIMessageHandlerConfigurationRow {
  static DEVICE_SETTINGS_KEY = 'device';
  static TRIGGER_MESSAGE_SETTINGS_KEY = 'triggerMessage';

  constructor({ action, description, container, midiInputs, settings, onRecordToggled, saveSettings }) {
    this.action = action;
    this.onRecordToggled = onRecordToggled;
    this.recordButton = this.buildRecordButton();
    this.deviceSelector = this.buildDeviceSelector(midiInputs);
    this.triggerLabel = div();
    this.triggerMessage = new Observable(settings[this.constructor.TRIGGER_MESSAGE_SETTINGS_KEY]);

    this.device = new Observable(settings[this.constructor.DEVICE_SETTINGS_KEY] || 'all')
      .bind(this.deviceSelector)
      .addObserver(({ newValue: device }) => this.recordButton.disabled = !device);

    this.recording = new Observable(false)
      .addObserver(({ newValue: recording }) => {
        this.recordButton.innerText = (recording ? 'Recording...' : 'Record');
        this.recordButton.style.fontWeight = (recording ? 'bold' : 'normal');
        this.deviceSelector.disabled = recording;
      });

    new Computed(() => this.serializableSettings(), [this.device, this.triggerMessage])
      .addObserver(({ newValue: settings }) => saveSettings(settings));

    new Computed(() => {
      return this.formatMIDIMessage(this.triggerMessage.get());
    }, [this.triggerMessage])
      .bind(this.triggerLabel);

    this.buildUI(container, description);
  }

  serializableSettings() {
    return {
      [this.constructor.DEVICE_SETTINGS_KEY]: this.device.get(),
      [this.constructor.TRIGGER_MESSAGE_SETTINGS_KEY]: this.triggerMessage.get(),
    };
  }

  formatMIDIMessage(message) {
    if (message) {
      return (new MIDIMessage(message)).description;
    }

    return '';
  }

  buildUI(container, description) {
    container.appendChild(h3(description));
    container.appendChild(
      div(
        'suboptions',
        [
          div(
            'suboption list',
            table([
              [this.deviceSelector, this.recordButton],
            ])
          ),
          this.triggerLabel,
        ],
      )
    );
  }

  buildDeviceSelector(midiInputs) {
    const select = document.createElement('select');
    select.dataset.title = 'Select MIDI device';
    option(select, '', '- Choose a MIDI device -');
    option(select, 'all', 'All');

    for (const input of midiInputs) {
      option(select, input.id, input.name);
    }

    return select;
  }

  buildRecordButton() {
    const recordButton = button('Record');
    recordButton.addEventListener('click', () => this.toggleRecording());
    return recordButton;
  }

  setRecording(recording) {
    this.recording.set(recording);
  }

  toggleRecording() {
    this.recording.toggle();
    this.onRecordToggled(this);
  }

  assignMIDIMessage(message) {
    this.triggerMessage.set(message);
    this.recording.set(false);
  }
}

export default MIDIMessageHandlerConfigurationRow;
