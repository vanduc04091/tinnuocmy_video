@echo off
rem Tai canh quay va render lan luot tat ca video (tru lam-nail-o-my).
rem Chay: nhap dup file nay, hoac go  render-qua-dem.bat  trong thu muc tinnuocmy_video.
rem Video nao loi thi bo qua, chay tiep video sau. Nhat ky: out\render-qua-dem.log
cd /d "%~dp0"
if not exist out mkdir out
call git pull

for %%V in (song-o-my-phong-su luong-4000-usd california-vs-texas gia-dinh-4-nguoi luong-cao-kho-tiet-kiem chi-phi-o-to du-hoc-my-chi-phi kham-benh-o-my mua-nha-o-my) do (
  echo.
  echo ===== %%V =====
  echo [%date% %time%] BAT DAU %%V>> out\render-qua-dem.log
  call npm run broll -- %%V
  call npm run render -- %%V --concurrency=4
  if errorlevel 1 (
    echo [%date% %time%] LOI %%V>> out\render-qua-dem.log
  ) else (
    echo [%date% %time%] XONG %%V>> out\render-qua-dem.log
  )
)

echo.
echo Da chay xong tat ca. Xem ket qua trong out\render-qua-dem.log
pause
