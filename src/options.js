import { withMIDIInputs } from './lib/utils';
import MIDIMessageHandlerConfigurationUI from './lib/midi_message_handler_configuration_ui';

withMIDIInputs((midiInputs) => {
  new MIDIMessageHandlerConfigurationUI({
    midiInputs,
    container: document.getElementById('midi-actions'),
  });
});
