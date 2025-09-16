echo "Building back microservice"
$back_path=".\microservices\back"
$dist_path="$back_path\dist"
$venv_path="$back_path\venv"
. "$venv_path\Scripts\activate"
$site_packages_path="$venv_path\Lib\site-packages"
pip install pyinstaller
pyinstaller --onefile --collect-data opengeodeweb_back --collect-data pegghy_back --recursive-copy-metadata pegghy_back "$site_packages_path\pegghy_back\app.py" --distpath $dist_path -n pegghy-back --clean
Copy-Item $dist_path\pegghy-back.exe .\