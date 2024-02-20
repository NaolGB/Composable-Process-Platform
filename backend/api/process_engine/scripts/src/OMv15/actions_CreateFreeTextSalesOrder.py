import json
from openai import OpenAI
from data_api import DocumentWrapper, DocumentApi, DocumentMasterDataWrapper, DocumentMasterDataApi, MasterDataWrapper, MasterDataApi

api_key='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'
client = OpenAI(api_key=api_key)

def action():
    free_text = DocumentApi(process_type='OMv15', process_instance_id='')
    response = client.chat.completions.create(
    model="gpt-3.5-turbo-0125",
    response_format={ "type": "json_object" },
    messages=[
        {
                "role": "system",
                "content": """You are a helpful assistant. That parses free text orders into valid json format.
                For each material you return a json response like this: Example: [free text: from John Stinscen <noreply@tm.openai.com> Hey, can I get 12 MacBooks]
                "customer": {"Name": }
                "materials": [{"Name": "MacBooks", "Quantiyt": "12", "Unit": "pcs"}]
                """
            },
            {
                "role": "user",
                "content": "Hey, its Jack Drove, please send me 35 bananas, 5 standing desks, and 2500 notebooks"
            }
    ]
    )
    json_response = json.loads(response.choices[0].message.content)
    return json_response

if __name__ == '__main__':
    action()