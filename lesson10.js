import 'dotenv/config';
import OpenAI from 'openai';

/* 
  Evaluate AI Outputs
*/

const client = new OpenAI();

const getCompletionFromMessages = async (messages, model = 'gpt-4o-mini', temperature = 0, max_tokens = 500) => {
  const completion = await client.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens,
  });

  return completion.choices[0].message.content;
};

const delimiter = "####";
const getSaferUserMessage = (userMessage) => `${delimiter} ${userMessage.replace(delimiter, '')} ${delimiter}`;

const customerQuery = `tell me about the smartx pro phone and the fotosnap camera, the dslr one.
Also, what TVs or TV related products do you have?`;
const idealResponse = `Of course!  The SmartX ProPhone is a powerful smartphone with advanced camera features. \
For instance, it has a 12MP dual camera. Other features include 5G wireless and 128GB storage. \
It also has a 6.1-inch display.  The price is $899.99.

The FotoSnap DSLR Camera is great for capturing stunning photos and videos. Some features include 1080p video, \
3-inch LCD, a 24.2MP sensor, and interchangeable lenses. The price is 599.99.

For TVs and TV related products, we offer 3 TVs

All TVs offer HDR and Smart TV.

The CineView 4K TV has vibrant colors and smart features. Some of these features include a 55-inch display, '4K resolution. It's priced at 599.

The CineView 8K TV is a stunning 8K TV. Some features include a 65-inch display and 8K resolution.  It's priced at 2999.99

The CineView OLED TV lets you experience vibrant colors. Some features include a 55-inch display and 4K resolution. It's priced at 1499.99.

We also offer 2 home theater products, both which include bluetooth. The SoundMax Home Theater is a powerful home theater system for an immersive audio experience.
Its features include 5.1 channel, 1000W output, and wireless subwoofer.
It's priced at 399.99.

The SoundMax Soundbar is a sleek and powerful soundbar.
It's features include 2.1 channel, 300W output, and wireless subwoofer.
It's priced at 199.99

Are there any questions additional you may have about these products that you mentioned here?
Or may do you have other questions I can help you with?`;

const assistantResponse = `The SmartX ProPhone is a powerful smartphone with a 6.1-inch display, 128GB storage, 12MP dual camera, and 5G capability. It is priced at $899.99 and comes with a 1-year warranty.

The FotoSnap DSLR Camera features a 24.2MP sensor, 1080p video recording, a 3-inch LCD screen, and interchangeable lenses. Priced at $599.99, it offers a 1-year warranty and is great for capturing stunning photos and videos.

For TVs and related products, we have the CineView 4K TV with a 55-inch display, 4K resolution, HDR, and Smart TV features priced at $599.99. We also offer the CineView 8K TV with a 65-inch display, 8K resolution, HDR, and Smart TV capabilities for $2999.99. Additionally, we have the SoundMax Home Theater system for $399.99 and the SoundMax Soundbar for $199.99 to enhance your audio experience.

Do you have any specific questions about the SmartX ProPhone, FotoSnap DSLR Camera, or any of the TV products mentioned?`;


const compareToIdeal = async (customerQuery, idealResponse, subjectResponse) => {
  /*
    This evaluation prompt is from the OpenAI evals project. [https://github.com/openai/evals/blob/main/evals/registry/modelgraded/fact.yaml]
    BLEU score: another way to evaluate whether two pieces of text are similar or not. [https://en.wikipedia.org/wiki/BLEU]
  */
  const systemMessage = `You are an assistant that evaluates how well the customer service agent answers a user question by comparing the response to the ideal (expert) response.
    Output a single letter and nothing else.`;

  const userMessage = `You are comparing a submitted answer to an expert answer on a given question. Here is the data:
    [BEGIN DATA]
    ************
    [Question]: ${customerQuery}
    ************
    [Expert]: ${idealResponse}
    ************
    [Submission]: ${subjectResponse}
    ************
    [END DATA]

Compare the factual content of the submitted answer with the expert answer. Ignore any differences in style, grammar, or punctuation.
    The submitted answer may either be a subset or superset of the expert answer, or it may conflict with it. Determine which case applies. Answer the question by selecting one of the following options:
    (A) The submitted answer is a subset of the expert answer and is fully consistent with it.
    (B) The submitted answer is a superset of the expert answer and is fully consistent with it.
    (C) The submitted answer contains all the same details as the expert answer.
    (D) There is a disagreement between the submitted answer and the expert answer.
    (E) The answers differ, but these differences don't matter from the perspective of factuality.
  choice_strings: ABCDE`;

  const messages = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: userMessage },
  ];

  const response = await getCompletionFromMessages(messages);

  return response;
};

(async function section1() {
  const response = await compareToIdeal(customerQuery, idealResponse, assistantResponse);

  console.log('section1', { response });
})();

(async function section2() {
  const subjectResponse = `life is like a box of chocolates`;

  const response = await compareToIdeal(customerQuery, idealResponse, subjectResponse);

  console.log('section2', { response });
})();