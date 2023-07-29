require("dotenv").config()
const express = require('express');
const axios = require('axios');
const cors=require("cors")
const app=express()
const port=process.env.port


app.use(express.json())
app.use(cors())

const apiKey =process.env.API_KEY
const openaiEndpoint=process.env.OPENAI_URL

console.log(apiKey,openaiEndpoint)

// Function to interact with ChatOpenAI


const generate = async (prompt) => {
  try {
    const response = await axios.post(openaiEndpoint, {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });

   return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    return error.message
  }
};



  app.post("/interview/question", async(req,res)=>{
    const {subject}=req.body

    const prompt=`can you ask one random question from  ${subject}`

    try {
        
        const question= await generate(prompt);

        res.send({question:question})

    } catch (error) {
        res.status(500).json({ error: 'Error processing the question' });
    }

  })



  // API route to submit student responses and get feedback
app.post('/interview/submit', async (req, res) => {
  const { question, response } = req.body;
        console.log(question,response)
  // Generate a prompt for OpenAI by combining the question and student's response
  const prompt = `Interviewer:${question}\nCandidate:${response}\n can you give feedback for these answer as interviewer for these question and answer should contain definition,usecases,benefits,example `;

  try {
    // Get feedback from OpenAI based on the response
    const feedback = await generate(prompt);

    // You can implement your feedback analysis here to further process the feedback

    // Send the feedback to the client
    res.send({ feedback });
  } catch (error) {
    res.status(500).json({ error: 'Error processing the question' });
  }
});


app.post('/interview/evaluate', async (req, res) => {
  const { question, response } = req.body;
        console.log(question,response)
  // Generate a prompt for OpenAI by combining the question and student's response
  const prompt = `Interviewer: ${question}\nCandidate: ${response}\n can you check communication skill ,similarly check the definition,usecases,benefits and give marks for each things separtely below if they provided `;

  try {
    // Get feedback from OpenAI based on the response
    const feedback = await generate(prompt);

    // You can implement your feedback analysis here to further process the feedback

    // Send the feedback to the client
    res.send({ feedback });
  } catch (error) {
    res.status(500).json({ error: 'Error processing the question' });
  }
});







  app.listen(port,()=>{
    console.log(`server is running on ${port}`)
  })

// const { Configuration, OpenAIApi } = require("openai");
// const configuration = new Configuration({
//     apiKey: process.env.API_KEY,
//   });
//   const openai = new OpenAIApi(configuration);

//    openai.createChatCompletion({
//     model: "gpt-3.5-turbo",
//     messages: [{role: "user", content: "Hello world"}],
//   })
//   .then(res=>{
//     console.log(res.data.choices[0].message)
//   })

