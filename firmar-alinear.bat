@echo off
setlocal

REM ============================
REM CONFIGURACIÓN
REM ============================
set KEYSTORE_NAME=my-release-key.jks
set KEY_ALIAS=react_native_apps_alias
set KEYSTORE_PASS=react_native_APPS
set KEY_PASS=react_native_APPS
set APP_NAME=diego-maptiler
set BUILD_PATH=android\app\build\outputs\apk\release

REM ============================
REM 5. FIRMAR Y ALINEAR APK (si no está firmado)
REM ============================
@REM set UNSIGNED_APK=%BUILD_PATH%\%APP_NAME%-unsigned.apk
set UNSIGNED_APK=%BUILD_PATH%\app-release.apk
set SIGNED_APK=%BUILD_PATH%\%APP_NAME%-signed.apk
set ALIGNED_APK=%BUILD_PATH%\%APP_NAME%-aligned.apk

if exist "%UNSIGNED_APK%" (
  echo 🧩 Alineando APK...
  zipalign -v -p 4 "%UNSIGNED_APK%" "%ALIGNED_APK%"

  echo 🔏 Firmando APK...
  apksigner sign --ks "%KEYSTORE_NAME%" --ks-key-alias "%KEY_ALIAS%" --ks-pass pass:%KEYSTORE_PASS% ^
  --key-pass pass:%KEY_PASS% --out "%SIGNED_APK%" "%ALIGNED_APK%"

  @REM echo ✅ Verificando firma...
  @REM apksigner verify "%SIGNED_APK%"
) else (
  echo ⚠️  No se encontró APK unsigned, es posible que ya esté firmado.
)

REM ============================
REM 6. INSTALAR EN DISPOSITIVO (opcional)
REM ============================
if exist "%SIGNED_APK%" (
  echo 📲 Instalando APK en dispositivo...
  adb install -r "%SIGNED_APK%"
) else (
  echo ⚠️  No se encontró el APK firmado para instalar.
)

echo 🚀 Proceso completado.
pause
endlocal
