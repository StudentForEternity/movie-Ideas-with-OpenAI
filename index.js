import { process } from "/env"
import { Configuration, OpenAIApi } from "openai"

const setupTextarea = document.getElementById("setup-textarea")
const setupInputContainer = document.getElementById("setup-input-container")
const movieBossText = document.getElementById("movie-boss-text")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

document.getElementById("send-btn").addEventListener("click", () => {
  if (setupTextarea.value) {
    const userPrompt = setupTextarea.value
    setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`
    movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...`
    fetchBotReply(userPrompt)
    fetchSynopsis(userPrompt)
  }
})

async function fetchBotReply(userPrompt) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Generate a short message to enthusiastically say that user's prompt 
            sounds interesting and that you need some minutes to think about it. 
            Mention one aspect of the sentence.
            ###
            user's prompt: A group of corrupt lawyers try to send an innocent woman to jail.
            message: Wow that is awesome! Corrupt lawyers, huh? Give me a few moments to think!
            ### 
            user's prompt: ${userPrompt}
            message: 
            `,
    max_tokens: 60,
  })
  movieBossText.innerText = response.data.choices[0].text.trim()
}

async function fetchSynopsis(userPrompt) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `
    ###
    Movie idea: A big-headed daredevil fighter pilot goes back to school only to be sent on a deadly mission.
    Movie Synopsis: The Top Gun Naval Fighter Weapons School is where the 
      best of the best train to refine their elite flying skills. When hotshot 
      fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless attitude
      and cocky demeanor put him at odds with the other pilots, especially the cool and 
      collected Iceman (Val Kilmer). But Maverick isn't only competing to be the top fighter 
      pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte 
      Blackwood (Kelly McGillis). Maverick gradually earns the respect of his instructors and peers - 
      and also the love of Charlotte, but struggles to balance his personal and professional life. 
      As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons 
      and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from 
      the mission triumphant.
    ###
    Movie idea:${userPrompt}
    Movie synopsis: `,
    max_tokens: 700,
  })

  const synopsis = response.data.choices[0].text.trim()
  document.getElementById("output-text").innerText = synopsis

  fetchTitle(synopsis)
}

async function fetchTitle(synopsis) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Generate a gripping, flashy, and marketable movie title based on the ${synopsis}`,
    max_tokens: 20,
    temperature: 0.5,
  })
  document.getElementById("output-title").innerText =
    response.data.choices[0].text.trim()
}
