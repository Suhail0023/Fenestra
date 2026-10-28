# Create a new hosted company installation (its own app, its own data volume, its own admin) on Fly.io.
# Run from the readable source folder (kept private):  .\deploy\new_company.ps1
# Customers receive only the web address and logins, never the files.
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)
function Plain($s) { [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)) }
if (-not (Get-Command fly -ErrorAction SilentlyContinue)) { iwr https://fly.io/install.ps1 -useb | iex; $env:Path += ";$env:USERPROFILE\.fly\bin" }
$slug = (Read-Host "Company short name (lower-case letters, numbers, dashes), e.g. acme").ToLower() -replace '[^a-z0-9-]', ''
$holder = Read-Host "Copyright holder shown in the app (your name or company)"
$app = "fenestra-$slug"
$region = Read-Host "Region (Enter for fra)"; if (-not $region) { $region = "fra" }
python tools/build_protected.py
(Get-Content fly.release.toml) -replace '^app = .*', "app = `"$app`"" -replace '^primary_region = .*', "primary_region = `"$region`"" | Set-Content "deploy/fly.$slug.toml"
fly apps create $app
fly volumes create fenestra_data --size 3 --region $region --app $app --yes
$admin = Plain (Read-Host "First Management password for this company (12+ characters)" -AsSecureString)
fly secrets set "INIT_ADMIN_PASSWORD=$admin" "COPYRIGHT_HOLDER=$holder" --app $app --stage
Copy-Item "deploy/fly.$slug.toml" fly.deploy.tmp.toml
fly deploy -c fly.deploy.tmp.toml --app $app --ha=false
Remove-Item fly.deploy.tmp.toml
Add-Content "deploy/companies.txt" $slug
Write-Host "Done. Address: https://$app.fly.dev   (add the customer's own domain with: fly certs add app.customer.com --app $app)"
Write-Host "The user name is 'management' with the password you typed. The Couteau administrator account is created too."
