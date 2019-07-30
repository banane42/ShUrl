# ShUrl
## Page Elements
* Preset Buttons
* Generate Button
* Print Button
* Display the generated vin and barcode
* Display the generated url
## Backend stuff
* Shorten URL
## PRIMARY GOAL:
Create a docker image OR extra points for a serverless/lambda solution that hosts a website meeting the following requirements
- On page load
    - Create random VIN
        - must decode to a real make/model/year and checksum
    - Button to create custom VIN
    - Create QR code from VIN
    - Present QR code and VIN on page
### SECONDARY GOALS (as options):
- provides a shortened URL `[cpht.io/inv/{vin}](http://cpht.io/inv/{vin})` (see Joseph for API calls after Weds) and QR code for URL
- Bit encoded VIN
- If both settings are applied, the VIN in the url should be encoded
- Save settings
- Other???
