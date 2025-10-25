from dotenv import load_dotenv
import os
import google.generativeai as genai
from PIL import Image
import sys
import json

# Load environment variables
load_dotenv()

# Configure the Google Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Function to interact with the Google Gemini API and get a response
def get_gemini_response(input, image, prompt):
    # Use the new model, gemini-1.5-flash
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content([input, image[0], prompt])
    return response.text


# Function to prepare the image data for processing
def input_image_setup(uploaded_file_path):
    if uploaded_file_path is not None:
        # Open the file in binary mode and read it into bytes
        with open(uploaded_file_path, 'rb') as file:
            bytes_data = file.read()  # Read the entire file content into bytes

        # Return image data in the expected format
        image_parts = [
            {
                "mime_type": "image/jpeg",  # Adjust MIME type as necessary
                "data": bytes_data
            }
        ]
        return image_parts
    else:
        raise FileNotFoundError("No file uploaded")

# Function to process the request
def process_image(input_prompt, uploaded_file_path, input_text):
    image_data = input_image_setup(uploaded_file_path)
    response = get_gemini_response(input_text, image_data, input_prompt)
    return response


def parse_text_data(input_text):
    # For now, let's do a simple text parsing. You can extend this with NLP libraries or custom logic.
    
    # Example: Splitting the text into sentences
    sentences = input_text.split('.')
    
    # Create a structured JSON format to return
    parsed_data = {
        "original_text": input_text,
        "sentence_count": len(sentences),
        "sentences": sentences,
    }
    
    return json.dumps(parsed_data)


    

# def scan_image_and_extract_ingredients(uploaded_file_path):
#     try:
#         # Prepare image data
#         image_data = input_image_setup(uploaded_file_path)

#         # Define the prompt for extracting ingredients in the new format
#         ingredient_prompt = (
#             "Extract all the food ingredients from the image and provide the information in the following format: \n\n"
#             "Nutrient Breakdown for the Product:\n\n"
#             "Nutrient | Per 100g/ml | Explanation\n"
#             "Calories | X kcal | Energy from one serving.\n"
#             "Protein | X g | Supports muscle health.\n"
#             "Carbohydrates | X g | Source of energy.\n"
#             "Fats | X g | Provides essential fatty acids.\n"
#             "... and so on for other nutrients. Keep the format consistent and neat."
#         )

#         # Use the gemini-pro-vision model to generate content
#         model = genai.GenerativeModel('gemini-pro-vision')
#         result = model.generate_content([image_data[0], ingredient_prompt], stream=True)
#         result.resolve()

#         # Return the extracted ingredients
#         return result.text

#     except Exception as e:
#         return str(e)
    
    
    
def scan_image_and_extract_ingredients(uploaded_file_path):
    # Define the prompt and include family data
    
    ingredient_prompt = (
        """You are a professional nutritionist tasked with analyzing food items from an image. Your goal is to estimate the food quality of the food label in the image, as well as provide detailed information on how safe is the product for consumption. The information should be structured in the following format:

Calories: [Caloric value of the food item in kcal]
Proteins: [Amount of protein in grams]
Carbohydrates: [Amount of carbohydrates in grams]
Fats: [Amount of fats in grams]
Vitamins: [List of vitamins, if applicable]
How safe is the product for consumption: [provide a brief explanation for a naive user]
"""
    )

    # Process the image
    image_data = input_image_setup(uploaded_file_path)
    
    # Get the response from the model
    response = get_gemini_response("Extract Ingredients from the Data", image_data, ingredient_prompt)
    return response


# input_prompt="""
# You are a professional nutritionist tasked with analyzing the nutritional value information from an image. Your goal is to extract valuable information from the food product label from the image and provide a detailed BUT BRIEF response about the nutritional value of it so that the user is aware of what is contained in it.Format the output properly.
# """
input_prompt = """
Along with that you are a professional e-commerce data analyst. Analyze the image provided and determine how many rows of information are present in the image. Do not extract the details from each row, just return the number of rows as an integer.

Do not include any text outside the number of rows. Just return the integer value representing the number of rows in the image.
"""



# Main function for executing logic
def main():
    sys.stdout.reconfigure(encoding='utf-8')

    # Ensure at least 3 arguments (command, input_data, and file_path) are provided
    if len(sys.argv) < 3:
        print("Error: Not enough arguments provided!")
        sys.exit(1)

    command = sys.argv[1]

    # If the command is 'process_image', the file path (image path) is expected
    if command == 'process_image':
        file_path = sys.argv[2]  # file_path is the second argument
        response = process_image(input_prompt, file_path, "Input prompt text")
        print(response)
    
    # If the command is 'process_text', the input data (text) is expected
    elif command == 'process_text':
        input_data = sys.argv[2]  # input_data is the second argument for text
        response = parse_text_data(input_data)
        print(response)

    else:
        print(f"Unknown command: {command}")
        sys.exit(1)



if __name__ == '__main__':
    main()