import shutil, os

for f in os.listdir('./compiled/pages/'): #remove all files in ./compiled/pages
    fpath = os.path.join('./compiled/pages/', f)
    if os.path.isfile(fpath) or os.path.islink(fpath):
        os.unlink(fpath)
    elif os.path.isdir(fpath):
        shutil.rmtree(fpath)
shutil.copytree('./pages/', './compiled/pages/', dirs_exist_ok=True) #copy ./pages/ to ./compiled/pages/