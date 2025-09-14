@echo off
set STAGE=%1

if "%STAGE%"=="" (
    echo Uso: deploy-infra.bat ^<stage^>
    echo Ejemplo: deploy-infra.bat dev
    exit /b 1
)

echo ================================
echo Desplegando infraestructura en %STAGE%
echo ================================

sls deploy --stage %STAGE% -c templates/deploy-infra.yaml