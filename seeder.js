const fs = require('fs');
const mongoose = require('mongoose');
const Bootcamp = require('./modals/bootcamps');
const Course = require('./modals/courses');
const colors = require('colors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// env configration
dotenv.config();

// DB connection
connectDB();


const bootcamp = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`) , 'utf-8');
const Courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`) , 'utf-8');

const ImportDB = async () => {
   try {
     await Bootcamp.create(bootcamp);
     await Course.create(Courses);
     console.log('Data imported'.green.inverse);
     process.exit();
   } catch (error) {
    console.error(error);
   }
}

const DeleteDB = async () => {
   try {
     await Bootcamp.deleteMany();
     await Course.deleteMany();
     console.log('Data destroyed'.red.inverse);
     process.exit();
   } catch (error) {
    console.error(error);
   }
}


if(process.argv[2] === '-i'){
  ImportDB();
} else if(process.argv[2] === '-d'){
  DeleteDB();
}
