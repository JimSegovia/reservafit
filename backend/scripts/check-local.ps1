# Script de verificación del backend local - ReservaFit
# Ejecutar desde la carpeta backend: .\scripts\check-local.ps1

Write-Host "🚀 Iniciando verificación del backend local..." -ForegroundColor Cyan
Write-Host ""

# 1. Verificar que Docker esté corriendo
Write-Host "📦 Verificando Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "   ✅ Docker está corriendo" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Docker no está corriendo. Por favor, inicia Docker Desktop." -ForegroundColor Red
    exit 1
}

# 2. Levantar PostgreSQL con Docker Compose
Write-Host "🐘 Levantando PostgreSQL..." -ForegroundColor Yellow
docker-compose up -d
Start-Sleep -Seconds 3

# 3. Verificar que PostgreSQL esté listo
Write-Host "🔍 Verificando conexión a PostgreSQL..." -ForegroundColor Yellow
$maxRetries = 10
$retryCount = 0
$connected = $false

while ($retryCount -lt $maxRetries -and -not $connected) {
    try {
        $result = docker exec reservafit-postgres pg_isready -U postgres 2>&1
        if ($LASTEXITCODE -eq 0) {
            $connected = $true
        }
    } catch {
        $retryCount++
        Write-Host "   Esperando PostgreSQL... ($retryCount/$maxRetries)" -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }
}

if ($connected) {
    Write-Host "   ✅ PostgreSQL está listo" -ForegroundColor Green
} else {
    Write-Host "   ❌ No se pudo conectar a PostgreSQL" -ForegroundColor Red
    exit 1
}

# 4. Ejecutar migraciones
Write-Host "🔄 Ejecutando migraciones..." -ForegroundColor Yellow
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Error al ejecutar migraciones" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Migraciones ejecutadas" -ForegroundColor Green

# 5. Ejecutar seed
Write-Host "🌱 Poblando base de datos con datos de prueba..." -ForegroundColor Yellow
npx tsx prisma/seed.ts
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Error al ejecutar seed" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Seed ejecutado" -ForegroundColor Green

# 6. Iniciar servidor
Write-Host ""
Write-Host "🎉 ¡Todo listo! Iniciando servidor backend..." -ForegroundColor Green
Write-Host "   📡 Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   📊 Prisma Studio: http://localhost:5555" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Gray
Write-Host ""

npm run dev