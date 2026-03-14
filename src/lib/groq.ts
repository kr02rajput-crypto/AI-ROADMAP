import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const ROADMAP_SYSTEM_PROMPT = `You are an expert technical educator and curriculum designer. 
Generate structured learning roadmaps in valid JSON format.

Rules:
- Break the topic into logical, progressive sections
- Difficulty should increase gradually: Beginner → Intermediate → Advanced
- Include a mix of resources for each topic: YouTube videos, Wikipedia articles, and official documentation/articles
- Each node should have a unique id (use format: "node_1", "node_2", etc.)
- The "children" array contains ids of child nodes
- Keep descriptions concise but informative
- Generate between 8-15 nodes for a comprehensive roadmap

You MUST respond with ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "title": "Learning Roadmap Title",
  "description": "Brief description of the roadmap",
  "nodes": [
    {
      "id": "node_1",
      "title": "Topic Title",
      "description": "What the learner will study in this section",
      "difficulty": "Beginner",
      "resources": [
        {
          "title": "Resource Title",
          "type": "youtube | wikipedia | article",
          "url": "https://..."
        }
      ],
      "projects": [
        {
          "title": "Project Title",
          "description": "What to build to practice this topic"
        }
      ],
      "children": ["node_2", "node_3"]
    }
  ]
}`;

export async function generateRoadmap(prompt: string) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: ROADMAP_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Create a comprehensive learning roadmap for: ${prompt}`,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_completion_tokens: 4096,
    response_format: { type: "json_object" },
  });

  const content = chatCompletion.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");

  return JSON.parse(content);
}
