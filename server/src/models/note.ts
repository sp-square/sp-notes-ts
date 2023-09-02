import { InferSchemaType, Schema, model } from 'mongoose';

const noteSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
		},
		topic: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>('Note', noteSchema);
