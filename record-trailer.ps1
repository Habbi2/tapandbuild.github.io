# ===========================================
# Tap & Build - Trailer Recording Script
# ===========================================
# This script opens the trailer in Chrome and records it using Windows Game Bar
#
# REQUIREMENTS:
# - Google Chrome installed
# - Windows 10/11 with Xbox Game Bar enabled
#
# HOW TO USE:
# 1. Run this script in PowerShell
# 2. The trailer will open in fullscreen with auto-play
# 3. Press Win+Alt+R to START recording when ready
# 4. Wait for the trailer to finish (~65 seconds)
# 5. Press Win+Alt+R to STOP recording
# 6. Video saved to: C:\Users\[YourName]\Videos\Captures\
#
# ===========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   TAP & BUILD - TRAILER RECORDER" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$trailerPath = Join-Path $scriptDir "trailer.html"

# Check if trailer exists
if (-not (Test-Path $trailerPath)) {
    Write-Host "ERROR: trailer.html not found!" -ForegroundColor Red
    Write-Host "Make sure this script is in the website folder." -ForegroundColor Yellow
    exit 1
}

# Convert to file URL with autoplay parameter
$trailerUrl = "file:///$($trailerPath -replace '\\', '/')?autoplay=true"

Write-Host "Trailer found: $trailerPath" -ForegroundColor Green
Write-Host ""
Write-Host "INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host "1. Chrome will open in fullscreen with auto-play" -ForegroundColor White
Write-Host "2. Press Win+Alt+R to START recording" -ForegroundColor White
Write-Host "3. Wait ~65 seconds for trailer to finish" -ForegroundColor White
Write-Host "4. Press Win+Alt+R to STOP recording" -ForegroundColor White
Write-Host "5. Video saves to: Videos\Captures\" -ForegroundColor White
Write-Host ""
Write-Host "Press ENTER to launch Chrome..." -ForegroundColor Cyan
Read-Host

# Find Chrome
$chromePaths = @(
    "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)

$chromePath = $null
foreach ($path in $chromePaths) {
    if (Test-Path $path) {
        $chromePath = $path
        break
    }
}

if (-not $chromePath) {
    Write-Host "ERROR: Chrome not found!" -ForegroundColor Red
    Write-Host "Opening in default browser instead..." -ForegroundColor Yellow
    Start-Process $trailerUrl
} else {
    Write-Host "Launching Chrome in fullscreen mode..." -ForegroundColor Green
    
    # Launch Chrome with kiosk mode (fullscreen) and disable infobars
    $chromeArgs = @(
        "--kiosk",
        "--start-fullscreen",
        "--disable-infobars",
        "--disable-extensions",
        "--disable-translate",
        "--no-first-run",
        "--disable-default-apps",
        $trailerUrl
    )
    
    Start-Process -FilePath $chromePath -ArgumentList $chromeArgs
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Chrome launched! Auto-play will start in 1 second." -ForegroundColor Green
Write-Host ""
Write-Host "REMINDER:" -ForegroundColor Yellow
Write-Host "  Win+Alt+R = Start/Stop Recording" -ForegroundColor White
Write-Host "  ESC = Exit fullscreen" -ForegroundColor White
Write-Host "  A = Toggle auto-play (if needed)" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Calculate total duration (18 seconds total)
$totalDuration = 1.2 + 1 + 1.5 + 1.2 + 1.2 + 1.2 + 1 + 1 + 1 + 1.2 + 1 + 1.2 + 1.8 + 1 + 2
Write-Host "Total trailer duration: ~$([math]::Round($totalDuration)) seconds" -ForegroundColor Magenta
Write-Host ""

# Optional: Countdown timer
Write-Host "Press ENTER after you've started recording to see countdown timer..." -ForegroundColor Cyan
Read-Host

Write-Host ""
Write-Host "Recording timer:" -ForegroundColor Yellow
for ($i = [math]::Ceiling($totalDuration); $i -ge 0; $i--) {
    $mins = [math]::Floor($i / 60)
    $secs = $i % 60
    Write-Host "`r  Time remaining: $mins`:$($secs.ToString('00'))   " -NoNewline -ForegroundColor White
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  TRAILER COMPLETE!" -ForegroundColor Green
Write-Host "  Press Win+Alt+R to stop recording" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your video is saved to:" -ForegroundColor Cyan
Write-Host "  $env:USERPROFILE\Videos\Captures\" -ForegroundColor White
Write-Host ""
