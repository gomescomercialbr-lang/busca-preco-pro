@echo off
cd ..\busca-preco-pro
echo Committing UI changes...
git add .
git commit -m "feat: implement Landing Page with SearchBar and ProductCard"
echo Pushing to main...
git push origin main
echo Git push complete.
