import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    phoneNumber: { type: String },
    name: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    ranking: String,
    position: Number,
    urlPhotoPlayer: String,
  },
  { timestamps: true, collection: 'players' },
);
