const Nightmare = require('nightmare');

Nightmare.action('focus', function(selector, done) {
  this.evaluate_now(
    sel => {
      document.activeElement.blur();
      const element = document.querySelector(sel);
      element.focus();
    },
    done,
    selector
  );
});

Nightmare.action('touch', function(selector, done) {
  this.evaluate_now(
    sel => {
      const obj = document.querySelector(sel);
      const t = new Touch({
        identifier: Date.now(),
        target: obj,
        clientX: 100,
        clientY: 100,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 10,
        force: 0.5,
      });
      const touchEvent = new TouchEvent('touchend', {
        cancelable: true,
        bubbles: true,
        touches: [t],
        targetTouches: [],
        changedTouches: [t],
        shiftKey: true,
      });
      obj.dispatchEvent(touchEvent);
    },
    done,
    selector
  );
});
