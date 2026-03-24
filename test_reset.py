import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/password-reset/',
    data=json.dumps({'email': 'tedzayn@gmail.com'}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    resp = urllib.request.urlopen(req, context=ctx)
    print(resp.read().decode())
    print("STATUS", resp.status)
except urllib.error.HTTPError as e:
    print("ERROR STATUS", e.status)
    with open('error.html', 'w', encoding='utf-8') as f:
        f.write(e.read().decode('utf-8'))
    print("Saved to error.html")
