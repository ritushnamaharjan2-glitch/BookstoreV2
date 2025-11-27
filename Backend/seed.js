import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

const lessons = [
  { 
    subject: "Mathematics", location: "New York", price: 50, space: 10, tutor: "John Doe", rating: 4.5, book: "Algebra Made Easy",
    image: "image/mathematics.jpeg"
  },
  { 
    subject: "Physics", location: "Chicago", price: 45, space: 8, tutor: "Jane Smith", rating: 4.8, book: "The Quantum World",
    image: "Physics.jpeg"
  },
  { 
    subject: "Chemistry", location: "Los Angeles", price: 40, space: 12, tutor: "Dr. Albert", rating: 4.2, book: "Organic Basics",
    image: "image/chemistry.jpeg"
  },
  { 
    subject: "English Literature", location: "Houston", price: 35, space: 15, tutor: "Emily Brown", rating: 4.7, book: "Shakespeare Complete Works",
    image: "image/english_literature.jpeg"
  },
  { 
    subject: "Computer Science", location: "Boston", price: 60, space: 7, tutor: "Mark Wilson", rating: 4.9, book: "Intro to Algorithms",
    image: "image/computer_science.jpeg"
  },
  {
     subject: "Biology", location: "San Diego", price: 42, space: 9, tutor: "Sarah Lee", rating: 4.6, book: "Human Anatomy Guide",
    image: "image/biology.jpeg"
    },
  { 
    subject: "Economics", location: "Miami", price: 38, space: 11, tutor: "Robert King", rating: 4.3, book: "Macro & Micro Economics",
    image: "image/economics.jpeg"
  },
  { 
    subject: "History", location: "Seattle", price: 33, space: 10, tutor: "Anne Carter", rating: 4.4, book: "World History 101",
    image: "image/history.jpeg"
  },
  { 
    subject: "Music", location: "Dallas", price: 55, space: 6, tutor: "Paul Green", rating: 4.8, book: "Theory of Sound",
    image: "image/music.jpeg"
  },
  { 
    subject: "Art", location: "Denver", price: 48, space: 8, tutor: "Lucy Adams", rating: 4.5, book: "Modern Art Explained",
    image: "image/art.jpeg"
  }
];

async function seed() {
  try {
    await client.connect();
    const db = client.db("bookstore_web");
    await db.collection("lessons").deleteMany({});
    await db.collection("lessons").insertMany(lessons);
    console.log(" Lessons seeded successfully!");
  } catch (err) {
    console.error(" Seeding error:", err);
  } finally {
    await client.close();
  }
}

seed();

