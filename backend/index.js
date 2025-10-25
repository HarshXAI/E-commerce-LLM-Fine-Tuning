import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import authRoutes from './routes/auth.routes.js';
import llmRoutes from './routes/custom.routes.js';
import cookieParser from 'cookie-parser';
import multer from 'multer';

dotenv.config();

const app = express();
// const corsOptions = {
//   origin: 'http://localhost:5173', // Change to the specific origin you want to allow
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
//   credentials: true, // Allow cookies if needed
// };
// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey:  process.env.GROQ_KEY });

app.get('/',(req,res)=>{
  res.send('Hello World')
});
app.use('/user', authRoutes);
app.use('/llm', llmRoutes);

const PORT = process.env.PORT || 3000;

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';  // Directory to store uploaded files
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);  // Unique filename
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Check if virtual environment exists, and create if not
const venvPath = path.join(__dirname, 'venv');
if (!fs.existsSync(venvPath)) {
  console.log("Creating virtual environment...");

  const createEnv = spawn('python', ['-m', 'venv', 'venv']);
  createEnv.stdout.on('data', (data) => console.log(`stdout: ${data}`));
  createEnv.stderr.on('data', (data) => console.error(`stderr: ${data}`));

  createEnv.on('close', (code) => {
    console.log(`Virtual environment created with code ${code}`);
    installDependencies();
  });
} else {
  console.log("Virtual environment already exists. Skipping creation...");
  installDependencies();
}

function installDependencies() {
  const requirementsPath = path.join(__dirname, 'requirements.txt');
  if (fs.existsSync(requirementsPath)) {
    console.log("Installing dependencies...");

    const installDeps = spawn('pip', ['install', '-r', requirementsPath], {
      cwd: __dirname,
    });

    installDeps.stdout.on('data', (data) => console.log(`stdout: ${data}`));
    installDeps.stderr.on('data', (data) => console.error(`stderr: ${data}`));

    installDeps.on('close', (code) => {
      console.log(`Dependencies installed with code ${code}`);
    });
  } else {
    console.error('requirements.txt not found!');
  }
}

app.post('/imageUpload', upload.single('image'), (req, res) => {
    // If no image was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
  
    const uploadedImage = req.file;
    const imagePath = path.join(__dirname, 'uploads', uploadedImage.filename);
  
    // Python script should process the image
    const pythonProcess = spawn('python', ['app.py', 'process_image', imagePath]);
  
    let responseSent = false; // Track if a response has already been sent
  
    // Collect the output from Python
    pythonProcess.stdout.on('data', (data) => {
      if (!responseSent) {
        const response = data.toString();
        res.json({ result: response });
        responseSent = true;  // Mark that the response has been sent
      }
    });
  
    // Handle errors from Python script
    pythonProcess.stderr.on('data', (data) => {
      if (!responseSent) {
        console.error(`stderr: ${data}`);
        res.status(500).json({ error: 'Error executing Python script' });
        responseSent = true;  // Mark that the response has been sent
      }
    });
  
    // Handle process close event
    pythonProcess.on('close', (code) => {
      if (!responseSent) {  // Ensure response is not sent twice
        if (code !== 0) {
          res.status(500).json({ error: `Python process exited with code ${code}` });
        }
        responseSent = true;  // Mark that the response has been sent
      }
    });
  });


  app.post('/rows', async (req, res) => {
    try {
      const { rows } = req.body;
      // Log the incoming data (for debugging)
      console.log('Received orders:', rows);
  
      return res.status(200)
    } catch (error) {
      console.error('Error saving orders:', error);
      res.status(500).json({ message: 'Error saving orders', error: error.message });
    }
  });
  

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URI)
    .then((conn) => {console.log(`Database connected: ${conn.connection.host}`);})
    .catch((err) => {console.log(`Error in connected db: ${err.message}`);})
});
