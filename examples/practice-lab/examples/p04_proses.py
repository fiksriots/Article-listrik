import subprocess,sys
result=subprocess.run([sys.executable,'-c','print("pekerjaan selesai")'],capture_output=True,text=True,timeout=2,check=True)
print('Exit code:',result.returncode)
print('Stdout:',result.stdout.strip())
# Argumen berupa list, tanpa shell=True atau interpolasi perintah masukan.
