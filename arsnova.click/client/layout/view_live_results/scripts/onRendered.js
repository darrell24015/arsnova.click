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

import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import {Template} from 'meteor/templating';
import {EventManagerCollection} from '/lib/eventmanager/collection.js';
import * as localData from '/lib/local_storage.js';
import * as footerElements from "/client/layout/region_footer/scripts/lib.js";
import {calculateButtonCount} from './lib.js';

Template.liveResults.onRendered(()=> {
	if (localData.containsHashtag(Router.current().params.quizName) && EventManagerCollection.findOne() && EventManagerCollection.findOne().readingConfirmationIndex === -1) {
		Meteor.call("EventManagerCollection.showReadConfirmedForIndex", Router.current().params.quizName, 0);
	}
	Session.set("LearnerCountOverride", false);
	calculateButtonCount();
	$(window).resize(function () {
		calculateButtonCount();
		Session.set("LearnerCountOverride", false);
	});

	footerElements.removeFooterElements();
	if (localData.containsHashtag(Router.current().params.quizName)) {
		footerElements.addFooterElement(footerElements.footerElemHome);
		footerElements.addFooterElement(footerElements.footerElemSound);
		footerElements.addFooterElement(footerElements.footerElemFullscreen);
		footerElements.addFooterElement(footerElements.footerElemImprint);
	}
	footerElements.calculateFooter();
});

Template.readingConfirmedLearner.onRendered(function () {
	calculateButtonCount();
});
