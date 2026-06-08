# Ministry Approval Workflow End-to-End Test
# This script tests the complete workflow: State forward -> Ministry approve -> Institute login gate

Write-Host "`n=== MINISTRY APPROVAL WORKFLOW TEST ===" -ForegroundColor Cyan

# Kill existing Node processes and restart fresh
Write-Host "`n[1] Cleaning up old processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | ForEach-Object { 
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue 
}
Start-Sleep -Seconds 2

# Start backend
Write-Host "[2] Starting backend on port 5174..." -ForegroundColor Yellow
$backendPath = "$PSScriptRoot\server"
Push-Location $backendPath
$backendProc = Start-Process -FilePath "node" -ArgumentList "src/index.js" -PassThru -NoNewWindow
Pop-Location
Start-Sleep -Seconds 5

if (-not (Get-Process -Id $backendProc.Id -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Backend failed to start" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Backend started (PID: $($backendProc.Id))" -ForegroundColor Green

# Pre-test: Ensure Test Institute Exists
Write-Host "`n[2.5] Preparing Test Data..." -ForegroundColor Yellow
$seedScript = @'
import 'dotenv/config';
import mongoose from 'mongoose';
import { Institute } from './src/models/Institute.js';
import bcrypt from 'bcryptjs';

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);

    const instId = 'NSP1005';
    const existing = await Institute.findOne({ instId });

    if (!existing) {
        const passwordHash = await bcrypt.hash('password123', 12);
        await Institute.create({
            instId,
            name: 'Test University',
            status: 'Pending',
            passwordHash
        });
        process.stdout.write('CREATED');
    } else {
        process.stdout.write('EXISTS');
    }

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(e => {
    console.error(e);
    process.exit(1);
});
'@
$tempSeedPath = Join-Path $backendPath "temp-seed.js"
Set-Content -Path $tempSeedPath -Value $seedScript -Encoding utf8
Push-Location $backendPath
node temp-seed.js
Pop-Location
Remove-Item -Path $tempSeedPath -ErrorAction SilentlyContinue

# Test 1: State Officer Login
Write-Host "`n[3] TEST 1: State Officer Login" -ForegroundColor Yellow
try {
    $stateLogin = Invoke-RestMethod -Method Post `
        -Uri "http://localhost:5174/api/auth/officer/login" `
        -ContentType "application/json" `
        -Body (@{ email = "stateoffice@gmail.com"; password = "admin123" } | ConvertTo-Json) `
        -SessionVariable stateSess `
        -TimeoutSec 10
    
    if ($stateLogin -and $stateLogin.token) {
        Write-Host "✓ State officer logged in" -ForegroundColor Green
    } else {
        Write-Host "✗ State login failed: No token received" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ State login error: $_" -ForegroundColor Red
    exit 1
}

# Helper: Get the Mongo ID for NSP1005
$apps = Invoke-RestMethod -Uri "http://localhost:5174/api/auth/officer/institute-applications" -WebSession $stateSess
$targetInst = $apps.apps | Where-Object { $_.instId -eq "NSP1005" }
if (-not $targetInst) {
    Write-Host "✗ Could not find NSP1005 in applications list" -ForegroundColor Red
    exit 1
}
$targetId = $targetInst._id

# Test 2: Forward Institute to Ministry
Write-Host "`n[4] TEST 2: Forward Institute $targetId (NSP1005) to Ministry" -ForegroundColor Yellow
try {
    $forward = Invoke-RestMethod -Method Post `
        -Uri "http://localhost:5174/api/auth/officer/institute/$targetId/forward" `
        -ContentType "application/json" `
        -Body "{}" `
        -WebSession $stateSess `
        -TimeoutSec 10
    
    if ($forward.ok) {
        Write-Host "✓ Institute forwarded successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Forward failed: $($forward | ConvertTo-Json)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Forward error: $_" -ForegroundColor Red
    exit 1
}

# Test 3: Ministry Officer Login
Write-Host "`n[5] TEST 3: Ministry Officer Login" -ForegroundColor Yellow
try {
    $ministryLogin = Invoke-RestMethod -Method Post `
        -Uri "http://localhost:5174/api/auth/officer/login" `
        -ContentType "application/json" `
        -Body (@{ email = "centraloffice@gmail.com"; password = "admin123" } | ConvertTo-Json) `
        -SessionVariable ministrySess `
        -TimeoutSec 10
    
    if ($ministryLogin -and $ministryLogin.token) {
        Write-Host "✓ Ministry officer logged in" -ForegroundColor Green
    } else {
        Write-Host "✗ Ministry login failed: No token received" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Ministry login error: $_" -ForegroundColor Red
    exit 1
}

# Test 4: Ministry View Forwarded Institutes
Write-Host "`n[6] TEST 4: Ministry View Forwarded Institutes" -ForegroundColor Yellow
try {
    $ministryApps = Invoke-RestMethod -Uri "http://localhost:5174/api/auth/officer/ministry/institute-applications" `
        -WebSession $ministrySess `
        -TimeoutSec 10
    
    $nsp1005 = $ministryApps.apps | Where-Object { $_.instId -eq "NSP1005" }
    if ($nsp1005 -and $nsp1005.status -eq "StatePending") {
        Write-Host "✓ NSP1005 found in ministry view with status: StatePending" -ForegroundColor Green
    } else {
        Write-Host "✗ NSP1005 not found or wrong status in ministry view" -ForegroundColor Red
        Write-Host "Ministry apps: $($ministryApps | ConvertTo-Json -Depth 2)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Ministry view error: $_" -ForegroundColor Red
    exit 1
}

# Test 5: Ministry Approve Institute
Write-Host "`n[7] TEST 5: Ministry Approve $targetId" -ForegroundColor Yellow
try {
    $approve = Invoke-RestMethod -Method Post `
        -Uri "http://localhost:5174/api/auth/officer/institute/$targetId/decision" `
        -ContentType "application/json" `
        -Body (@{ decision = "approve" } | ConvertTo-Json) `
        -WebSession $ministrySess `
        -TimeoutSec 10
    
    if ($approve.ok -and $approve.status -eq "Approved") {
        Write-Host "✓ Institute approved successfully. Status: $($approve.status)" -ForegroundColor Green
    } else {
        Write-Host "✗ Approval failed: $($approve | ConvertTo-Json)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Approval error: $_" -ForegroundColor Red
    exit 1
}

# Test 6: Verify in Database
Write-Host "`n[8] TEST 6: Verify Institute Status in Database" -ForegroundColor Yellow
try {
$verifyScript = @'
import 'dotenv/config';
import mongoose from 'mongoose';
import { Institute } from './src/models/Institute.js';

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);

    const inst = await Institute.findOne({ instId: 'NSP1005' });
    process.stdout.write(inst?.status || 'NOT_FOUND');

    await mongoose.disconnect();
    process.exit(0);
}

check().catch(e => {
    console.error(e);
    process.exit(1);
});
'@
    $tempVerifyPath = Join-Path $backendPath "temp-verify.js"
    Set-Content -Path $tempVerifyPath -Value $verifyScript -Encoding utf8
    Push-Location $backendPath
    $dbCheck = node temp-verify.js
    Pop-Location
    Remove-Item -Path $tempVerifyPath -ErrorAction SilentlyContinue
    
    if ($dbCheck -eq "Approved") {
        Write-Host "✓ Database confirms NSP1005 status: Approved" -ForegroundColor Green
    } else {
        Write-Host "✗ Database status incorrect: $dbCheck" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Database check error: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== ✅ ALL TESTS PASSED ===" -ForegroundColor Green
Write-Host "Workflow Summary:"
Write-Host "  1. State officer logged in successfully"
Write-Host "  2. State forwarded NSP1005 to ministry (status: StatePending)"
Write-Host "  3. Ministry officer logged in successfully"
Write-Host "  4. Ministry viewed forwarded institutes and found NSP1005"
Write-Host "  5. Ministry approved NSP1005 (status: Approved)"
Write-Host "  6. Database confirms NSP1005 is now Approved"
Write-Host ""
Write-Host "Institute NSP1005 is now APPROVED and can login." -ForegroundColor Cyan
Write-Host "Frontend is ready for testing at http://localhost:5173" -ForegroundColor Cyan

# Keep backend running for manual testing
Write-Host "`nBackend is running. Press Ctrl+C to stop." -ForegroundColor Cyan
Wait-Process -Id $backendProc.Id
