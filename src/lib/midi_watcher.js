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

  listenOn(deviceIdOrIds) {
    const deviceIds = [deviceIdOrIds].flat();

    this.stop();
    this.midiInputs
      .filter((input) => deviceIds.includes(input.id))
      .forEach((input) => input.onmidimessage = this.midiMessageReceived);

    console.log('Listening on devices', deviceIds);
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
