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
    Generate an engaging, professional and marketable movie synopsis based on an outline. Make sure
    to think of best hollywood actors suited for the roles of each character and include their 
    full names in brackets after each character name.
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
    max_tokens: 900,
  })

  const synopsis = response.data.choices[0].text.trim()
  document.getElementById("output-text").innerText = synopsis

  fetchTitle(synopsis)
  fetchActors(synopsis)
}

async function fetchTitle(synopsis) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Generate a gripping, flashy, and marketable movie title based on the ${synopsis}`,
    max_tokens: 25,
    temperature: 0.8,
  })
  const title = response.data.choices[0].text.trim()
  document.getElementById("output-title").innerText = title
  fetchImage(title, synopsis)
}

async function fetchActors(synopsis) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `pull out all of hollywood actor's names out of the brackets from the ${synopsis}`,
    max_tokens: 30,
  })

  document.getElementById("output-stars").innerText =
    response.data.choices[0].text.trim()
}

async function fetchImage(title, synopsis) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Give a short description of an image which could be used to advertise 
    a movie based on a title and synopsis. The description should be rich in 
    visual detail but contain no names.
    ###
    title: Love's Time Warp
    synopsis: When scientist and time traveller Wendy (Emma Watson) is sent back 
    to the 1920s to assassinate a future dictator, she never 
    expected to fall in love with them. 
    As Wendy infiltrates the dictator's inner circle, 
    she soon finds herself torn between her mission and her growing feelings for the 
    leader (Brie Larson). With the help of a mysterious stranger from the future 
    (Josh Brolin), Wendy must decide whether to carry out her mission or follow her heart. 
    But the choices she makes in the 1920s will have far-reaching consequences that
    reverberate through the ages.
    image description: A silhouetted figure stands in the shadows of a 1920s speakeasy, 
    her face turned away from the camera. In the background, two people are dancing in the 
    dim light, one wearing a flapper-style dress and the other wearing a dapper suit. 
    A semi-transparent image of war is super-imposed over the scene.
    ###
    title: ${title}
    synopsis: ${synopsis}
    image description: 
    `,
    max_tokens: 100,
    temperature: 0.3,
  })
  const imageDescription = response.data.choices[0].text.trim()
  generateImage(imageDescription)
}

async function generateImage(imageDescription) {
  const response = await openai.createImage({
    prompt: `${imageDescription}. Avoid using text in this image.`,
    n: 1,
    size: `512x512`,
    response_format: `url`,
  })

  document.getElementById(
    "output-img-container"
  ).innerHTML = `<img src="${response.data.data[0].url}">`

  setupInputContainer.innerHTML = `<button id="view-pitch-btn" class="view-pitch-btn">
                      View Pitch</button>`
  document.getElementById("view-pitch-btn").addEventListener("click", () => {
    document.getElementById("setup-container").style.display = "none"
    document.getElementById("output-container").style.display = "flex"
  })
}
