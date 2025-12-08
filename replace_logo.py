
import os

file_path = "d:/Repositorios/Libelula 2026/index.html"

search_block = """            <a href="#" class="logo footer-logo">
                <img src="images/logo_light.png" alt="Libélula" class="logo-light">
                <img src="images/libelula_logo_dark.png" alt="Libélula" class="logo-dark">
            </a>"""

replace_block = """            <a href="#" class="logo footer-logo">
                <img src="images/libelula_logo.svg" alt="Libélula">
            </a>"""

try:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if search_block in content:
        new_content = content.replace(search_block, replace_block)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("SUCCESS: Logo replaced.")
    else:
        # Fallback: Try less specific matching if indentation varies
        print("Block not found exactly. Trying line by line approach...")
        # (Optional: implementing fallback logic if needed)
        
except Exception as e:
    print(f"ERROR: {e}")
