// DOM Elements
const imageUploadInput = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const examplesSection = document.getElementById('examplesSection');
const resultSection = document.getElementById('resultSection');
const resultPreview = document.getElementById('resultPreview');
const customPrompt = document.getElementById('customPrompt');
const applyPromptButton = document.getElementById('applyPromptButton');
const downloadButton = document.getElementById('downloadButton');
const startOverButton = document.getElementById('startOverButton');
const tryAgainButton = document.getElementById('tryAgainButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const apiKeyModal = document.getElementById('apiKeyModal');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKey = document.getElementById('saveApiKey');
const fileUploadArea = document.querySelector('.file-upload-area');
const previewPlaceholder = document.querySelector('.preview-placeholder');

// State variables
let originalImage = null;
let editedImage = null;
let apiKey = null;
let selectedPrompt = null;

// Use a hardcoded API key as last resort
const HARDCODED_API_KEY = 'AIzaSyDof92c4-qTw3bzr2i1h1Uw8VJ1Ui9ni6o';

// Fetch API key from server on load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, fetching API key...');
    
    // Add drag and drop functionality
    setupDragAndDrop();
    
    // Setup example buttons
    setupExampleButtons();
    
    try {
        const response = await fetch('/api/key');
        const data = await response.json();
        console.log('API response received:', response.status);
        
        if (response.ok && data.key) {
            apiKey = data.key;
            console.log('API key loaded from .env file');
            apiKeyModal.style.display = 'none'; // Hide the modal if showing
        } else {
            console.error('Failed to load API key from server:', data.error);
            
            // Try to use the hardcoded key as a fallback
            apiKey = HARDCODED_API_KEY;
            console.log('Using hardcoded API key as fallback');
            
            // Only show the modal if we don't have a hardcoded key
            if (!apiKey) {
                apiKeyModal.style.display = 'flex';
            }
        }
    } catch (error) {
        console.error('Error fetching API key:', error);
        
        // Try to use the hardcoded key as a fallback
        apiKey = HARDCODED_API_KEY;
        console.log('Using hardcoded API key as fallback after error');
        
        // Only show the modal if we don't have a hardcoded key
        if (!apiKey) {
            apiKeyModal.style.display = 'flex';
        }
    }
});

// Setup example buttons
function setupExampleButtons() {
    const exampleButtons = document.querySelectorAll('.example-button');
    
    exampleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            exampleButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            // Store the prompt
            selectedPrompt = this.getAttribute('data-prompt');
            
            // Clear custom prompt
            customPrompt.value = '';
            
            // Process image with the selected prompt
            if (originalImage && selectedPrompt) {
                processImageEdit(originalImage, selectedPrompt);
            }
        });
    });
}

// Setup drag and drop functionality
function setupDragAndDrop() {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        fileUploadArea.classList.add('highlight');
    }
    
    function unhighlight() {
        fileUploadArea.classList.remove('highlight');
    }
    
    fileUploadArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            imageUploadInput.files = files;
            handleImageUpload(files[0]);
        }
    }
}

// Save manually entered API key (fallback method)
saveApiKey.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
        apiKey = key;
        apiKeyModal.style.display = 'none';
    } else {
        alert('Please enter a valid API key');
    }
});

// Handle image upload
imageUploadInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        const file = e.target.files[0];
        handleImageUpload(file);
    }
});

