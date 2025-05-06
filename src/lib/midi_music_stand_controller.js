import MIDIWatcher from './midi_watcher';
import MIDIMessage from './midi_message';
import { GOTO_SLIDE, NEXT_SLIDE, PREVIOUS_SLIDE, MUSIC_STAND_REMOTE } from './constants';

class MIDIMusicStandController {
  constructor({ midiInputs, settings, messageBus }) {
    this.settings = settings;
    this.messageBus = messageBus;

    this.midiWatcher = new MIDIWatcher({
      midiInputs,
      onMIDIMessage: this.onMidiMessage.bind(this),
      messageTypes: [MIDIMessage.NOTE_ON, MIDIMessage.CONTROL_CHANGE, MIDIMessage.PROGRAM_CHANGE],
    });
  }

  start() {
    const deviceNames = Object.keys(this.settings).map((key) => this.settings[key].device);
    console.log('controller starting watch on', deviceNames);

    if (deviceNames.includes('all')) {
      this.midiWatcher.listenOnAll();
    } else {
      this.midiWatcher.listenOn(deviceNames);
    }
  }

  stop() {
    this.midiWatcher.stop();
  }

  onMidiMessage(event) {
    console.log('received', event);
    const { data, target: { name: deviceName }} = event;
    const midiMessage = new MIDIMessage(data);

    Object.keys(this.settings).forEach((key) => {
      const { triggerMessage, device } = this.settings[key];

      if (!triggerMessage) {
        return;
      }

      const trigger = new MIDIMessage(triggerMessage);
      const deviceMatches = (device === 'all' || device === deviceName);
      const messageMatches = midiMessage.matches(trigger);
      const messageMatchesExact = midiMessage.matchesExact(trigger);

      if (deviceMatches && messageMatches) {
        switch (key) {
          case PREVIOUS_SLIDE:
            if (messageMatchesExact) {
              this.sendMessage(PREVIOUS_SLIDE);
            }
            break;
          case NEXT_SLIDE:
            if (messageMatchesExact) {
              this.sendMessage(NEXT_SLIDE);
            }
            break;
          case GOTO_SLIDE:
            this.sendMessage(GOTO_SLIDE, { slide: data[1] + 1 });
            break;
        }
      }
    });
  }

  sendMessage(message, data = {}) {
    console.log('send message', message, data);
    window.postMessage({ type: MUSIC_STAND_REMOTE, message, ...data }, '*');
  }
}

export default MIDIMusicStandController;
