@echo off
cd ..\busca-preco-pro
echo Initializing Git...
git init
git remote add origin https://github.com/gomescomercialbr-lang/busca-preco-pro.git
git add .
git commit -m "Initial commit from Antigravity Hard Reset"
git branch -M main
git push -u origin main
echo Git setup complete.
