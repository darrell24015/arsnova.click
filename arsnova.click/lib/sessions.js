Sessions = new Mongo.Collection("sessions");

Sessions.attachSchema(new SimpleSchema({
	hashtag: {
		type: String,
		min: 1,
		max: 25,
	},
	questionText: {
		type: String,
		min: 5,
		max: 1000,
	},
	timer: {
		type: Number,
	}
}));
