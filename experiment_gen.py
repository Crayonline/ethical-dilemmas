import ollama

response = ollama.generate(model='mistral',
prompt='what is a qubit?')
print(response['response'])