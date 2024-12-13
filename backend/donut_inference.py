#detail on Donut https://huggingface.co/docs/transformers/model_doc/donut
import re
import json
import sys
from transformers import DonutProcessor, VisionEncoderDecoderModel
from datasets import load_dataset
from PIL import Image

import torch

image_path = sys.argv[1]  # Get the file path from the arguments

processor = DonutProcessor.from_pretrained("naver-clova-ix/donut-base-finetuned-cord-v2")
model = VisionEncoderDecoderModel.from_pretrained("naver-clova-ix/donut-base-finetuned-cord-v2")

device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)
# load document image from the DocVQA dataset
#dataset = load_dataset("hf-internal-testing/example-documents", split="test")
#image = dataset[0]["image"]
# Load an image
image = Image.open(image_path)  # Replace with your image path


# prepare decoder inputs
task_prompt = "<s_docvqa><s_question>{user_input}</s_question><s_answer>"
question = "When is the coffee break?"
prompt = task_prompt.replace("{user_input}", question)

#overwrite
task_name = "cord-v2"
task_prompt = f"<s_{task_name}>"
prompt = task_prompt
decoder_input_ids = processor.tokenizer(prompt, add_special_tokens=False, return_tensors="pt").input_ids

pixel_values = processor(image, return_tensors="pt").pixel_values
outputs = model.generate(
    pixel_values.to(device),
    decoder_input_ids=decoder_input_ids.to(device),
    max_length=model.decoder.config.max_position_embeddings,
    pad_token_id=processor.tokenizer.pad_token_id,
    eos_token_id=processor.tokenizer.eos_token_id,
    use_cache=True,
    bad_words_ids=[[processor.tokenizer.unk_token_id]],
    return_dict_in_generate=True,
)

sequence = processor.batch_decode(outputs.sequences)[0]
sequence = sequence.replace(processor.tokenizer.eos_token, "").replace(processor.tokenizer.pad_token, "")
sequence = re.sub(r"<.*?>", "", sequence, count=1).strip()  # remove first task start token
print(processor.token2json(sequence))

result = {"prediction": sequence}
# print(json.dumps(result))