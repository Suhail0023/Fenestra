# Fenestra Site: one-script deployment to Fly.io (Windows PowerShell).
# Right-click this file > Run with PowerShell, or in PowerShell:  .\deploy.ps1
# If Windows blocks it:  Set-ExecutionPolicy -Scope Process Bypass   then run again.
# Passwords you type stay on your computer and go straight to Fly as secrets.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

function Plain($s) { [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)) }
function Ask($label, $secret) { if ($secret) { Plain (Read-Host $label -AsSecureString) } else { Read-Host $label } }

# 1. flyctl
if (-not (Get-Command fly -ErrorAction SilentlyContinue)) {
  Write-Host "Installing the Fly tool..."
  iwr https://fly.io/install.ps1 -useb | iex
  $env:Path += ";$env:USERPROFILE\.fly\bin"
}
fly auth whoami 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Host "A browser will open: sign in or sign up, and add a payment card."; fly auth login }

# 2. app and volume
$app = Read-Host "Choose a unique app name (lower-case letters, numbers, dashes), e.g. fenestra-yourcompany"
(Get-Content fly.toml) -replace '^app = .*', "app = `"$app`"" | Set-Content fly.toml
fly apps create $app
fly volumes create fenestra_data --size 3 --region fra --app $app --yes

# 3. secrets
$s = @()
$admin = Ask "First Management password (long, 12+ characters)" $true
$s += "INIT_ADMIN_PASSWORD=$admin"
if ((Read-Host "Set up email now? (y/n)") -eq "y") {
  $s += "SMTP_HOST=" + (Read-Host "SMTP host (for example smtp.office365.com)")
  $s += "SMTP_PORT=" + (Read-Host "SMTP port (587)")
  $u = Read-Host "SMTP user (the sending email address)"
  $s += "SMTP_USER=$u"
  $s += "SMTP_PASS=" + (Ask "SMTP password or app password" $true)
  $s += "SMTP_FROM=Fenestra Site <$u>"
}
if ((Read-Host "Set up WhatsApp with Twilio now? (y/n)") -eq "y") {
  $s += "TWILIO_SID=" + (Read-Host "Twilio Account SID")
  $s += "TWILIO_TOKEN=" + (Ask "Twilio Auth Token" $true)
  $s += "TWILIO_WA_FROM=" + (Read-Host "Twilio WhatsApp number, for example +14155238886")
}
fly secrets set --app $app --stage @s

# 4. deploy
fly deploy --app $app --ha=false
Write-Host ""
Write-Host "Done. Open https://$app.fly.dev  and log in as: management  with the password you typed."
Write-Host "Then go to Setup > Server services and press Send test message."
