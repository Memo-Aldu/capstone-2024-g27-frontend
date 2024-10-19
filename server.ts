import express from 'express'
import cors from 'cors'

const app = express()

const corsOptions = {
  origin: 'http://localhost:3000', // or your ngrok URL
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(express.json())

// Define your routes here
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
app.options('*', cors(corsOptions)) // Preflight request handling

// Define your routes here
app.post('/api/v1/sms/send', (req, res) => {
  // Your Twilio SMS sending logic here
  res.send('SMS sent')
})

// Start the server
const PORT = (process.env.PORT != null) || 8080
app.listen(PORT, () => {
})
