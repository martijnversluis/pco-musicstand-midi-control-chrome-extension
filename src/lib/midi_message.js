class MIDIMessage {
  static NOTE_ON = 0b1001;
  static CONTROL_CHANGE = 0b1011;
  static PROGRAM_CHANGE = 0b1100;

  constructor(bytes) {
    this.type = bytes[0] >> 4;
    this.channel = bytes[0] & 0b1111;
    this.data_1 = bytes[1];
    this.data_2 = bytes[2];
    this.data = bytes;
  }

  get idBytes() {
    switch(this.type) {
      case MIDIMessage.NOTE_ON:
        return [];
      case MIDIMessage.CONTROL_CHANGE:
        return [this.data_1];
      case MIDIMessage.PROGRAM_CHANGE:
        return [];
    }
  }

  get valueByte() {
    switch(this.type) {
      case MIDIMessage.NOTE_ON:
        return this.data_1;
      case MIDIMessage.CONTROL_CHANGE:
        return this.data_2;
      case MIDIMessage.PROGRAM_CHANGE:
        return this.data_1;
    }
  }

  get description() {
    switch(this.type) {
      case MIDIMessage.NOTE_ON:
        return `note on [channel #${this.channelNumber}, note #${this.dataNumber}]`;
      case MIDIMessage.CONTROL_CHANGE:
        return `control change [channel #${this.channelNumber}, controller=${this.dataNumber}, value=${this.data_2}]`;
      case MIDIMessage.PROGRAM_CHANGE:
        return `program change [channel #${this.channelNumber}, program #${this.dataNumber}]`;
    }
  }

  get channelNumber() {
    return this.channel + 1;
  }

  get dataNumber() {
    return this.data_1 + 1;
  }

  matches(otherMessage, { matchChannel = true } = {}) {
    return (
      (this.type === otherMessage.type) &&
      (!matchChannel || (this.channel === otherMessage.channel)) &&
      this.idBytes.every((byte, index) => byte === otherMessage.idBytes[index])
    );
  }

  matchesExact(otherMessage, { matchChannel = true } = {}) {
    return this.matches(otherMessage, { matchChannel }) && (this.valueByte === otherMessage.valueByte);
  }
}

export default MIDIMessage;
