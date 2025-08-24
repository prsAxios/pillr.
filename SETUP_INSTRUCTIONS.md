# Pillr Setup Instructions

## New Features Added

### 1. Simplified PIN-based Authentication
- Removed complex biometric authentication
- Clean, reliable PIN setup and verification
- No more authentication errors or bypasses

### 2. AI-Powered Medication Scanner
- **Gemini API Integration**: Uses Google's Gemini AI to analyze medication images
- **Image Analysis**: Automatically extracts medication name, dosage, strength, form, and more
- **Smart Recognition**: Identifies active ingredients and manufacturer information
- **Confidence Scoring**: Shows how confident the AI is about the extracted information

### 3. Multilingual Support
- **5 Languages**: English, Spanish, French, German, Hindi
- **Dynamic Switching**: Change language on-the-fly from the home screen
- **Complete Coverage**: All app text is translated
- **Native Names**: Shows language names in their native script

## Setup Requirements

### 1. Install Dependencies
```bash
npm install @google/generative-ai expo-image-picker expo-camera expo-media-library i18next react-i18next
```

### 2. Gemini API Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Create a `.env` file in your project root:
```env
EXPO_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Permissions
The app will request these permissions:
- **Camera**: To take photos of medications
- **Photo Library**: To select existing medication images
- **Media Library**: To access saved images

## How to Use

### AI Medication Scanner
1. **Navigate**: Go to Home → "Scan Medication" button
2. **Take Photo**: Use camera or select from gallery
3. **Analyze**: AI processes the image and extracts details
4. **Review**: Check extracted information and confidence score
5. **Confirm**: Save to medication list or edit details

### Language Switching
1. **Access**: Tap the language icon (🌐) in the home screen header
2. **Select**: Choose from 5 supported languages
3. **Apply**: Language changes immediately throughout the app

## Features Breakdown

### Authentication Flow
```
App Launch → Check PIN → Route Decision
                ↓
        ┌─────────┬─────────┐
        │ No PIN  │ Has PIN │
        │ Setup   │ Verify  │
        └─────────┴─────────┘
```

### AI Scanner Flow
```
Select Image → Validate → AI Analysis → Extract Details → Confirm & Save
```

### Multilingual System
- **i18next**: Industry-standard internationalization
- **Dynamic Loading**: Languages loaded on-demand
- **Fallback**: English as default if translation missing
- **Context-Aware**: Medical terminology properly translated

## Technical Implementation

### Gemini Service (`utils/geminiService.ts`)
- **Image Analysis**: Converts images to base64 for API
- **JSON Parsing**: Extracts structured medication data
- **Validation**: Ensures data quality and completeness
- **Error Handling**: Graceful fallbacks for API failures

### Image Service (`utils/imageService.ts`)
- **Camera Integration**: Native camera access
- **Gallery Picker**: Photo library selection
- **Image Validation**: Size, quality, and format checks
- **Permission Management**: Handles camera/gallery access

### Language System (`utils/i18n.ts`)
- **Resource Management**: Efficient language switching
- **Translation Keys**: Organized by feature and context
- **Fallback Chain**: Ensures text always displays
- **Performance**: Minimal memory footprint

## Troubleshooting

### Common Issues

1. **Gemini API Errors**
   - Check API key in `.env` file
   - Verify internet connection
   - Ensure API key has proper permissions

2. **Image Analysis Failures**
   - Use clear, well-lit photos
   - Ensure medication text is readable
   - Check image size (200px - 4000px recommended)

3. **Language Not Changing**
   - Restart app after language change
   - Check i18n initialization in `_layout.tsx`
   - Verify translation files are properly loaded

4. **Camera Permissions**
   - Go to device settings → Apps → Pillr → Permissions
   - Enable camera and storage permissions
   - Restart app after permission changes

### Performance Tips

1. **Image Quality**: Use 4:3 aspect ratio for best results
2. **File Size**: Keep images under 10MB for faster processing
3. **Language**: Switch languages only when needed
4. **Cache**: App caches analyzed images for better performance

## Future Enhancements

### Planned Features
1. **Offline Analysis**: Local AI models for privacy
2. **Batch Processing**: Analyze multiple medications at once
3. **Voice Commands**: Multilingual voice input
4. **Advanced Recognition**: Barcode/QR code scanning
5. **Drug Interactions**: AI-powered interaction checking

### API Improvements
1. **Rate Limiting**: Smart API usage optimization
2. **Caching**: Local storage of analysis results
3. **Batch Requests**: Multiple images in single API call
4. **Fallback Models**: Alternative AI services

## Support

For technical support or feature requests:
1. Check the troubleshooting section above
2. Review console logs for error details
3. Verify all dependencies are properly installed
4. Ensure environment variables are set correctly

## Security Notes

- **API Keys**: Never commit `.env` files to version control
- **Image Data**: Images are processed locally before API calls
- **User Privacy**: No medication data is stored on external servers
- **Permissions**: Only requested permissions are used for core functionality
