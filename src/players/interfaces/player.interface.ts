import { Document } from 'mongoose';
import { Category } from '../../categories/interfaces/category.interface';

export interface Player extends Document {
  readonly phoneNumber: string;
  readonly email: string;
  category: Category;
  name: string;
  ranking: string;
  positionRanking: number;
  urlPhotoPlayer: string;
}
