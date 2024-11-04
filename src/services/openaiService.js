import axios from 'axios';
import { unsplashService } from './unsplashService';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// GPT-4 pricing per 1M tokens
const GPT4_PRICING = {
  input: 0.15,   // $0.15 per 1M input tokens
  output: 0.60   // $0.60 per 1M output tokens
};

export class OpenAIService {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  }

  calculateCost(inputTokens, outputTokens, imageQueryInputTokens = 0, imageQueryOutputTokens = 0) {
    // Convert to per million rate
    const inputCost = (inputTokens / 1000000) * GPT4_PRICING.input;
    const outputCost = (outputTokens / 1000000) * GPT4_PRICING.output;
    const imageQueryInputCost = (imageQueryInputTokens / 1000000) * GPT4_PRICING.input;
    const imageQueryOutputCost = (imageQueryOutputTokens / 1000000) * GPT4_PRICING.output;
    
    return {
      inputCost: inputCost.toFixed(4),
      outputCost: outputCost.toFixed(4),
      imageQueryInputCost: imageQueryInputCost.toFixed(4),
      imageQueryOutputCost: imageQueryOutputCost.toFixed(4),
      totalCost: (inputCost + outputCost + imageQueryInputCost + imageQueryOutputCost).toFixed(4)
    };
  }

  async generateTemplate(baseTemplate, prompt, type, onProgress) {
    try {
      let totalInputTokens = 0;
      let totalOutputTokens = 0;
      let imageQueryInputTokens = 0;
      let imageQueryOutputTokens = 0;

      onProgress?.('Analyzing prompt...', 40);
      const imageQueryResponse = await this.getImageSuggestions(prompt, type);
      imageQueryInputTokens = imageQueryResponse.usage.prompt_tokens;
      imageQueryOutputTokens = imageQueryResponse.usage.completion_tokens;
      const imagePrompt = imageQueryResponse.choices[0].message.content.trim();
      
      onProgress?.('Getting stock photos...', 50);
      const photos = await unsplashService.searchPhotos(imagePrompt, 3);

      onProgress?.('Generating template...', 70);
      const systemPrompt = `You are a template generation assistant. You modify HTML templates while ensuring all dynamic data uses the following variable format:

CRITICAL - Items Loop Structure:
You MUST include this exact structure for the items table:
{{#each items}}
<tr>
  <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #000000;">{{description}}</td>
  <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #000000;">{{quantity}}</td>
  <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #000000;">{{price}}</td>
  <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #000000;">{{total}}</td>
</tr>
{{/each}}

Required Variables to Maintain:
- Invoice/SOW Number: {{invoiceNumber}}
- Date: {{date}}
- Due Date: {{dueDate}}
- Client Name: {{clientName}}
- Client Email: {{clientEmail}}
- Total Amount: {{totalAmount}}

For SOW Templates also include:
- Project Scope: {{projectScope}}
- Terms: {{terms}}
- Total Hours: {{totalHours}}

Available Stock Photos:
${photos.map((photo, index) => `Image ${index + 1}: ${photo.url} (${photo.alt})`).join('\n')}

Important Image Guidelines:
1. When adding images, set max-width to 300px and height to auto
2. Add margin: 20px auto to center images
3. Images should be wrapped in a div with text-align: center
4. Add border-radius: 8px to images for rounded corners
5. Add box-shadow: 0 2px 4px rgba(0,0,0,0.1) for subtle depth

Other Important Guidelines:
1. MUST use the exact items loop structure shown above
2. MUST preserve all variable placeholders exactly as shown
3. Maintain proper HTML structure with inline styles
4. Use the provided stock photos where appropriate
5. Include proper image attribution in small text below used images
6. Ensure all text colors are explicitly set (color: #000000; or similar)

When adding images, use this structure:
<div style="text-align: center; margin: 20px 0;">
  <img src="IMAGE_URL" alt="IMAGE_ALT" style="max-width: 300px; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
</div>

CRITICAL: Return ONLY the HTML template. Do not include any markdown formatting, descriptions, or code block indicators like \`\`\`html or \`\`\`. The response should start directly with the HTML template and end with it. ENSURE the items loop structure is exactly as shown above.`;

      const itemsLoopExample = `{{#each items}}
<tr>
  <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #000000;">{{description}}</td>
  <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #000000;">{{quantity}}</td>
  <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #000000;">\${{price}}</td>
  <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #000000;">\${{total}}</td>
</tr>
{{/each}}`;

      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: `
                Base Template:
                ${baseTemplate}
                
                Type: ${type}
                
                Modifications Requested:
                ${prompt}
                
                Remember: 
                1. Return ONLY the HTML template without any additional text or formatting
                2. MUST include the exact items loop structure:
                ${itemsLoopExample}
              `
            }
          ],
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Track token usage from main template generation
      totalInputTokens += response.data.usage.prompt_tokens;
      totalOutputTokens += response.data.usage.completion_tokens;

      onProgress?.('Processing response...', 80);
      let generatedTemplate = response.data.choices[0].message.content.trim();

      // Calculate total cost including image query
      const cost = this.calculateCost(
        totalInputTokens, 
        totalOutputTokens,
        imageQueryInputTokens,
        imageQueryOutputTokens
      );
      console.log('Generation Cost:', {
        inputTokens: totalInputTokens,
        outputTokens: totalOutputTokens,
        imageQueryInputTokens,
        imageQueryOutputTokens,
        ...cost
      });

      // Add cost information to the template as a comment
      generatedTemplate = `
<!-- 
Generation Cost Information:
Input Tokens: ${totalInputTokens}
Output Tokens: ${totalOutputTokens}
Image Query Input Tokens: ${imageQueryInputTokens}
Image Query Output Tokens: ${imageQueryOutputTokens}
Input Cost: $${cost.inputCost}
Output Cost: $${cost.outputCost}
Image Query Input Cost: $${cost.imageQueryInputCost}
Image Query Output Cost: $${cost.imageQueryOutputCost}
Total Cost: $${cost.totalCost}
-->
${generatedTemplate}`;

      // Remove any markdown formatting if present
      generatedTemplate = generatedTemplate.replace(/```html\n?/g, '').replace(/```\n?/g, '');
      generatedTemplate = generatedTemplate.replace(/Modified Template:\s*/g, '');

      // Add photo credits if they were used
      const usedPhotos = photos.filter(photo => 
        generatedTemplate.includes(photo.url)
      );

      if (usedPhotos.length > 0) {
        const credits = usedPhotos.map(photo => 
          `Photo by <a href="${photo.credit.link}" target="_blank" rel="noopener noreferrer" style="color: #666; text-decoration: none;">${photo.credit.name}</a>`
        ).join(' | ');

        // Find the closing div of the main container
        const mainContainerEnd = generatedTemplate.lastIndexOf('</div>');
        
        if (mainContainerEnd !== -1) {
          // Insert credits before the last closing div
          generatedTemplate = 
            generatedTemplate.slice(0, mainContainerEnd) +
            `<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
              ${credits}
            </div>` +
            generatedTemplate.slice(mainContainerEnd);
        } else {
          // If no container div found, append to the end
          generatedTemplate += `
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
              ${credits}
            </div>`;
        }
      }

      return generatedTemplate;
    } catch (error) {
      console.error('Error generating template:', error);
      throw error;
    }
  }

  async getImageSuggestions(prompt, type) {
    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are an assistant that extracts specific image requests from user prompts.
              
              Guidelines:
              - Look for explicit image requests (e.g., "add a picture of X", "include an image of Y")
              - If no specific image is requested, look for the main subject matter
              - Return ONLY the search term, no additional text
              - Keep search terms specific and detailed
              - Add professional context only if relevant to the request
              
              Examples:
              User: "Add a picture of a bald eagle at the top"
              Response: "majestic bald eagle close up"
              
              User: "Include an image of a modern office"
              Response: "modern corporate office interior"
              
              User: "Put a blue bird in the header"
              Response: "blue bird perched"`
            },
            {
              role: "user",
              content: `Extract any specific image request from this prompt:
              "${prompt}"
              
              Return only the search term, no explanation.`
            }
          ],
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error getting image suggestions:', error);
      // Return a minimal response structure with zero tokens if error
      return {
        choices: [{ message: { content: prompt.slice(0, 100) } }],
        usage: { total_tokens: 0 }
      };
    }
  }
}

export const openaiService = new OpenAIService();