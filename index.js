const setupTextarea = document.getElementById("setup-textarea")
const setupInputContainer = document.getElementById("setup-input-container")
const movieBossText = document.getElementById("movie-boss-text")

const apiKey = "blablabla"

const url = "https://api.openai.com/v1/completions"

document.getElementById("send-btn").addEventListener("click", () => {
  if (setupTextarea.value) {
    setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`
    movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...`
  }

  fetchBotReply()
})

function fetchBotReply() {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: "Do you think the world will end?",
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw {
          Error: "sorry buddy, something went wrong",
        }
      }
      return res.json()
    })
    .then((data) => {
      movieBossText.innerHTML = `${data.choices[0].text}`
    })
    .catch((err) => console.log(err))
}
