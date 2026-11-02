import mongoose from 'mongoose';
export default async function connectDB() {
  await mongoose.connect("mongodb+srv://Rahul:Rahul123%24@cluster0.dflixki.mongodb.net/Cricket");
  console.log('MongoDB connected');
}
