import os
import re
import json

char_dir = '/Users/huanhsu/Desktop/程式碼專案/TJPR/characters'
files = sorted([f for f in os.listdir(char_dir) if f.endswith('.md')])

characters_db = {}
select_options_list = []

for f in files:
    key = f.replace('.md', '')
    if key.startswith('14_'):
        continue
    
    filepath = os.path.join(char_dir, f)
    with open(filepath, 'r', encoding='utf-8') as file:
        text = file.read()
    
    name_match = re.search(r'姓名[：:\s]*([^\n\*]+)', text)
    raw_name = name_match.group(1).strip() if name_match else key.split('_')[-1]
    clean_name = re.split(r'[（(]', raw_name)[0].strip()
    
    age_match = re.search(r'年齡[：:\s]*([^\n\*]+)', text)
    age = age_match.group(1).strip() if age_match else ''
    
    title_match = re.search(r'(身份|身分|職業|現職|職位)[：:\s]*([^\n\*]+)', text)
    title = title_match.group(2).strip() if title_match else ''
    title = title[:40]

    clean_summary = ' '.join(text[:800].replace('\n', ' ').split())

    characters_db[key] = {
        'key': key,
        'name': clean_name,
        'fullName': raw_name,
        'age': age,
        'title': title,
        'file': f,
        'summary': clean_summary
    }

db_json = json.dumps(characters_db, ensure_ascii=False, indent=2)

with open('/Users/huanhsu/Desktop/程式碼專案/TJPR/build_full_app.py', 'w', encoding='utf-8') as f:
    f.write(f'''# -*- coding: utf-8 -*-
import json

db_data = {db_json}
print("Characters DB loaded with", len(db_data), "entries.")
''')

print("Character DB ready.")
