import MIDIMessage from './midi_message';

class MIDIWatcher {
  constructor({ midiInputs, onMIDIMessage, messageTypes }) {
    this.midiInputs = midiInputs;
    this.onMIDIMessage = onMIDIMessage;
    this.messageTypes = messageTypes;
    this.midiMessageReceived = this.midiMessageReceived.bind(this);
  }

  listenOnAll() {
    this.midiInputs.forEach((input) => {
      input.onmidimessage = this.midiMessageReceived;
    });

    console.log('Listening on all devices');
  }

  listenOn(deviceNameOrNames) {
    const deviceNames = [deviceNameOrNames].flat();

    this.stop();
    this.midiInputs
      .filter((input) => deviceNames.includes(input.name))
      .forEach((input) => input.onmidimessage = this.midiMessageReceived);

    console.log('Listening on devices', deviceNameOrNames);
  }

  stop() {
    this.midiInputs.forEach((input) => input.onmidimessage = null);
  }

  midiMessageReceived(event) {
    const midiMessage = new MIDIMessage(event.data);

    if (this.messageTypes.includes(midiMessage.type)) {
      this.onMIDIMessage(event);
    }
  }
}

export default MIDIWatcher;
