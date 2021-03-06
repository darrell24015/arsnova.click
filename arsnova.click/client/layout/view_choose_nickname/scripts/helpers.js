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

import {Template} from 'meteor/templating';
import {Router} from 'meteor/iron:router';
import {SessionConfigurationCollection} from "/lib/session_configuration/collection.js";
import {NicknameCategoriesCollection} from "/lib/nickname_categories/collection.js";
import {MemberListCollection, userNickSchema} from "/lib/member_list/collection.js";

Template.nickViewWrapper.helpers({
	getRequiredNickView: function () {
		const configDoc = SessionConfigurationCollection.findOne({hashtag: Router.current().params.quizName});
		if (!configDoc) {
			return null;
		}
		if (configDoc.nicks.selectedValues.length === 0) {
			return Template.nick;
		} else {
			return Template.nickLimited;
		}
	}
});

Template.nick.helpers({
	getUserNickSchema: function () {
		return userNickSchema;
	}
});

Template.nickStandardFooter.helpers({
	getFooterConfig: function () {
		const configDoc = SessionConfigurationCollection.findOne({hashtag: Router.current().params.quizName});
		if (!configDoc) {
			return null;
		}
		const footerConfig = {
			backButton: {
				id: "backButton"
			}
		};
		if (configDoc.nicks.restrictToCASLogin) {
			footerConfig.forwardButton = {
				text: "Login via CAS",
				id: "loginViaCas"
			};
		} else {
			footerConfig.forwardButton = {
				id: "forwardButton"
			};
		}
		return footerConfig;
	}
});

Template.nickLimited.helpers({
	getSelectableNicks: function () {
		return NicknameCategoriesCollection.find({
			nick: {
				$in: SessionConfigurationCollection.findOne({hashtag: Router.current().params.quizName}, {fields: {nicks: 1}}).nicks.selectedValues
			}
		}, {
			sort: {
				nick: 1
			}
		}).fetch().filter(function (item) {
			return !MemberListCollection.findOne({hashtag: Router.current().params.quizName, nick: item.nick});
		});
	},
	getFooterConfig: function () {
		return {
			backButton: {
				id: "backButton"
			}
		};
	}
});
