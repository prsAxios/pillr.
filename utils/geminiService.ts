import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  console.warn('⚠️ Gemini API key not found. Please set EXPO_PUBLIC_GEMINI_API_KEY in your .env file');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface MedicationAnalysis {
  name: string;
  dosage: string;
  strength: string;
  form: string;
  manufacturer?: string;
  activeIngredients?: string[];
  instructions?: string;
  confidence: number;
}

export class GeminiService {
  private model: any;

  constructor() {
    if (!genAI) {
      console.warn('Gemini AI not initialized - API key missing');
      return;
    }
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
  }

  async analyzeMedicationImage(imageBase64: string): Promise<MedicationAnalysis> {
    try {
      if (!this.model) {
        throw new Error('Gemini AI not initialized. Please check your API key configuration.');
      }

      // Convert base64 to Uint8Array for Gemini
      const imageData = this.base64ToUint8Array(imageBase64);
      
      const prompt = `
        Analyze this medication image and extract the following information in JSON format:
        {
          "name": "Medication name",
          "dosage": "Dosage information (e.g., 500mg, 10mg)",
          "strength": "Strength/concentration",
          "form": "Form (tablet, capsule, liquid, etc.)",
          "manufacturer": "Manufacturer name if visible",
          "activeIngredients": ["List of active ingredients"],
          "instructions": "Any visible instructions",
          "confidence": 0.95
        }
        
        Focus on:
        1. Medication name and brand
        2. Dosage strength (mg, mcg, etc.)
        3. Form of medication
        4. Any visible manufacturer information
        5. Active ingredients if listed
        
        Return only valid JSON. If you cannot determine certain fields, use null or empty string.
        Confidence should be between 0.0 and 1.0 based on image clarity and information visibility.
      `;

      const result = await this.model.generateContent([prompt, imageData]);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini API');
      }

      const analysis = JSON.parse(jsonMatch[0]);
      
      // Validate and clean the response
      return this.validateAndCleanAnalysis(analysis);
      
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      if (error instanceof Error && error.message.includes('API key')) {
        throw new Error('Gemini API key not configured. Please check your .env file and restart the app.');
      }
      
      if (error instanceof Error && error.message.includes('403')) {
        throw new Error('Gemini API access denied. Please check your API key permissions.');
      }
      
      throw new Error('Failed to analyze medication image. Please try again or check your internet connection.');
    }
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    // Remove data URL prefix if present
    const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Convert base64 to binary string
    const binaryString = atob(base64Data);
    
    // Convert binary string to Uint8Array
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes;
  }

  private validateAndCleanAnalysis(analysis: any): MedicationAnalysis {
    // Ensure required fields exist with defaults
    const cleaned: MedicationAnalysis = {
      name: analysis.name || 'Unknown Medication',
      dosage: analysis.dosage || 'Unknown Dosage',
      strength: analysis.strength || 'Unknown Strength',
      form: analysis.form || 'Unknown Form',
      manufacturer: analysis.manufacturer || '',
      activeIngredients: Array.isArray(analysis.activeIngredients) ? analysis.activeIngredients : [],
      instructions: analysis.instructions || '',
      confidence: Math.max(0, Math.min(1, analysis.confidence || 0.5))
    };

    // Clean up text fields
    cleaned.name = cleaned.name.trim();
    cleaned.dosage = cleaned.dosage.trim();
    cleaned.strength = cleaned.strength.trim();
    cleaned.form = cleaned.form.trim();
    cleaned.manufacturer = cleaned.manufacturer.trim();
    cleaned.instructions = cleaned.instructions.trim();

    return cleaned;
  }

  // Method to get alternative medication suggestions
  async getAlternativeSuggestions(medicationName: string): Promise<string[]> {
    try {
      const prompt = `
        Provide 3-5 alternative medication names that are similar to "${medicationName}" or could be used for the same condition.
        Return only a simple list, one per line, without numbering or additional text.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the response into an array
      const alternatives = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.match(/^\d+\./))
        .slice(0, 5);

      return alternatives;
    } catch (error) {
      console.error('Error getting alternatives:', error);
      return [];
    }
  }

  // Method to get medication information
  async getMedicationInfo(medicationName: string): Promise<any> {
    try {
      const prompt = `
        Provide detailed information about the medication "${medicationName}" including:
        - Common uses
        - Side effects
        - Precautions
        - Drug interactions
        - Storage instructions
        
        Format the response as a structured summary suitable for a medication app.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting medication info:', error);
      return 'Information not available';
    }
  }
}

export default new GeminiService();
