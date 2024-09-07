import 'dotenv/config';
import OpenAI from 'openai';

// Classification

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
const systemMessage = `You will be provided with customer service queries. \
The customer service query will be delimited with ${delimiter} characters. \
Classify each query into a primary category and a secondary category. \
Provide your output in json format with the keys: primary and secondary.

Primary categories: Billing, Technical Support, \
Account Management, or General Inquiry.

Billing secondary categories:
Unsubscribe or upgrade
Add a payment method
Explanation for charge
Dispute a charge

Technical Support secondary categories:
General troubleshooting
Device compatibility
Software updates

Account Management secondary categories:
Password reset
Update personal information
Close account
Account security

General Inquiry secondary categories:
Product information
Pricing
Feedback
Speak to a human`;

(async function section1() {
  const userMessage = 'I want you to delete my profile and user data.';
  const messages = [
    {
      'role': 'system',
      'content': systemMessage
    },
    {
      'role': 'user',
      'content': `${delimiter} ${userMessage} ${delimiter}`
    },
  ];

  const response1 = await getCompletionFromMessages(messages);
  console.log(response1);
})();

(async function section2() {
  const userMessage2 = 'Tell me more about your flat screen tvs';

  const messages = [
    {
      'role': 'system',
      'content': systemMessage
    },
    {
      'role': 'user',
      'content': `${delimiter} ${userMessage2} ${delimiter}`
    },
  ];

  const response2 = await getCompletionFromMessages(messages);
  console.log(response2);
})();
