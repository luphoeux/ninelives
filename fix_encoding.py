
import os

file_path = "d:/Repositorios/Libelula 2026/index.html"

try:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Search for the broken string seen in terminal
    snippet = "ContÃ¡ctanos"
    if snippet in content:
        print(f"Found broken snippet: {snippet}")
        
        # Try to fix by encoding latin1 -> decoding utf8
        try:
            fixed_content = content.encode('latin-1').decode('utf-8')
            print("Encoding fix successful!")
            
            # Check if snippet looks right now
            if "Contáctanos" in fixed_content:
                print("Snippet corrected to: Contáctanos")
                
                # Write back
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(fixed_content)
                print("File saved with corrected encoding.")
            else:
                print("Fix didn't produce expected string.")
        except UnicodeError as e:
            print(f"Encode technique failed: {e}")
            # Fallback: Manual replacement of common glitches if generic fix fails
            replacements = {
                "Ã¡": "á",
                "Ã©": "é",
                "Ãed": "í", # This one is tricky usually
                "Ã³": "ó",
                "Ãº": "ú",
                "Ã±": "ñ",
                "Ã": "í", # Risky
                "libÃ©lula": "libélula"
            }
            # Be careful with manual replace
            pass
            
    else:
        print("Broken snippet not found directly. Maybe it's different.")

except Exception as e:
    print(f"Error: {e}")
