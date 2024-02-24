import json
from openai import OpenAI
from data_api import DocumentApi, utils, DocumentMasterDataWrapper

api_key='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'
client = OpenAI(api_key=api_key)

def action():
    free_text = DocumentApi(document_id='SODv01').get_document_dict()['FreeText']
    print(free_text)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        response_format={ "type": "json_object" },
        messages=[
            {
                    "role": "system",
                    "content": """You are a helpful assistant. That parses free text orders into valid json format.
                    For each material you return a json response like this: Example: [free text: from John Stinscen <noreply@tm.openai.com> Hey, can I get 12 MacBooks]
                    "materials": [{"Name": "MacBooks", "Quantity": "12", "Unit": "pcs"}]
                    """
                },
                {
                    "role": "user",
                    "content": f"{free_text}"
                }
        ]
    )
    json_response = json.loads(response.choices[0].message.content)

    for material in json_response['materials']:
        id = material['Name'].strip()
        id = id.replace(' ', '_')
        wrapped_data = str(DocumentMasterDataWrapper(document_id='SODv01', lead_object='Materialv01', master_data_id=id, data=material))
        utils().log(wrapped_data)

if __name__ == '__main__':
    action()