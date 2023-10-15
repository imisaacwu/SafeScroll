console.log("start");
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: "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"// This is also the default, can be omitted
});

async function runCompletion () {
const completion = await openai.completions.create({
  model: "text-davinci-003",
  prompt: "This story begins",
  max_tokens: 30,
});
console.log(completion.choices[0].text);
}
console.log("Running");
runCompletion();