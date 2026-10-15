$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$env:PORT = '8790'
Set-Location -LiteralPath $projectRoot
$nodeExe = (Get-Command node.exe -ErrorAction Stop).Source
& $nodeExe (Join-Path $PSScriptRoot 'preview.js')
exit $LASTEXITCODE
