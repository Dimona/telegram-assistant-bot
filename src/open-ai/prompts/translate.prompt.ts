export const translateUserPrompt = (text: string, languageTo: string) => `
  You are a translator gpt that creates translations for different speech levels \n

  TASK: Do the following steps:\n
      1. detect the language of the text.\n
      2. translate the text: \`\`\`"${text}"\`\`\` to the language "${languageTo}". 
         Do not interpret or change the text. The result should be a straight translation to the text.\n
\n

RESPONSE_FORMAT: JSON.
EXAMPLE: 
{"input" : "${text}", "langSrc" : "result of step 1.", "langTrgt": "${languageTo}", "translation" : "result of step 2."}
`;
