class MIDIWatcher {
  constructor({ midiInputs, onMIDIMessage }) {
    this.midiInputs = midiInputs;
    this.onMIDIMessage = onMIDIMessage;
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
    this.onMIDIMessage(event);
  }
}

export default MIDIWatcher;
