/**
 * @name jQuery-Absolute-Progressbar
 * @author: AbsolutePlugins
 * @authorURL https://absoluteplugins.com
 * @version 1.0.0
 * @license GPL-3.0-or-later
 *
 */
(function ($, window) {
  "use strict";
  /**
   *
   * @param {$|HTMLElement} el
   * @param {Object} opts
   */

  function ProgressBar(el, opts = {}) {
    const self = this;
    self.el = $(el); // noinspection JSValidateTypes

    /**
     * @param {string}[which]
     * @return {*}
     */

    const getData = which => self.el.data(which);

    const _opts$value = opts.value,
          value = _opts$value === void 0 ? getData("value") : _opts$value,
          _opts$showTitle = opts.showTitle,
          showTitle = _opts$showTitle === void 0 ? true : _opts$showTitle,
          _opts$titleEl = opts.titleEl,
          titleEl = _opts$titleEl === void 0 ? $("<h4/>") : _opts$titleEl,
          _opts$titleContent = opts.titleContent,
          titleContent = _opts$titleContent === void 0 ? getData("title") : _opts$titleContent,
          _opts$radius = opts.radius,
          radius = _opts$radius === void 0 ? getData("radius") || "6" : _opts$radius,
          _opts$height = opts.height,
          height = _opts$height === void 0 ? getData("height") || "6" : _opts$height,
          _opts$background = opts.background,
          background = _opts$background === void 0 ? getData("background") || "transparent" : _opts$background,
          _opts$fill = opts.fill,
          fill = _opts$fill === void 0 ? getData("fill") || "linear-gradient(to left, #148cfa, #64f5d2)" : _opts$fill,
          _opts$border = opts.border,
          border = _opts$border === void 0 ? getData("border") || "#eee" : _opts$border,
          _opts$style = opts.style,
          style = _opts$style === void 0 ? getData("tooltip") ? "tooltip" : "inline" : _opts$style,
          _opts$easing = opts.easing,
          easing = _opts$easing === void 0 ? getData("easing") || "swing" : _opts$easing,
          _opts$duration = opts.duration,
          duration = _opts$duration === void 0 ? getData("duration") || 1500 : _opts$duration,
          _opts$autoplay = opts.autoplay,
          autoplay = _opts$autoplay === void 0 ? false !== getData("autoplay") : _opts$autoplay,
          _opts$useWayPoint = opts.useWayPoint,
          useWayPoint = _opts$useWayPoint === void 0 ? false !== getData("waypoint") : _opts$useWayPoint,
          _opts$wayPointOffset = opts.wayPointOffset,
          wayPointOffset = _opts$wayPointOffset === void 0 ? getData("waypoint-offset") || "bottom-in-view" : _opts$wayPointOffset,
          _opts$isRtl = opts.isRtl,
          isRtl = _opts$isRtl === void 0 ? "rtl" === document.dir : _opts$isRtl,
          _opts$onInit = opts.onInit,
          onInit = _opts$onInit === void 0 ? function () {} : _opts$onInit,
          _opts$onAnimationStar = opts.onAnimationStart,
          onAnimationStart = _opts$onAnimationStar === void 0 ? function () {} : _opts$onAnimationStar,
          _opts$onProgress = opts.onProgress,
          onProgress = _opts$onProgress === void 0 ? function () {} : _opts$onProgress,
          _opts$onAfterProgress = opts.onAfterProgress,
          onAfterProgress = _opts$onAfterProgress === void 0 ? function () {} : _opts$onAfterProgress,
          _opts$onComplete = opts.onComplete,
          onComplete = _opts$onComplete === void 0 ? function () {} : _opts$onComplete,
          _opts$onError = opts.onError,
          onError = _opts$onError === void 0 ? function () {} : _opts$onError,
          _opts$onEnd = opts.onEnd,
          onEnd = _opts$onEnd === void 0 ? function () {} : _opts$onEnd; // Incas invoked directly with options.

    self.el.addClass("progress-" + style); // Setup.

    self.bar = self.el.find(".ab-progress-bar");
    self.title = self.el.find(".progress-title");
    self.indecator = self.el.find(".progress-indicator");
    self.numWrap = self.indecator.find(".progress-indicator-inner");
    self.number = self.indecator.find(".percent");

    const init = function () {
      if ($.isFunction(onInit)) {
        onInit.call(self);
      }

      if (!self.title.length && showTitle) {
        self.title = $(titleEl).addClass("progress-title");
        self.title.text(titleContent);
        self.el.html(self.title);
      }

      if (!self.indecator.length) {
        self.indecator = $("<div/>").addClass("progress-indicator");
        self.title.after(self.indecator);
      }

      if (!self.number.length) {
        self.number = $('<span class="percent"></span>');
        self.number.appendTo(self.indecator);
        self.number.wrap('<div class="progress-indicator-inner"/>');
        self.numWrap = self.number.parent();

        if ("tooltip" === style) {
          self.number.after('<span class="down-arrow"/>');
        }
      }

      if (!self.bar.length) {
        self.bar = $("<div/>").addClass("ab-progress-bar");
        self.indecator.after(self.bar);
        self.bar.wrap('<div class="progress-bar-wrap"/>');
        self.wrap = self.el.find(".progress-bar-wrap");
      }

      if (isRtl) {
        self.el.addClass("progress-rtl");
      }

      if (autoplay) {
        if (useWayPoint && window.Waypoint) {
          /**
           * Any of WayPoint Adapters will work the same.
           * Offset can be set vai options.
           * @see http://imakewebthings.com/waypoints/api/offset-option/
           */
          new Waypoint({
            element: self.el[0],
            handler: function () {
              self.start();
              this.destroy();
            },
            offset: wayPointOffset
          });
        } else {
          self.start();
        }
      }
    };

    self.started = false;
    self.stopped = null;
    self.animator = null;
    self.progress = 0;

    self.start = function () {
      if (self.started) {
        return;
      }

      self.animator = $({
        Progress: self.progress
      }).animate({
        Progress: value
      }, {
        duration,
        easing,
        start: function () {
          if ($.isFunction(onAnimationStart)) {
            onAnimationStart.call(self, arguments);
          }
        },
        step: function () {
          if ($.isFunction(onProgress)) {
            onProgress.call(self, arguments);
          }
        },
        progress: function () {
          const self2 = this;
          self.progress = self2.Progress;
          self.number.text((isRtl ? "%#" : "#%").replace("#", Math.ceil(self2.Progress).toString()));
          self.bar.css({
            width: self2.Progress + "%",
            "--progressbar-radius": radius + "px",
            "--progressbar-height": height + "px",
            "--progressbar-fill": fill,
            "--progressbar-border": border
          });
          self.wrap.css({
            "--progressbar-radius": radius + "px",
            "--progressbar-height": height + "px",
            "--progressbar-background": background,
            "--progressbar-border": border
          });
          self.numWrap.css({
            left: self2.Progress + "%"
          });

          if ($.isFunction(onAfterProgress)) {
            onAfterProgress.call(self, arguments);
          }
        },
        complete: function () {
          if ($.isFunction(onComplete)) {
            onComplete.call(self, arguments);
          }
        },
        fail: function () {
          if ($.isFunction(onError)) {
            onError.call(self, arguments);
          }
        },
        always: function () {
          if ($.isFunction(onEnd)) {
            onEnd.call(self, arguments);
          }
        }
      });
      self.started = true;
      self.stopped = false;
    };
    /**
     *
     * Stops the animation
     * @see https://api.jquery.com/stop/
     *
     * @param {boolean=false} [clearQueue]
     * @param {boolean=false} [jumpToEnd]
     */


    self.stop = function (clearQueue = false, jumpToEnd = false) {
      if (!self.stopped) {
        self.animator.stop(clearQueue, jumpToEnd);
        self.started = false;
        self.stopped = true;
      }
    };

    init();
  } // jQuery Handler


  $.fn.progressBar = function (options = {}) {
    $(this).each(function () {
      const progressBar = new ProgressBar(this, options);
      $(this).data("progressBar", progressBar);
    });
  }; // Auto init with data attribute.


  $(document).ready(function () {
    $("[data-progress]").progressBar();
  });
})(jQuery, window);
//# sourceMappingURL=progressBar.js.map
