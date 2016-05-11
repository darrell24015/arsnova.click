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
import {EventManagerCollection} from '/lib/eventmanager/collection.js';
import {AnswerOptionCollection} from '/lib/answeroptions/collection.js';
import {MemberListCollection} from '/lib/member_list/collection.js';
import {ResponsesCollection} from '/lib/responses/collection.js';
import {QuestionGroupCollection} from '/lib/questions/collection.js';
import {HashtagsCollection} from '/lib/hashtags/collection.js';

Meteor.methods({
	'Main.killAll': function (hashtag) {
		AnswerOptionCollection.remove({hashtag: hashtag});
		MemberListCollection.remove({hashtag: hashtag});
		ResponsesCollection.remove({hashtag: hashtag});
		QuestionGroupCollection.remove({hashtag: hashtag});
		Meteor.call("EventManagerCollection.beforeClear", hashtag);
	},
	'Main.deleteEverything': function ({hashtag}) {
		HashtagsCollection.remove({hashtag: hashtag});
		AnswerOptionCollection.remove({hashtag: hashtag});
		MemberListCollection.remove({hashtag: hashtag});
		ResponsesCollection.remove({hashtag: hashtag});
		QuestionGroupCollection.remove({hashtag: hashtag});
		EventManagerCollection.remove({hashtag: hashtag});
	}
});
