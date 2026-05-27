# Windows Setup — Fix PowerShell Execution Policy Error

## The Error
```
npm.ps1 cannot be loaded because running scripts is disabled on this system.
```
This is a **Windows security setting**, not a code bug. PowerShell blocks unsigned scripts by default.

---

## ✅ Quickest Fix — Double-click the batch file

1. Double-click **`FIX_AND_RUN.bat`** in this folder.
2. It will fix the policy and start the dev server automatically.

---

## Manual Fix (one-time, run once in PowerShell)

Open **PowerShell** and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```
Then restart your terminal and run `npm run dev` as normal.

---

## Alternative — Use CMD instead of PowerShell

Open **Command Prompt** (`cmd.exe`, not PowerShell) and run:
```
npm run dev
```
CMD is not affected by this policy restriction.
