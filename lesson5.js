import 'dotenv/config';
import OpenAI from 'openai';

// Chain of Thought Reasoning

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

const systemMessage = `Follow these steps to answer the customer queries.
The customer query will be delimited with four hashtags, i.e. ${delimiter}. 

Step 1:${delimiter} First decide whether the user is asking a question about a specific product or products. \
Product category doesn't count. 

Step 2:${delimiter} If the user is asking about specific products, identify whether the products are in the following list.
All available products: 
1. Product: TechPro Ultrabook
   Category: Computers and Laptops
   Brand: TechPro
   Model Number: TP-UB100
   Warranty: 1 year
   Rating: 4.5
   Features: 13.3-inch display, 8GB RAM, 256GB SSD, Intel Core i5 processor
   Description: A sleek and lightweight ultrabook for everyday use.
   Price: $799.99

2. Product: BlueWave Gaming Laptop
   Category: Computers and Laptops
   Brand: BlueWave
   Model Number: BW-GL200
   Warranty: 2 years
   Rating: 4.7
   Features: 15.6-inch display, 16GB RAM, 512GB SSD, NVIDIA GeForce RTX 3060
   Description: A high-performance gaming laptop for an immersive experience.
   Price: $1199.99

3. Product: PowerLite Convertible
   Category: Computers and Laptops
   Brand: PowerLite
   Model Number: PL-CV300
   Warranty: 1 year
   Rating: 4.3
   Features: 14-inch touchscreen, 8GB RAM, 256GB SSD, 360-degree hinge
   Description: A versatile convertible laptop with a responsive touchscreen.
   Price: $699.99

4. Product: TechPro Desktop
   Category: Computers and Laptops
   Brand: TechPro
   Model Number: TP-DT500
   Warranty: 1 year
   Rating: 4.4
   Features: Intel Core i7 processor, 16GB RAM, 1TB HDD, NVIDIA GeForce GTX 1660
   Description: A powerful desktop computer for work and play.
   Price: $999.99

5. Product: BlueWave Chromebook
   Category: Computers and Laptops
   Brand: BlueWave
   Model Number: BW-CB100
   Warranty: 1 year
   Rating: 4.1
   Features: 11.6-inch display, 4GB RAM, 32GB eMMC, Chrome OS
   Description: A compact and affordable Chromebook for everyday tasks.
   Price: $249.99

Step 3:${delimiter} If the message contains products in the list above, list any assumptions that the \
user is making in their message e.g. that Laptop X is bigger than Laptop Y, or that Laptop Z has a 2 year warranty.

Step 4:${delimiter}: If the user made any assumptions, figure out whether the assumption is true based on your product information. 

Step 5:${delimiter}: First, politely correct the customer's incorrect assumptions if applicable. \
Only mention or reference products in the list of 5 available products, as these are the only 5 \
products that the store sells. Answer the customer in a friendly tone.

Use the following format:
Step 1:${delimiter} <step 1 reasoning>
Step 2:${delimiter} <step 2 reasoning>
Step 3:${delimiter} <step 3 reasoning>
Step 4:${delimiter} <step 4 reasoning>
Response to user:${delimiter} <response to customer>

Make sure to include ${delimiter} to separate every step.`;

(async function section1() {
  const userMessage = 'by how much is the BlueWave Chromebook more expensive \
than the TechPro Desktop';

  const messages = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: userMessage },
  ];

  const response = await getCompletionFromMessages(messages);
  console.log({ userMessage }, { response });
})();

(async function section2() {
  const userMessage = 'do you sell tvs';

  const messages = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: userMessage },
  ];

  const response = await getCompletionFromMessages(messages);
  console.log({ userMessage }, { response });
})();

// Hiding the reasoning
(async function section3() {
  const userMessage = 'by how much is the BlueWave Chromebook more expensive \
than the TechPro Desktop';

  const messages = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: userMessage },
  ];

  const response = await getCompletionFromMessages(messages);
  const responseWithoutReasoning = (() => {
    try {
      return response.split(delimiter).slice(-1)[0].trim();
    } catch (error) {
      console.error('Error splitting response:', error);
      return 'I had trouble processing the response. Please try again.';
    }
  })();
  console.log({ userMessage }, { responseWithoutReasoning });
})();

// Used the example above with ChatGPT to create a new experiment. The system message is provided below:
(async function experiment() {
  const systemMessage = `Follow these steps to provide fitness advice to the user. The user's query will be delimited with four hashtags, i.e., ${delimiter}.

Step 1:${delimiter} First, decide whether the user is asking about a specific fitness goal or general fitness advice. Specific goals could include muscle building, weight loss, improving cardiovascular endurance, etc.

Step 2:${delimiter} If the user is asking about a specific goal, identify the relevant fitness components. For example, strength training, cardio, flexibility, nutrition, recovery, etc.

Step 3:${delimiter} If the user mentions any assumptions or specific methods, exercises, or diets, identify them. Examples of assumptions include "lifting heavy weights leads to bulky muscles" or "carbs should be avoided for weight loss."

Step 4:${delimiter} Determine whether the assumptions made by the user are correct or if they need any clarification based on scientific evidence or best fitness practices.

Step 5:${delimiter} Politely correct any incorrect assumptions if applicable. Offer specific, evidence-based advice relevant to the user's query. Provide suggestions for exercises, nutrition, or fitness routines that align with their goal.

Use the following format:

Step 1:${delimiter} <step 1 reasoning>
Step 2:${delimiter} <step 2 reasoning>
Step 3:${delimiter} <step 3 reasoning>
Step 4:${delimiter} <step 4 reasoning>
Response to user:${delimiter} <response with friendly and informative tone>

Make sure to include ${delimiter} to separate every step.`;

  const userMessage = 'I heard Z2 cardio is better for cardio that VO2max training, so I plan to drop VO2max training altogether.';

  const messages = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: userMessage },
  ];

  const response = await getCompletionFromMessages(messages);
  console.log({ userMessage }, { response });
})();
