import MIDIWatcher from './midi_watcher';
import MIDIMessage from './midi_message';
import { GOTO_SLIDE, NEXT_SLIDE, PREVIOUS_SLIDE } from './constants';
import { MUSIC_STAND_REMOTE } from './constants';

class MIDIMusicStandController {
  constructor({ midiInputs, settings, messageBus }) {
    this.settings = settings;
    this.messageBus = messageBus;

    this.midiWatcher = new MIDIWatcher({
      midiInputs,
      onMIDIMessage: this.onMidiMessage.bind(this)
    });
  }

  start() {
    const deviceIds = Object.keys(this.settings).map((key) => this.settings[key].device);
    console.log('controller starting watch on', deviceIds);

    if (deviceIds.includes('all')) {
      this.midiWatcher.listenOnAll();
    } else {
      this.midiWatcher.listenOn(deviceIds);
    }
  }

  stop() {
    this.midiWatcher.stop();
  }

  onMidiMessage(event) {
    console.log('received', event);
    const { data, target: { id: deviceId }} = event;
    const midiMessage = new MIDIMessage(data);

    Object.keys(this.settings).forEach((key) => {
      const settings = this.settings[key];
      const triggerMessage = new MIDIMessage(settings.triggerMessage);
      const deviceMatches = (settings.device === 'all' || settings.device === deviceId);
      const messageMatches = midiMessage.matches(triggerMessage);
      const messageMatchesExact = midiMessage.matchesExact(triggerMessage);

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
