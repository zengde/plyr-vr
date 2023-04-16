import { Plyr } from './video';

const isSingleLeftClick = function(event) {
  // Note: if you create something draggable, be sure to
  // call it on both `mousedown` and `mousemove` event,
  // otherwise `mousedown` should be enough for a button

  if (event.button === undefined && event.buttons === undefined) {
    // Why do we need `buttons` ?
    // Because, middle mouse sometimes have this:
    // e.button === 0 and e.buttons === 4
    // Furthermore, we want to prevent combination click, something like
    // HOLD middlemouse then left click, that would be
    // e.button === 0, e.buttons === 5
    // just `button` is not gonna work

    // Alright, then what this block does ?
    // this is for chrome `simulate mobile devices`
    // I want to support this as well

    return true;
  }

  if (event.button === 0 && event.buttons === undefined) {
    // Touch screen, sometimes on some specific device, `buttons`
    // doesn't have anything (safari on ios, blackberry...)

    return true;
  }

  // `mouseup` event on a single left click has
  // `button` and `buttons` equal to 0
  if (event.type === 'mouseup' && event.button === 0 &&
      event.buttons === 0) {
    return true;
  }

  if (event.button !== 0 || event.buttons !== 1) {
    // This is the reason we have those if else block above
    // if any special case we can catch and let it slide
    // we do it above, when get to here, this definitely
    // is-not-left-click

    return false;
  }

  return true;
};

/**
 * This class reacts to interactions with the canvas and
 * triggers appropriate functionality on the player. Right now
 * it does two things:
 *
 * 1. A `mousedown`/`touchstart` followed by `touchend`/`mouseup` without any
 *    `touchmove` or `mousemove` toggles play/pause on the player
 * 2. Only moving on/clicking the control bar or toggling play/pause should
 *    show the control bar. Moving around the scene in the canvas should not.
 */
class CanvasPlayerControls {
  constructor(player, canvas, options) {

    this.player = player;
    this.canvas = canvas;
    this.options = options;

    this.onMoveEnd = Plyr.bind(this, this.onMoveEnd);
    this.onMoveStart = Plyr.bind(this, this.onMoveStart);
    this.onMove = Plyr.bind(this, this.onMove);
    this.onClick = Plyr.bind(this, this.onClick);

    // canvas movements
    this.canvas.addEventListener('mousedown', this.onMoveStart);
    this.canvas.addEventListener('touchstart', this.onMoveStart);
    this.canvas.addEventListener('mousemove', this.onMove);
    this.canvas.addEventListener('touchmove', this.onMove);
    this.canvas.addEventListener('mouseup', this.onMoveEnd);
    this.canvas.addEventListener('touchend', this.onMoveEnd);
    this.canvas.addEventListener('click', this.onClick);

    this.shouldTogglePlay = false;
  }

  togglePlay() {
    this.player.togglePlay();
  }

  onClick(e) {
    e.stopPropagation();
  }

  onMoveStart(e) {

    // if the player does not have a controlbar or
    // the move was a mouse click but not left click do not
    // toggle play.
    if (this.options.disableTogglePlay || !this.player.playing || (e.type === 'mousedown' && !isSingleLeftClick(e))) {
      this.shouldTogglePlay = false;
      return;
    }

    this.shouldTogglePlay = true;
    this.touchMoveCount_ = 0;
  }

  onMoveEnd(e) {

    // We want to have the same behavior in VR360 Player and standard player.
    // in touchend we want to know if was a touch click, for a click we show the bar,
    // otherwise continue with the mouse logic.
    //
    // Maximum movement allowed during a touch event to still be considered a tap
    // Other popular libs use anywhere from 2 (hammer.js) to 15,
    // so 10 seems like a nice, round number.
    if (e.type === 'touchend' && this.touchMoveCount_ < 10) {
      return;
    }

    if (!this.shouldTogglePlay) {
      return;
    }

    // We want the same behavior in Desktop for VR360  and standard player
    if (e.type == 'mouseup') {
      this.togglePlay();
    }

  }

  onMove(e) {

     // Increase touchMoveCount_ since Android detects 1 - 6 touches when user click normally
    this.touchMoveCount_++;

    this.shouldTogglePlay = false;
  }

  dispose() {
    this.canvas.removeEventListener('mousedown', this.onMoveStart);
    this.canvas.removeEventListener('touchstart', this.onMoveStart);
    this.canvas.removeEventListener('mousemove', this.onMove);
    this.canvas.removeEventListener('touchmove', this.onMove);
    this.canvas.removeEventListener('mouseup', this.onMoveEnd);
    this.canvas.removeEventListener('touchend', this.onMoveEnd);
    this.canvas.removeEventListener('click', this.onClick);
  }
}

export default CanvasPlayerControls;
