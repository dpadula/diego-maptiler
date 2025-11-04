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
REM 1. PREBUILD (crea carpeta android si no existe)
REM ============================
@REM echo 🔧 Ejecutando Expo Prebuild...
@REM set CI=1 && npx expo prebuild

REM ============================
REM 2. GENERAR KEYSTORE SI NO EXISTE
REM ============================
if not exist "%KEYSTORE_NAME%" (
  echo 🔑 Generando nuevo keystore...
  keytool -genkeypair -v -keystore %KEYSTORE_NAME% -alias %KEY_ALIAS% -keyalg RSA -keysize 2048 -validity 10000 -storepass %KEYSTORE_PASS% -keypass %KEY_PASS% -dname "CN=MiApp, OU=IT, O=MiEmpresa, L=SantaFe, ST=SF, C=AR"
) else (
  echo 🗝️  Keystore existente encontrado.
)

REM ============================
REM 3. CONFIGURAR VARIABLES DE FIRMA (Gradle)
REM ============================
echo 📄 Escribiendo gradle.properties...
echo. >> android\gradle.properties
(
echo MYAPP_RELEASE_STORE_FILE=%KEYSTORE_NAME%
echo MYAPP_RELEASE_KEY_ALIAS=%KEY_ALIAS%
echo MYAPP_RELEASE_STORE_PASSWORD=%KEYSTORE_PASS%
echo MYAPP_RELEASE_KEY_PASSWORD=%KEY_PASS%
) >> android\gradle.properties

REM ============================
REM 4. COMPILAR APK RELEASE
REM ============================
echo 🏗️  Compilando APK...
cd android
call gradlew.bat clean
call gradlew.bat :app:assembleRelease
cd ..

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


REM ============================
REM 7. COPY TO ROOT FOLDER
REM ============================
if exist "%SIGNED_APK%" (
  echo 📲 Copiando APK al root del proyecto...
  copy "%SIGNED_APK%" .
) else (
  echo ⚠️  No se encontró el APK firmado para copiar
)

echo 🚀 Proceso completado.
pause
endlocal
