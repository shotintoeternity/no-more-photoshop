# Image Editor with Gemini API

A web application that allows users to edit images using Google's Gemini API.

## Features

- Upload images for editing
- Describe changes you want to make in natural language
- View the AI-generated edited image
- Download the edited result
- Make additional edits to already modified images

## Requirements

- Node.js (v14 or higher)
- A Gemini API key (get one from [Google AI Studio](https://ai.google.dev/))
- A modern web browser

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file from the example file:
   ```
   cp .env.example .env
   ```
4. Edit the `.env` file and replace `your_api_key_here` with your actual Gemini API key
5. Start the server:
   ```
   npm start
   ```
   Or for development with auto-reload:
   ```
   npm run dev
   ```
6. Open your browser and navigate to `http://localhost:3000`
7. Start editing images!

**Note**: If you don't set up the `.env` file, the application will prompt you to enter the API key manually.

## How to Use

1. **Upload an Image**: Click the upload button and select an image from your device
2. **Describe Changes**: Type a description of the changes you want to make (e.g., "Add a sunset background" or "Remove the background and replace with a beach scene")
3. **Review Results**: View the edited image
4. **Download or Make More Changes**: Either download the result or make additional edits

## Limitations and Troubleshooting

- Image editing quality depends on the Gemini API's capabilities
- There may be usage limits based on your Gemini API tier
- Best performance with specific languages (English, Spanish, Japanese, Chinese, Hindi)

### Troubleshooting

If you encounter the "No image found in response" error:

1. Check the API response details by clicking the "Show API Details" button
2. Try a simpler edit request (e.g., "Change the background color to blue" instead of a complex edit)
3. Make sure your image isn't too large (resize to under 4MB if necessary)
4. Verify your API key has the correct permissions for image generation
5. The application will automatically try a fallback to Gemini 1.5 Pro if the first attempt fails

## Privacy Note

Your API key is stored in your local `.env` file and is securely loaded by the Node.js server. It is only used to authenticate requests to Google's Gemini API and is never shared with any third party.
