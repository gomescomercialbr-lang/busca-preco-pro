@echo off
echo Checking Node version...
node -v
cd ..
if not exist "busca-preco-pro" (
    echo Creating directory busca-preco-pro...
    mkdir "busca-preco-pro"
) else (
    echo Directory busca-preco-pro already exists.
)
cd "busca-preco-pro"
echo Initializing Next.js app...
call npx -y create-next-app@latest . --yes --typescript --tailwind --eslint --src-dir --import-alias "@/*" --use-npm
echo Done.
