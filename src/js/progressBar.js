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
	 * @param {jQuery|HTMLElementClass} el
	 * @param {Object} opts
	 */
	function ProgressBar(el, opts = {}) {
		const self = this;

		self.el = $(el);

		const {
			autoplay = false === self.el.data("autoplay") ? false : true,
			useWayPoint = false === self.el.data("waypoint") ? false : true,
			wayPointOffset = self.el.data("waypoint-offset") ||
				"bottom-in-view",
			isRtl = "rtl" === document.dir,
			value = self.el.data("value"),
			showTitle = true,
			titleEl = $("<h4/>"),
			titleContent = self.el.data("title"),
			style = self.el.data("tooltip") ? "tooltip" : "inline",
			easing = self.el.data("easing") || "swing",
			duration = self.el.data("duration") || 1500,
			onInit = function () {},
			onAnimatinStart = function () {},
			onProgress = function () {},
			onAfterProgress = function () {},
			onComplete = function () {},
			onError = function () {},
			onEnd = function () {},
		} = opts;
		console.log(autoplay);
		// Incase invoked directly with options.
		self.el.addClass("progress-" + style);

		// Setup.

		self.bar = self.el.find(".ab-progress-bar");
		self.title = self.el.find(".progress-title");
		self.indecator = self.el.find(".progress-indecator");
		self.numWrap = self.indecator.find(".progress-indecator-inner");
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
				self.indecator = $("<div/>").addClass("progress-indecator");
				self.title.after(self.indecator);
			}

			if (!self.number.length) {
				self.number = $('<span class="percent"></span>');
				self.number.appendTo(self.indecator);

				self.number.wrap('<div class="progress-indecator-inner"/>');
				self.numWrap = self.number.parent();
				if ("tooltip" === style) {
					self.number.after('<span class="down-arrow"/>');
				}
			}

			if (!self.bar.length) {
				self.bar = $("<div/>").addClass("ab-progress-bar");
				self.indecator.after(self.bar);
				self.bar.wrap('<div class="progress-bar-wrap"/>');
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
						offset: wayPointOffset,
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

			self.animator = $({ Progress: self.progress }).animate(
				{ Progress: value },
				{
					duration,
					easing,
					start: function () {
						if ($.isFunction(onAnimatinStart)) {
							onAnimatinStart.call(self, arguments);
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

						self.number.text(
							(isRtl ? "%#" : "#%").replace(
								"#",
								Math.ceil(self2.Progress)
							)
						);

						self.bar.css({ width: self2.Progress + "%" });
						self.numWrap.css({ left: self2.Progress + "%" });

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
					},
				}
			);

			self.started = true;
			self.stopped = false;
		};

		/**
		 *
		 * Stops the animation
		 * @see https://api.jquery.com/stop/
		 *
		 * @param {boolean=false} clearQueue
		 * @param {boolean=false} jumpToEnd
		 */
		self.stop = function (clearQueue = false, jumpToEnd = false) {
			if (!self.stopped) {
				self.animator.stop(clearQueue, jumpToEnd);
				self.started = false;
				self.stopped = true;
			}
		};

		init();
	}

	// jQuery Handler
	$.fn.progressBar = function (options = {}) {
		$(this).each(function () {
			const progressBar = new ProgressBar(this, options);
			$(this).data("progressBar", progressBar);
		});
	};
	// Auto init with data attribute.
	$(document).on("ready", function () {
		$("[data-progress]").progressBar();
	});
})(jQuery, window);