// Process uploaded image file
function handleImageUpload(file) {
    if (file.type.startsWith('image/')) {
        // Show loading indicator for preview
        imagePreview.innerHTML = '<div class="spinner" style="width: 30px; height: 30px;"></div>';
        
        const reader = new FileReader();
        reader.onload = function(event) {
            originalImage = event.target.result;
            displayImage(imagePreview, originalImage);
            
            // Show the examples section after image is uploaded
            examplesSection.style.display = 'block';
            resultSection.style.display = 'none';
            
            // Smooth scroll to examples section
            setTimeout(() => {
                examplesSection.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload an image file (JPEG, PNG, etc.)');
    }
}

// Display image in container
function displayImage(container, imageSrc) {
    container.innerHTML = '';
    const img = document.createElement('img');
    img.src = imageSrc;
    img.onload = function() {
        // Add a slight reveal animation
        img.style.opacity = 0;
        container.appendChild(img);
        setTimeout(() => {
            img.style.transition = 'opacity 0.5s ease';
            img.style.opacity = 1;
        }, 50);
    };
}

// Apply custom prompt
applyPromptButton.addEventListener('click', () => {
    const prompt = customPrompt.value.trim();
    if (prompt) {
        if (originalImage) {
            processImageEdit(originalImage, prompt);
        } else {
            alert('Please upload an image first');
        }
    } else {
        alert('Please enter a description of the changes you want to make');
    }
});

// Start over button
startOverButton.addEventListener('click', () => {
    // Reset everything to initial state
    originalImage = null;
    editedImage = null;
    selectedPrompt = null;
    
    // Clear the image previews
    imagePreview.innerHTML = '<span class="preview-placeholder">Your image will appear here</span>';
    resultPreview.innerHTML = '';
    
    // Hide sections
    examplesSection.style.display = 'none';
    resultSection.style.display = 'none';
    
    // Clear custom prompt
    if (customPrompt) {
        customPrompt.value = '';
    }
    
    // Remove selected class from all example buttons
    document.querySelectorAll('.example-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Scroll back to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Try different edit button
tryAgainButton.addEventListener('click', () => {
    // Keep the original image but hide the result section
    resultSection.style.display = 'none';
    
    // Show examples section
    examplesSection.style.display = 'block';
    
    // Clear custom prompt
    customPrompt.value = '';
    
    // Remove selected class from all example buttons
    document.querySelectorAll('.example-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Scroll to examples section
    examplesSection.scrollIntoView({ behavior: 'smooth' });
});

// Main image processing function
async function processImageEdit(image, prompt) {
    loadingIndicator.style.display = 'flex';
    
    try {
        // Prepare image data
        const base64Image = image.split(',')[1]; // Remove data URL prefix
        const mimeType = image.split(';')[0].split(':')[1]; // Extract mime type from data URL
        
        // Log image details for debugging
        console.log('Image MIME type:', mimeType);
        console.log('Image data length:', base64Image.length);
        console.log('Using user prompt:', prompt);
        
        // Prepare content parts exactly as in the Node.js example
        const contents = [
            { text: prompt },
            {
                inlineData: {
                    mimeType: mimeType || "image/jpeg",
                    data: base64Image
                }
            }
        ];
        
        // Prepare request body following the Node.js example structure
        const requestBody = {
            contents: [
                {
                    parts: contents
                }
            ],
            generationConfig: {
                responseModalities: ['Text', 'Image']
            }
        };
        
        console.log('Sending request to gemini-2.0-flash-exp-image-generation...');
        console.log('Request body:', JSON.stringify(requestBody, null, 2));
        
        // Make API request to gemini-2.0-flash-exp-image-generation as specified
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (response.ok) {
            // Handle successful response exactly as in the Node.js example
            if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
                const parts = data.candidates[0].content.parts;
                console.log('Response parts:', parts);
                
                // Process each part following the Node.js example
                for (const part of parts) {
                    if (part.text) {
                        console.log('Text response:', part.text);
                    } 
                    else if (part.inlineData) {
                        console.log('Found image in response with MIME type:', part.inlineData.mimeType);
                        console.log('Image data length:', part.inlineData.data.length);
                        
                        // Display the edited image
                        editedImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                        displayImage(resultPreview, editedImage);
                        
                        // Show result section and hide examples section
                        resultSection.style.display = 'block';
                        examplesSection.style.display = 'none';
                        
                        // Scroll to result section
                        resultSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
                
                // Check if we didn't find an image
                if (!editedImage) {
                    throw new Error('No image found in the response');
                }
                
            } else if (data.promptFeedback && data.promptFeedback.blockReason) {
                throw new Error(`Your request was blocked: ${data.promptFeedback.blockReason}`);
            } else {
                throw new Error('Invalid API response format - no image was returned');
            }
        } else if (data.error) {
            throw new Error(`API Error (${data.error.code}): ${data.error.message}`);
        } else {
            throw new Error('API request failed with an unknown error');
        }
    } catch (error) {
        console.error('Error generating content:', error);
        alert(`Error: ${error.message || 'Failed to process image'}`);
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// Download edited image
downloadButton.addEventListener('click', () => {
    if (editedImage) {
        const link = document.createElement('a');
        link.href = editedImage;
        link.download = 'edited-image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});