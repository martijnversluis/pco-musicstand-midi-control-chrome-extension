import { GOTO_SLIDE, NEXT_SLIDE, PREVIOUS_SLIDE } from './constants';
import { MUSIC_STAND_REMOTE } from './constants';

const STEP_DELAY_MS = 150;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class MusicStandRemote {
  constructor() {
    this.messageReceived = this.messageReceived.bind(this);
  }

  start() {
    window.addEventListener('message', this.messageReceived);
  }

  stop() {
    window.removeEventListener('message', this.messageReceived);
  }

  get previousButton() {
    return document.querySelector('#pagination button[aria-label="Previous page"]');
  }

  get nextButton() {
    return document.querySelector('#pagination button[aria-label="Next page"]');
  }

  get docIndicator() {
    const text = document.querySelector('#pagination .doc_indicator')?.textContent ?? '';
    const match = text.match(/(\d+)\s+of\s+(\d+)/i);

    if (!match) {
      return null;
    }

    return { current: parseInt(match[1], 10), total: parseInt(match[2], 10) };
  }

  messageReceived(event) {
    const { data: { type, message, slide } } = event;

    if (type !== MUSIC_STAND_REMOTE) {
      return;
    }

    console.log('message received:', event);

    switch (message) {
      case PREVIOUS_SLIDE:
        this.previousSlide();
        break;
      case NEXT_SLIDE:
        this.nextSlide();
        break;
      case GOTO_SLIDE:
        this.gotoSlide(slide);
        break;
    }
  }

  previousSlide() {
    this.previousButton?.click();
  }

  nextSlide() {
    this.nextButton?.click();
  }

  async gotoSlide(number) {
    const indicator = this.docIndicator;

    if (!indicator || number < 1 || number > indicator.total) {
      return;
    }

    const token = {};
    this.gotoToken = token;

    const maxSteps = indicator.total + 2;

    for (let step = 0; step < maxSteps; step++) {
      if (this.gotoToken !== token) {
        return;
      }

      const current = this.docIndicator?.current;

      if (current == null || current === number) {
        return;
      }

      if (current < number) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }

      await sleep(STEP_DELAY_MS);
    }
  }
}

export default MusicStandRemote;
