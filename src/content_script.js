import { withMIDIInputs, fetchSettings, injectScript } from './lib/utils';
import MIDIMusicStandController from './lib/midi_music_stand_controller';

injectScript('page_script.js');

withMIDIInputs((midiInputs) => {
  fetchSettings((settings) => {
    console.log('starting controller with', midiInputs, settings);
    new MIDIMusicStandController({
      midiInputs,
      settings,
      messageBus: chrome.runtime.connect(),
    }).start();
  })
});
