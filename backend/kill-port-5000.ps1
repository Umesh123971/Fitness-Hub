Write-Host "🔍 Checking port 5000..." -ForegroundColor Cyan

try {
    $connections = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
    
    if ($connections) {
        $processIds = $connections.OwningProcess | Select-Object -Unique
        
        foreach ($pid in $processIds) {
            $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "🔴 Killing: $($process.Name) (PID: $pid)" -ForegroundColor Red
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                Start-Sleep -Milliseconds 500
            }
        }
        
        Write-Host "✅ Port 5000 is now free!" -ForegroundColor Green
    } else {
        Write-Host "✅ Port 5000 is already free!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ Could not check port 5000" -ForegroundColor Yellow
}