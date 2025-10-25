import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import gradio as gr

# Load the tokenizer
tokenizer = AutoTokenizer.from_pretrained("IAmPossible/Llama-2-7b-chat-finetune")

# Determine the device: use MPS on Apple Silicon if available; otherwise, fall back to CPU.
device = "mps" if torch.backends.mps.is_available() else "cpu"

model = AutoModelForCausalLM.from_pretrained("IAmPossible/Llama-2-7b-chat-finetune")
model.to(device)
model.eval()

# Define a system prompt that sets the context for the conversation.
SYSTEM_PROMPT = (
    "You are an AI assistant specialized in e-commerce. "
    "You help both customers and retailers: customers might ask for product recommendations "
    "or advice (e.g., 'I want to buy a sweater for this weather condition'), and retailers might ask "
    "for insights (e.g., 'What were the trending products in this domain?'). "
    "Answer clearly, accurately, and in a helpful manner. "
    "If you don't have relevant information then tell the user you don't know about it, sorry."
)

def generate_response(user_message, history):
    """
    This function takes the latest user message and the conversation history,
    builds the prompt (including the system prompt), and uses the model to generate a reply.
    """
    if history is None:
        history = []
    
    # Build the conversation prompt
    prompt = SYSTEM_PROMPT + "\n"
    for user_text, bot_text in history:
        prompt += f"User: {user_text}\n"
        prompt += f"Assistant: {bot_text}\n"
    prompt += f"User: {user_message}\nAssistant: "

    # Encode the prompt and move it to the appropriate device
    input_ids = tokenizer.encode(prompt, return_tensors="pt").to(device)

    # Generate a response from the model.
    output_ids = model.generate(
        input_ids,
        max_new_tokens=150,
        pad_token_id=tokenizer.eos_token_id,
        do_sample=True,
        top_p=0.95,
    )
    
    # Decode the output and extract the assistant's reply.
    output_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    assistant_reply = output_text[len(prompt):].strip()
    if "User:" in assistant_reply:
        assistant_reply = assistant_reply.split("User:")[0].strip()
    
    # Append the new exchange to the history.
    history.append((user_message, assistant_reply))
    return history, history  # Return both for updating the Chatbot component and the state.

# Create the Gradio interface.
with gr.Blocks(title="E-commerce Chatbot") as demo:
    gr.Markdown("## E-commerce Chatbot")
    
    # Chatbot display and state to store conversation history.
    chatbot_component = gr.Chatbot()
    state = gr.State([])

    # Input row with a textbox and a clear button.
    with gr.Row():
        txt_input = gr.Textbox(show_label=False, placeholder="Enter your message and press Enter")
        clear_btn = gr.Button("Clear Conversation")
    
    # Update the chatbot and state when the user submits a message.
    txt_input.submit(generate_response, inputs=[txt_input, state], outputs=[chatbot_component, state])
    
    # Clear conversation history.
    clear_btn.click(lambda: ([], []), None, [chatbot_component, state])

# Launch the Gradio app.
demo.launch()