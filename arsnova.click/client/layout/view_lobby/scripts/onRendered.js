/*
 * This file is part of ARSnova Click.
 * Copyright (C) 2016 The ARSnova Team
 *
 * ARSnova Click is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ARSnova Click is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ARSnova Click.  If not, see <http://www.gnu.org/licenses/>.*/

import {Session} from 'meteor/session';
import {Template} from 'meteor/templating';
import * as footerElements from "/client/layout/region_footer/scripts/lib.js";
import {calculateButtonCount} from './lib.js';

Template.memberlist.onRendered(function () {
	Session.set("learnerCountOverride", false);
	calculateButtonCount();

	var calculateFontSize = function () {
		var hashtagLength = Router.current().params.quizName.length;
		//take the hastag in the middle of the logo
		var titelMarginTop = $(".arsnova-logo").height();

		if (hashtagLength <= 10) {
			if ($(document).width() < 992) {
				$(".hashtag_in_title").css("font-size", "6vw");
			} else {
				$(".hashtag_in_title").css("font-size", "3vw");
			}
			$(".header-titel").css("font-size", "5vw");
			if ($(document).width() >= 1200) {
				$(".header-titel").css("margin-top", titelMarginTop * 0.2);
			}
		} else if (hashtagLength > 10 && hashtagLength <= 15) {
			if ($(document).width() < 992) {
				$(".hashtag_in_title").css("font-size", "6vw");
			} else {
				$(".hashtag_in_title").css("font-size", "3vw");
			}
			$(".header-titel").css("font-size", "4vw");
			$(".header-titel").css("margin-top", titelMarginTop * 0.4);
		} else {
			if ($(document).width() < 992) {
				$(".hashtag_in_title").css("font-size", "4vw");
			} else {
				$(".hashtag_in_title").css("font-size", "2vw");
			}

			$(".header-titel").css("font-size", "2.5vw");
			$(".header-titel").css("margin-top", titelMarginTop * 0.6);
		}
	}();
	$(window).resize(calculateFontSize);

	footerElements.removeFooterElements();
	footerElements.addFooterElement(footerElements.footerElemHome);
	footerElements.addFooterElement(footerElements.footerElemSound);
	footerElements.addFooterElement(footerElements.footerElemQRCode);
	footerElements.addFooterElement(footerElements.footerElemTheme);
	footerElements.addFooterElement(footerElements.footerElemReadingConfirmation);
	footerElements.addFooterElement(footerElements.footerElemImprint);
	footerElements.addFooterElement(footerElements.footerElemFullscreen);
	footerElements.addFooterElement(footerElements.footerElemAbout);
	footerElements.addFooterElement(footerElements.footerElemTos);
	footerElements.addFooterElement(footerElements.footerElemDataPrivacy);
	footerElements.calculateFooter();
});

Template.learner.onRendered(function () {
	calculateButtonCount();
});
