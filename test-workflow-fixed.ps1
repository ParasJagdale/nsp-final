Write-Host "`nStarting Ministry Approval Workflow E2E Test...`n"

Write-Host "Cleaning up old Node processes..."
Get-Process node -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}

Start-Sleep 2

$backendPath = Join-Path $PSScriptRoot 'server'

Write-Host "Starting backend server..."
Push-Location $backendPath
$backendProc = Start-Process node 'src/index.js' -PassThru -NoNewWindow
Pop-Location

Start-Sleep 5

if (-not (Get-Process -Id $backendProc.Id -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Backend failed to start"
    exit 1
}

Write-Host "Backend started successfully.`n"

Write-Host "Registering a test institute via API..."
$instReg = Invoke-RestMethod -Method Post `
  -Uri 'http://localhost:5174/api/auth/register/institute' `
  -ContentType 'application/json' `
  -Body (@{ name='API Test University'; password='password123' } | ConvertTo-Json)

$targetInstId = $instReg.instId
Write-Host "Test institute registered successfully with ID: $targetInstId`n"

Write-Host "Logging in as State Officer..."
$stateLogin = Invoke-RestMethod -Method Post `
  -Uri 'http://localhost:5174/api/auth/officer/login' `
  -ContentType 'application/json' `
  -Body (@{ email='stateoffice@gmail.com'; password='admin123'} | ConvertTo-Json) `
  -SessionVariable stateSess
Write-Host "State Officer logged in successfully."

Write-Host "Finding institute $targetInstId in pending applications..."

$apps = Invoke-RestMethod -Uri 'http://localhost:5174/api/auth/officer/institute-applications' -WebSession $stateSess
$target = $apps.apps | Where-Object { $_.instId -eq $targetInstId }

$targetId = $target._id

if (-not $targetId) {
    Write-Host "Error: Could not find $targetInstId in pending applications."
    exit 1
}
Write-Host "Found application with MongoDB ID: $targetId"

Write-Host "Forwarding institute $targetInstId to Ministry..."
Invoke-RestMethod -Method Post `
  -Uri ('http://localhost:5174/api/auth/officer/institute/' + $targetId + '/forward') `
  -WebSession $stateSess `
  -Body '{}' `
  -ContentType 'application/json'
Write-Host "Institute forwarded successfully.`n"

Write-Host "Logging in as Ministry Officer..."
$ministryLogin = Invoke-RestMethod -Method Post `
  -Uri 'http://localhost:5174/api/auth/officer/login' `
  -ContentType 'application/json' `
  -Body (@{ email='centraloffice@gmail.com'; password='admin123'} | ConvertTo-Json) `
  -SessionVariable ministrySess
Write-Host "Ministry Officer logged in successfully."

Write-Host "Approving institute $targetInstId..."
Invoke-RestMethod -Method Post `
  -Uri ('http://localhost:5174/api/auth/officer/institute/' + $targetId + '/decision') `
  -WebSession $ministrySess `
  -Body (@{ decision='approve'} | ConvertTo-Json) `
  -ContentType 'application/json'
Write-Host "Institute approved successfully.`n"

Write-Host "ALL TESTS COMPLETED SUCCESSFULLY!"
Write-Host "Backend is still running for manual testing. Press Ctrl+C to stop."

Wait-Process -Id $backendProc.Id
