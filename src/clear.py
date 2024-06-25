import shutil, os

def clear_dir(dir):
    for f in os.listdir(dir):
        fpath = os.path.join(dir, f)
        if os.path.isfile(fpath) or os.path.islink(fpath):
            os.unlink(fpath)
        elif os.path.isdir(fpath):
            shutil.rmtree(fpath)

clear_dir('./compiled/pages/')
clear_dir('./compiled/styles/')
clear_dir('./compiled/scripts/')