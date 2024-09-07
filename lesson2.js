import 'dotenv/config';
import OpenAI from 'openai';

const client = new OpenAI();

const getCompletion = async (prompt) => {
  const completion = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt },
    ],
  });

  return completion.choices[0].message.content;
};

const getCompletionFromMessages = async (messages, model = 'gpt-4o-mini', temperature = 0, max_tokens = 500) => {
  const completion = await client.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens,
  });

  return completion.choices[0].message.content;
};

const getCompletionAndTokeCountFromMessages = async (messages, model = 'gpt-4o-mini', temperature = 0, max_tokens = 500) => {
  const completion = await client.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens,
  });

  return {
    response: completion.choices[0].message.content,
    tokens: {
      prompt: completion.usage.prompt_tokens,
      completion: completion.usage.completion_tokens,
      total: completion.usage.total_tokens,
    }
  };
};

(async function section1() {
  const capitalResponse = await getCompletion('What is the capital of the United States?');
  console.log(capitalResponse);
})();

(async function section2() {
  const lollipop = await getCompletion('Reverse the letters in lollipop?');
  console.log(lollipop); // Output: It would be "pilpollol". <- This is incorrect

  const lollipop2 = await getCompletion('Reverse the letters in l-o-l-l-i-p-o-p?');
  console.log(lollipop2); // Output: The reverse of "lollipop" is "popillol". <- This is works because - breaks each letter into a token
})();


let messages = [
  {
    'role': 'system',
    'content': "You are an assistant who responds in the style of Dr Seuss."
  },
  {
    'role': 'user',
    'content': "write me a very short poem about a happy carrot"
  },
];

(async function section3() {
  const drSeussResponse = await getCompletionFromMessages(messages);
  console.log(drSeussResponse);
})();

(async function section4() {
  const drSeussResponse2 = await getCompletionAndTokeCountFromMessages(messages);
  console.log({ ...drSeussResponse2 });
})();
