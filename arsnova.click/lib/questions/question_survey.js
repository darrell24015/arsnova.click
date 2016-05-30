import {EJSON} from 'meteor/ejson';
import {AbstractQuestion} from './question_abstract.js';

export class SurveyQuestion extends AbstractQuestion {

	/**
	 * Constructs a RangedQuestion instance
	 * @see AbstractQuestion.constructor()
	 * @param options
	 */
	constructor (options) {
		if (typeof options.type !== "undefined" && options.type !== "SurveyQuestion") {
			throw new TypeError("Invalid construction type while creating new SurveyQuestion");
		}
		super(options);
	}

	/**
	 * Checks if the properties of this instance are valid. Checks also recursively all including AnswerOption instances
	 * and summarizes their result of calling .isValid(). Checks if the Question has exactly zero correct AnswerOptions
	 * @see AbstractQuestion.isValid()
	 * @returns {boolean} True, if the complete Question instance is valid, False otherwise
	 */
	isValid () {
		let hasValidAnswer = 0;
		this.getAnswerOptionList().forEach(function (answeroption) {
			if (answeroption.getIsCorrect()) {
				hasValidAnswer++;
			}
		});
		return super.isValid() && hasValidAnswer === 0;
	}

	/**
	 * Part of EJSON interface
	 * @see http://docs.meteor.com/api/ejson.html#EJSON-clone
	 * @returns {SurveyQuestion} An independent deep copy of the current instance
	 */
	clone () {
		return new SurveyQuestion(this.serialize());
	}

	/**
	 * Serialize the instance object to a JSON compatible object
	 * @returns {{hashtag:String,questionText:String,type:AbstractQuestion,timer:Number,startTime:Number,questionIndex:Number,answerOptionList:Array}}
	 */
	serialize () {
		return $.extend(super.serialize(), {type: "SurveyQuestion"});
	}

	/**
	 * Part of EJSON interface.
	 * @see http://docs.meteor.com/api/ejson.html#EJSON-CustomType-typeName
	 * @returns {String} The name of the instantiated class
	 */
	typeName () {
		return "SurveyQuestion";
	}
}

/**
 * Adds a custom type to Meteor's EJSON
 * @see http://docs.meteor.com/api/ejson.html#EJSON-addType
 */
EJSON.addType("SurveyQuestion", function (value) {
	return new SurveyQuestion(value);
});
