Template.hashtag_view.onCreated(function () {
    this.autorun(() => {
        this.subscribe('Hashtags.public');
    });
});

Template.hashtag_view.events({
    "input #hashtag-input-field": function (event) {
        var inputHashtag = $(event.target).val();
        $("#addNewHashtag").html("Mach neu !<span class=\"glyphicon glyphicon-plus glyph-right\" aria-hidden=\"true\"></span>");
        if (inputHashtag.length > 0) {
            var hashtagDoc = Hashtags.findOne({hashtag: inputHashtag});
            if (!hashtagDoc) {
                $("#joinSession").attr("disabled", "disabled");
                $("#addNewHashtag").removeAttr("disabled");
            } else {
                var localHashtags = localData.getAllHashtags();
                if ($.inArray(inputHashtag, localHashtags) > -1) {
                    $("#addNewHashtag").html("Bearbeiten<span class=\"glyphicon glyphicon-pencil glyph-right\" aria-hidden=\"true\"></span>");
                    $("#addNewHashtag").removeAttr("disabled");
                }
                else {
                    $("#addNewHashtag").attr("disabled", "disabled");
                }
                if (hashtagDoc.isActive) {
                    $("#joinSession").removeAttr("disabled");
                } else {
                    $("#joinSession").attr("disabled", "disabled");
                }
            }
        }
        else {
            $("#joinSession").attr("disabled", "disabled");
            $("#addNewHashtag").attr("disabled", "disabled");
        }
    },
    "click #addNewHashtag": function (event) {
        event.preventDefault();
        var hashtag = $("#hashtag-input-field").val();
        var reenter = false;
        if (hashtag.length > 0) {
            var localHashtags = localData.getAllHashtags();
            if ($.inArray(hashtag, localHashtags) > -1) {
                var oldHashtagDoc = Hashtags.findOne({hashtag: hashtag});
                if (oldHashtagDoc) {
                    reenter = true;
                    Session.set("hashtag", hashtag);
                    Session.set("isOwner", true);
                    Meteor.call("Hashtags.setIsActive", localData.getPrivateKey(), hashtag, 1);
                    localData.reenterSession(hashtag);
                    Router.go("/question");
                }
            }
            if (!reenter) {
                var doc = {
                    privateKey: localData.getPrivateKey(),
                    hashtag: hashtag,
                    isActive: 1,
                    lastConnection: (new Date()).getTime()
                };
                Meteor.call('Hashtags.addHashtag', doc, (err, res) => {
                    if (err) {
                        alert("Hashtag not saved!\n" + err);
                    } else {
                        Session.set("hashtag", hashtag);
                        Session.set("isOwner", true);
                        //localStorage.setItem("hashtag", hashtag);
                        // flag the client as owner via localStorage
                        localData.addHashtag(hashtag);
                        //var localHashtags = JSON.parse(localStorage.getItem("hashtags"));
                        //localHashtags.push(hashtag);
                        //localStorage.setItem("hashtags", JSON.stringify(localHashtags));
                        Router.go("/question");
                    }
                });
            }
        }
    },
    "click #joinSession": function () {
        var hashtag = $("#hashtag-input-field").val();
        Session.set("hashtag", hashtag);
        //localStorage.setItem("hashtag", hashtag);
        Router.go("/nick");
    },
    "keydown #hashtag-input-field": function (event) {
        var keyWhiteList = [37,39,8,46]; //left, right, delete, entf
        var charCount = $(event.currentTarget).val().length;
        if (charCount >= 25 && keyWhiteList.indexOf(event.keyCode)==-1) {
            event.preventDefault();
        }
    }
});