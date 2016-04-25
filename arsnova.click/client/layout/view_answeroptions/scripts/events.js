import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { TAPi18n } from 'meteor/tap:i18n';
import { EventManager } from '/lib/eventmanager.js';
import { AnswerOptions } from '/lib/answeroptions.js';
import * as localData from '/client/lib/local_storage.js';
import { splashscreen_error } from '/client/plugins/splashscreen/scripts/lib.js';
import { parseAnswerOptionInput } from './lib.js';

Template.createAnswerOptions.events({
    "click .toggleCorrect": function (event) {
        if (this.isCorrect) {
            this.isCorrect = 0;
            $(event.currentTarget.firstElementChild).removeClass("check-mark-checked");
            $(event.currentTarget.firstElementChild).addClass("check-mark-unchecked");
        }
        else {
            this.isCorrect = 1;
            $(event.currentTarget.firstElementChild).removeClass("check-mark-unchecked");
            $(event.currentTarget.firstElementChild).addClass("check-mark-checked");
        }
    },
    "click #addAnswerOption": function () {
        var answerOptionsCount = AnswerOptions.find({questionIndex: EventManager.findOne().questionIndex}).count();
        if (answerOptionsCount < 26) {
            const answerOption = {
                privateKey: localData.getPrivateKey(),
                hashtag: Session.get("hashtag"),
                questionIndex: EventManager.findOne().questionIndex,
                answerText: "",
                answerOptionNumber: answerOptionsCount,
                isCorrect: 0
            };

            Meteor.call('AnswerOptions.addOption', answerOption, (err) => {
                if (err) {
                    $('.errorMessageSplash').parents('.modal').modal('show');
                    $("#errorMessage-text").html(err.reason);
                } else {
                    localData.addAnswers(answerOption);

                    $("#deleteAnswerOption").removeClass("hide");

                    answerOptionsCount++;
                    if (answerOptionsCount > 25) {
                        $("#addAnswerOption").addClass("hide");
                    }

                    $('.answer-options').scrollTop($('.answer-options')[0].scrollHeight);
                }
            });
        }
    },
    "click #deleteAnswerOption": function () {
        var answerOptionsCount = AnswerOptions.find({questionIndex: EventManager.findOne().questionIndex}).count();
        if (answerOptionsCount > 1) {
            $("#addAnswerOption").removeClass("hide");

            Meteor.call('AnswerOptions.deleteOption', {
                privateKey: localData.getPrivateKey(),
                hashtag: Session.get("hashtag"),
                questionIndex: EventManager.findOne().questionIndex,
                answerOptionNumber: answerOptionsCount - 1
            });
            localData.deleteAnswerOption(Session.get("hashtag"), EventManager.findOne().questionIndex, answerOptionsCount - 1);

            answerOptionsCount--;
            if (answerOptionsCount === 1) {
                $("#deleteAnswerOption").addClass("hide");
            } else if (answerOptionsCount > 2) {
                $('.answer-options').scrollTop($('.answer-options')[0].scrollHeight);
            }
        }
    },
    "click #backButton": function () {
        Router.go('/question');
    },
    "click #forwardButton": function () {
        var err = parseAnswerOptionInput(EventManager.findOne().questionIndex);

        if (err) {
            splashscreen_error.setErrorText(TAPi18n.__("plugins.splashscreen.error.error_messages."+err.reason));
            splashscreen_error.open();
        } else {
            Router.go("/settimer");
        }
    },
    "keydown .input-field": function (event) {
        //Prevent tab default
        if (event.keyCode === 9) {
            event.preventDefault();
        }

        if (event.keyCode === 9 || event.keyCode === 13) {
            var nextElement = $(event.currentTarget).closest(".form-group").next();
            if (nextElement.length > 0) {
                nextElement.find(".input-field").focus();
            } else {
                $("#addAnswerOption").click();
                //sets focus to the new input field
                $(event.currentTarget).closest(".form-group").next().find(".input-field").focus();
            }
        }
    }
});