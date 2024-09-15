import 'dotenv/config';
import OpenAI from 'openai';

/* 
  Check Outputs

  - At times we may want to check the AI response to a customer query.
  - Avoid potentially model hallucinations or harmful content.
  - Advanced models likely don't need such checks adding extra latency and cost.
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

// in some scnearios, we may want to also check the AI response
const responseToCustomer = `The SmartX ProPhone has a 6.1-inch display, 128GB storage, \
12MP dual camera, and 5G. The FotoSnap DSLR Camera has a 24.2MP sensor, 1080p video, 3-inch LCD, and \
interchangeable lenses. We have a variety of TVs, including the CineView 4K TV with a 55-inch display, 4K resolution, \
HDR, and smart TV features. We also have the SoundMax Home Theater system with 5.1 channel, 1000W output, wireless \
subwoofer, and Bluetooth. Do you have any specific questions about these products or any other products we offer?`;

const systemMessage = `You are an assistant that evaluates whether \
customer service agent responses sufficiently answer customer questions, and also validates that \
all the facts the assistant cites from the product information are correct.
The product information and user and customer service agent messages will be delimited by ${delimiter}.
Respond with a Y or N character, with no punctuation:
Y - if the output sufficiently answers the question AND the response correctly uses product information
N - otherwise

Output a single letter only.`;

const productInfo = `{ "name": "SmartX ProPhone", "category": "Smartphones and Accessories", "brand": "SmartX", "model_number": "SX-PP10", "warranty": "1 year", "rating": 4.6, "features": [ "6.1-inch display", "128GB storage", "12MP dual camera", "5G" ], "description": "A powerful smartphone with advanced camera features.", "price": 899.99 } { "name": "FotoSnap DSLR Camera", "category": "Cameras and Camcorders", "brand": "FotoSnap", "model_number": "FS-DSLR200", "warranty": "1 year", "rating": 4.7, "features": [ "24.2MP sensor", "1080p video", "3-inch LCD", "Interchangeable lenses" ], "description": "Capture stunning photos and videos with this versatile DSLR camera.", "price": 599.99 } { "name": "CineView 4K TV", "category": "Televisions and Home Theater Systems", "brand": "CineView", "model_number": "CV-4K55", "warranty": "2 years", "rating": 4.8, "features": [ "55-inch display", "4K resolution", "HDR", "Smart TV" ], "description": "A stunning 4K TV with vibrant colors and smart features.", "price": 599.99 } { "name": "SoundMax Home Theater", "category": "Televisions and Home Theater Systems", "brand": "SoundMax", "model_number": "SM-HT100", "warranty": "1 year", "rating": 4.4, "features": [ "5.1 channel", "1000W output", "Wireless subwoofer", "Bluetooth" ], "description": "A powerful home theater system for an immersive audio experience.", "price": 399.99 } { "name": "CineView 8K TV", "category": "Televisions and Home Theater Systems", "brand": "CineView", "model_number": "CV-8K65", "warranty": "2 years", "rating": 4.9, "features": [ "65-inch display", "8K resolution", "HDR", "Smart TV" ], "description": "Experience the future of television with this stunning 8K TV.", "price": 2999.99 } { "name": "SoundMax Soundbar", "category": "Televisions and Home Theater Systems", "brand": "SoundMax", "model_number": "SM-SB50", "warranty": "1 year", "rating": 4.3, "features": [ "2.1 channel", "300W output", "Wireless subwoofer", "Bluetooth" ], "description": "Upgrade your TV's audio with this sleek and powerful soundbar.", "price": 199.99 } { "name": "CineView OLED TV", "category": "Televisions and Home Theater Systems", "brand": "CineView", "model_number": "CV-OLED55", "warranty": "2 years", "rating": 4.7, "features": [ "55-inch display", "4K resolution", "HDR", "Smart TV" ], "description": "Experience true blacks and vibrant colors with this OLED TV.", "price": 1499.99 }`;

(async function section1() {
  // Check for potentially harmful content
  const response = await client.moderations.create({ input: responseToCustomer });

  console.log('section1', { results: JSON.stringify(response.results, null, 2) });
})();

(async function section2() {
  // Check if output if factually correct
  const userMessage = `tell me about the smartx pro phone and the fotosnap camera, the dslr one. Also tell me about your tvs`;
  const responseCheck = `Customer message: ${delimiter}${userMessage}${delimiter}\
  Product Information: ${delimiter}${productInfo}${delimiter}\
  Agent response: ${delimiter}${responseToCustomer}${delimiter}\
  
  Does the response use the retrieved information correctly?
  Does the response sufficiently answer the question

  Output Y or N`;

  const messages = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: responseCheck },
  ];

  const response = await getCompletionFromMessages(messages);
  console.log('section2', { responseToCustomer }, { response });
})();

(async function section3() {
  // Check if output if factually correct
  const userMessage = `tell me about the smartx pro phone and the fotosnap camera, the dslr one. Also tell me about your tvs`;
  const uselessAgentResponse = `life is like a box of chocolates`;
  const responseCheck = `Customer message: ${delimiter}${userMessage}${delimiter}\
  Product Information: ${delimiter}${productInfo}${delimiter}\
  Agent response: ${delimiter}${uselessAgentResponse}${delimiter}\
  
  Does the response use the retrieved information correctly?
  Does the response sufficiently answer the question

  Output Y or N`;

  const messages = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: responseCheck },
  ];

  const response = await getCompletionFromMessages(messages);
  console.log('section2', { uselessAgentResponse }, { response });
})();
