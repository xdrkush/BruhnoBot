import { Schema, model, connect } from 'mongoose';
import { questions } from '../utils/question'

// 1. Create an interface representing a document in MongoDB.
interface IUser {
    name: string;
    email: string;
    avatar?: string;
}
export interface IQuestion {
    name: string,
    category: string,
    question: string,
    reponse: string
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: String
});

const questionSchema = new Schema<IQuestion>({
    name: { type: String, required: true },
    category: { type: String, required: true },
    question: { type: String, required: true },
    reponse: { type: String, default: ""},
});

// 3. Create a Model.
export const User = model<IUser>('User', userSchema);
export const Question = model<IQuestion>('Question', questionSchema);

export class MongoDB {

    async test() {
        // Clear Collection
        // Question.collection.drop()

        // const user = new User({
        //     name: 'Bill',
        //     email: 'bill@initech.com',
        //     avatar: 'https://i.imgur.com/dM7Thhn.png'
        // });
        // await user.save();


        // questions.map(async (el, i) => {
        //     await Question.create({
        //         ...el
        //     })
        // })
    }

    async run() {
        // 4. Connect to MongoDB
        const mongoose = await connect(`${process.env.MONGO_URI}`);
        mongoose.set('strictQuery', false);
        // console.log(user.email); // 'bill@initech.com'
    }
}