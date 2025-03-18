import { GOTO_SLIDE, NEXT_SLIDE, PREVIOUS_SLIDE } from './constants';
import { MUSIC_STAND_REMOTE } from './constants';

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

  get pageController() {
    return window.music_stand.page_controller;
  }

  get slideCount() {
    return document.querySelectorAll('.selected .page_group').length;
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

  gotoSlide(number) {
    if (number >= 1 && number <= this.slideCount) {
      this.pageController.currentPageGroup = number;
      this.pageController.showCurrentPageGroup();
    }
  }

  previousSlide() {
    this.pageController.previous();
  }

  nextSlide() {
    this.pageController.next();
  }
}

export default MusicStandRemote;
