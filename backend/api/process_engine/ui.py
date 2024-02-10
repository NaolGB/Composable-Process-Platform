class UIComponent:
    def __init__(self) -> None:
        pass

    def create_read_column(
        self,
        content,
        order,
        is_clickable = 0,
        is_editable=0,
        dtype='text',
    ):
        serialized_col = {
            'pe_order': order,
            'pe_is_clickable': is_clickable,
            'pe_is_editable': is_editable,
            'pe_dtype': dtype,
            'pe_content': content
        }

        return serialized_col


class UI:
    def __init__(self) -> None:
        self.view_json = {}

    # def 


x = {
    'title': "Existinbg Master Data",
    'description': "A list of Master Data Types in your organization",
    'components': {
        'component1': {
            'name': "Master Data Types",
            'order': 100,                                                                
            'rows': {
                'row1': {
                    'col1': {
                        'isClickable': 0,
                        'isEditable': 0,
                        'dtype': "string",
                        'content': "plants"
                    },
                    'col2': {
                        'isClickable': 0,
                        'isEditable': 0,
                        'dtype': "number",
                        'content': 25
                    }
                }
            }
        }
    }
}