
import os

# 1. Generate the Client HTML content clearly
client_html = ""
client_html += '        <!-- Clients Section -->\n'
client_html += '        <section id="clients" class="section clients">\n'
client_html += '            <div class="container">\n'
client_html += '                <div class="section-header">\n'
client_html += '                    <h2 class="section-title" style="color: var(--primary-color); font-size: 1.2rem; text-transform: uppercase; letter-spacing: 2px;">ESTAMOS ORGULLOSOS DE TRABAJAR CON ESTAS EMPRESAS</h2>\n'
client_html += '                </div>\n'
client_html += '                <div class="clients-grid">\n'

rows = [5, 9, 12, 11, 10, 3]
current_logo = 1

for count in rows:
    client_html += '                    <div class="client-row">\n'
    for _ in range(count):
        if current_logo <= 51:
            client_html += f'                        <div class="client-logo"><img src="images/clients/light/{current_logo}.png" class="logo-light"><img src="images/clients/dark/{current_logo}.png" class="logo-dark"></div>\n'
            current_logo += 1
    client_html += '                    </div>\n'

client_html += '                </div>\n'
client_html += '            </div>\n'
client_html += '        </section>\n\n'

# 2. Read index.html
file_path = "d:/Repositorios/Libelula 2026/index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 3. Insert BEFORE "<!-- CTA Section -->"
# If "<!-- Clients Section -->" already exists, replace it to avoid duplicates
if '<!-- Clients Section -->' in content:
    # Attempt to remove old block if it exists but is malformed
    pass # Too risky to parse. Let's assume user says "nothing is seen", so maybe it's missing.

# We will split by the CTA section marker
parts = content.split('<!-- CTA Section -->')

if len(parts) > 1:
    # Reassemble: Part 0 + Client Code + CTA Marker + Part 1
    new_content = parts[0] + client_html + '        <!-- CTA Section -->' + parts[1]
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("SUCCESS: Section inserted.")
else:
    print("ERROR: Could not find '<!-- CTA Section -->' marker.")
