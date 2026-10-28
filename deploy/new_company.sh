#!/usr/bin/env bash
# Create a new hosted company installation on Fly.io (bash version of new_company.ps1). Run from the private source folder.
set -e; cd "$(dirname "$0")/.."
read -rp "Company short name (a-z, 0-9, dash): " slug; slug=$(echo "$slug" | tr 'A-Z' 'a-z' | tr -cd 'a-z0-9-')
read -rp "Copyright holder shown in the app: " holder
read -rp "Region [fra]: " region; region=${region:-fra}
read -rsp "First Management password (12+ chars): " admin; echo
app="fenestra-$slug"
python3 tools/build_protected.py
sed -e "s/^app = .*/app = \"$app\"/" -e "s/^primary_region = .*/primary_region = \"$region\"/" fly.release.toml > "deploy/fly.$slug.toml"
fly apps create "$app"; fly volumes create fenestra_data --size 3 --region "$region" --app "$app" --yes
fly secrets set "INIT_ADMIN_PASSWORD=$admin" "COPYRIGHT_HOLDER=$holder" --app "$app" --stage
cp "deploy/fly.$slug.toml" fly.deploy.tmp.toml; fly deploy -c fly.deploy.tmp.toml --app "$app" --ha=false; rm -f fly.deploy.tmp.toml
echo "$slug" >> deploy/companies.txt
echo "Done: https://$app.fly.dev"
