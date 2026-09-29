$ErrorActionPreference = 'Stop'
$projectDirectory = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$outputDirectory = [IO.Path]::GetDirectoryName($projectDirectory)
$archivePath = Join-Path $outputDirectory 'bike_portal_stage4_homepage_cloudflare.zip'
if (Test-Path -LiteralPath $archivePath) { throw 'Package already exists. Preserve or rename that ZIP before creating a new one.' }
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [IO.Compression.ZipFile]::Open($archivePath, [IO.Compression.ZipArchiveMode]::Create)
try {
  $files = @()
  foreach ($folder in @('src','data','migrations','docs','scripts','tests')) {
    $files += Get-ChildItem -LiteralPath (Join-Path $projectDirectory $folder) -File -Recurse
  }
  foreach ($name in @('README.md','REDEPLOY.md','wrangler.toml','package.json','package-lock.json','stage4_manifest.json','.gitignore')) {
    $files += Get-Item -LiteralPath (Join-Path $projectDirectory $name) -Force
  }
  foreach ($file in $files) {
    $relative = [IO.Path]::GetRelativePath($projectDirectory, $file.FullName).Replace('\','/')
    [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName, ('bike_portal_stage4_homepage/' + $relative), [IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
} finally { $archive.Dispose() }
Get-Item -LiteralPath $archivePath | Select-Object FullName, Length
Get-FileHash -LiteralPath $archivePath -Algorithm SHA256
