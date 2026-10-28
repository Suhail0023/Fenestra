# Deploy the current protected build to every company listed in deploy/companies.txt (one short name per line).
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)
python tools/build_protected.py
foreach ($slug in (Get-Content "deploy/companies.txt" | Where-Object { $_.Trim() })) {
  Write-Host "Updating $slug ..."
  Copy-Item "deploy/fly.$slug.toml" fly.deploy.tmp.toml
  fly deploy -c fly.deploy.tmp.toml --app "fenestra-$slug" --ha=false
}
Remove-Item fly.deploy.tmp.toml -ErrorAction SilentlyContinue
